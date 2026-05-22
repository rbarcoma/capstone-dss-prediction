import csv
import json
import math
import pickle
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
STORAGE_ML_DIR = PROJECT_ROOT / "storage" / "app" / "private" / "ml"


def default_dataset_path():
    return STORAGE_ML_DIR / "processed_dataset.csv"


def default_model_path():
    return STORAGE_ML_DIR / "qc_energy_model.pkl"


def read_rows(dataset_path):
    with open(dataset_path, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        rows = []
        for row in reader:
            parsed = {}
            for key, value in row.items():
                parsed[key] = float(value or 0)
            rows.append(parsed)

    return add_derived_features(sorted(rows, key=lambda item: (item["year"], item["month"])))


def add_derived_features(rows):
    for index, row in enumerate(rows):
        month = int(row["month"])
        previous_row = rows[index - 1] if index > 0 else row
        second_previous_row = rows[index - 2] if index > 1 else row

        row.setdefault("lag_1", previous_row["consumption_kwh"])
        row.setdefault("lag_2", second_previous_row["consumption_kwh"])
        row.setdefault("trend", float(index + 1))
        row.setdefault("month_sin", math.sin(2 * math.pi * month / 12))
        row.setdefault("month_cos", math.cos(2 * math.pi * month / 12))

    return rows


def predict_row(model, row):
    values = [1.0]
    for feature in model["features"]:
        values.append((row[feature] - model["means"][feature]) / model["stds"][feature])

    return sum(coefficient * value for coefficient, value in zip(model["coefficients"], values))


def main():
    dataset_path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_dataset_path()
    model_path = Path(sys.argv[2]) if len(sys.argv) > 2 else default_model_path()

    rows = read_rows(dataset_path)

    with open(model_path, "rb") as model_file:
        model = pickle.load(model_file)

    predictions = []
    for row in rows:
        actual = float(row["consumption_kwh"])
        predicted = round(float(predict_row(model, row)), 2)
        accuracy = None

        if actual > 0:
            accuracy = round(max(0, 100 - (abs(actual - predicted) / actual * 100)), 2)

        year = int(row["year"])
        month = int(row["month"])
        predictions.append({
            "period": f"{year}-{month:02d}",
            "year": year,
            "month": month,
            "predicted": predicted,
            "accuracy": accuracy,
        })

    print(json.dumps(predictions))


if __name__ == "__main__":
    main()
