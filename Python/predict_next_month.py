import csv
import json
import math
import os
import pickle
import subprocess
import sys


def read_rows(dataset_path):
    with open(dataset_path, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        rows = []
        for row in reader:
            parsed = {}
            for key, value in row.items():
                parsed[key] = float(value or 0)
            rows.append(parsed)

    return sorted(rows, key=lambda item: (item["year"], item["month"]))


def predict_row(model, row):
    values = [1.0]
    for feature in model["features"]:
        values.append((row[feature] - model["means"][feature]) / model["stds"][feature])

    return sum(coefficient * value for coefficient, value in zip(model["coefficients"], values))


def next_period(last_row):
    month = int(last_row["month"])
    year = int(last_row["year"])

    if month == 12:
        return year + 1, 1

    return year, month + 1


def main():
    dataset_path = sys.argv[1] if len(sys.argv) > 1 else "qc_final_merged_dataset.csv"
    model_path = sys.argv[2] if len(sys.argv) > 2 else "qc_energy_model_final.pkl"
    metrics_path = sys.argv[3] if len(sys.argv) > 3 else "metrics.json"

    rows = read_rows(dataset_path)
    if len(rows) < 3:
        raise ValueError("At least 3 processed rows are required to predict the next month.")

    if not os.path.exists(model_path):
        subprocess.run(
            [sys.executable, "train_model.py", dataset_path, model_path, metrics_path],
            check=True,
            capture_output=True,
            text=True,
        )

    try:
        with open(model_path, "rb") as model_file:
            model = pickle.load(model_file)
    except Exception:
        subprocess.run(
            [sys.executable, "train_model.py", dataset_path, model_path, metrics_path],
            check=True,
            capture_output=True,
            text=True,
        )
        with open(model_path, "rb") as model_file:
            model = pickle.load(model_file)

    last_row = rows[-1]
    second_last_row = rows[-2]
    next_year, next_month = next_period(last_row)

    forecast_input = {
        "year": float(next_year),
        "month": float(next_month),
        "temperature": last_row["temperature"],
        "humidity": last_row["humidity"],
        "rainfall": last_row["rainfall"],
        "solar_irradiance": last_row["solar_irradiance"],
        "peak_demand_kw": last_row["peak_demand_kw"],
        "lag_1": last_row["consumption_kwh"],
        "lag_2": second_last_row["consumption_kwh"],
        "trend": last_row["trend"] + 1,
        "month_sin": math.sin(2 * math.pi * next_month / 12),
        "month_cos": math.cos(2 * math.pi * next_month / 12),
    }

    prediction = round(float(predict_row(model, forecast_input)), 2)
    previous = round(float(last_row["consumption_kwh"]), 2)
    change_percent = round(((prediction - previous) / previous) * 100, 2) if previous else 0
    metrics = {}

    if os.path.exists(metrics_path):
        with open(metrics_path, "r", encoding="utf-8") as metrics_file:
            metrics = json.load(metrics_file)

    print(json.dumps({
        "year": next_year,
        "month": next_month,
        "predicted_consumption_kwh": prediction,
        "previous_consumption_kwh": previous,
        "change_percent": change_percent,
        "mae": metrics.get("mae"),
        "rmse": metrics.get("rmse"),
        "r2_score": metrics.get("r2_score"),
        "model_type": metrics.get("model_type", model.get("model_type", "Linear Regression")),
    }))


if __name__ == "__main__":
    main()
