import csv
import json
import math
import pickle
from pathlib import Path

import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import TimeSeriesSplit


BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "qc_final_merged_dataset.csv"
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "random_forest.pkl"

FEATURES = [
    "year", "month", "temperature", "humidity", "rainfall",
    "solar_irradiance", "peak_demand_kw", "lag_1", "lag_2",
    "trend", "month_sin", "month_cos",
]


def read_rows():
    with open(DATASET_PATH, newline="", encoding="utf-8") as file:
        rows = [{k: float(v or 0) for k, v in row.items()} for row in csv.DictReader(file)]

    rows = sorted(rows, key=lambda r: (r["year"], r["month"]))

    for i, row in enumerate(rows):
        month = int(row["month"])
        row["lag_1"] = rows[i - 1]["consumption_kwh"] if i > 0 else row["consumption_kwh"]
        row["lag_2"] = rows[i - 2]["consumption_kwh"] if i > 1 else row["consumption_kwh"]
        row["trend"] = float(i + 1)
        row["month_sin"] = math.sin(2 * math.pi * month / 12)
        row["month_cos"] = math.cos(2 * math.pi * month / 12)

    return rows


def build_xy(rows):
    x = np.array([[row[f] for f in FEATURES] for row in rows], dtype=float)
    y = np.array([row["consumption_kwh"] for row in rows], dtype=float)
    return x, y


def create_model():
    return RandomForestRegressor(
        n_estimators=100,
        random_state=42,
        max_depth=None,
    )


def calculate_metrics(y_true, y_pred):
    return {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "rmse": float(math.sqrt(mean_squared_error(y_true, y_pred))),
        "r2_score": float(r2_score(y_true, y_pred)),
    }


def cross_validate(x, y):
    n_splits = 5 if len(x) >= 30 else 3
    tscv = TimeSeriesSplit(n_splits=n_splits)

    fold_results = []

    for fold, (train_index, test_index) in enumerate(tscv.split(x), start=1):
        x_train, x_test = x[train_index], x[test_index]
        y_train, y_test = y[train_index], y[test_index]

        model = create_model()
        model.fit(x_train, y_train)

        predictions = model.predict(x_test)
        metrics = calculate_metrics(y_test, predictions)

        fold_results.append({
            "fold": fold,
            "mae": round(metrics["mae"], 4),
            "rmse": round(metrics["rmse"], 4),
            "r2_score": round(metrics["r2_score"], 4),
        })

    return fold_results


def average_cv_metrics(fold_results):
    return {
        "cv_mae": round(sum(f["mae"] for f in fold_results) / len(fold_results), 4),
        "cv_rmse": round(sum(f["rmse"] for f in fold_results) / len(fold_results), 4),
        "cv_r2_score": round(sum(f["r2_score"] for f in fold_results) / len(fold_results), 4),
    }


def train():
    MODEL_DIR.mkdir(exist_ok=True)

    rows = read_rows()
    x, y = build_xy(rows)

    fold_results = cross_validate(x, y)
    cv_metrics = average_cv_metrics(fold_results)

    model = create_model()
    model.fit(x, y)

    full_predictions = model.predict(x)
    full_metrics = calculate_metrics(y, full_predictions)

    metrics = {
        "model_type": "Random Forest Regression",
        "mae": round(full_metrics["mae"], 4),
        "rmse": round(full_metrics["rmse"], 4),
        "r2_score": round(full_metrics["r2_score"], 4),
        **cv_metrics,
        "cross_validation": fold_results,
    }

    saved_model = {
        "model_type": "Random Forest Regression",
        "features": FEATURES,
        "model": model,
        "metrics": metrics,
    }

    with open(MODEL_PATH, "wb") as file:
        pickle.dump(saved_model, file)

    print(json.dumps(metrics, indent=4))
    return metrics


if __name__ == "__main__":
    train()
