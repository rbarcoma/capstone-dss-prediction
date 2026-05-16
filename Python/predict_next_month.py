import csv
from datetime import date
import json
import math
import os
import pickle
import subprocess
import sys
from pathlib import Path




SCRIPT_DIR = Path(__file__).resolve().parent




def default_path(filename):
    return SCRIPT_DIR / filename




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




def next_period_from_today(today=None):
    current_date = today or date.today()
    month = current_date.month
    year = current_date.year


    return next_period(year, month)




def next_period(year, month):
    if month == 12:
        return year + 1, 1


    return year, month + 1




def trend_for_period(rows, target_year, target_month):
    first_row = rows[0]
    first_year = int(first_row["year"])
    first_month = int(first_row["month"])
    target_index = ((target_year - first_year) * 12) + (target_month - first_month)


    return float(target_index + 1)




def average_context_for_month(rows, target_month):
    context_features = [
        "temperature",
        "humidity",
        "rainfall",
        "solar_irradiance",
        "peak_demand_kw",
    ]
    same_month_rows = [row for row in rows if int(row["month"]) == target_month]
    source_rows = same_month_rows or rows[-12:] or rows


    return {
        feature: sum(row[feature] for row in source_rows) / len(source_rows)
        for feature in context_features
    }




def rows_before_period(rows, target_year, target_month):
    return [
        row.copy()
        for row in rows
        if (int(row["year"]), int(row["month"])) < (target_year, target_month)
    ]




def build_forecast_input(rows, target_year, target_month):
    context = average_context_for_month(rows, target_month)
    last_row = rows[-1]
    second_last_row = rows[-2]


    return {
        "year": float(target_year),
        "month": float(target_month),
        "temperature": context["temperature"],
        "humidity": context["humidity"],
        "rainfall": context["rainfall"],
        "solar_irradiance": context["solar_irradiance"],
        "peak_demand_kw": context["peak_demand_kw"],
        "lag_1": last_row["consumption_kwh"],
        "lag_2": second_last_row["consumption_kwh"],
        "trend": trend_for_period(rows, target_year, target_month),
        "month_sin": math.sin(2 * math.pi * target_month / 12),
        "month_cos": math.cos(2 * math.pi * target_month / 12),
    }




def forecast_until_period(model, rows, target_year, target_month):
    forecast_rows = rows_before_period(rows, target_year, target_month)
    if len(forecast_rows) < 2:
        forecast_rows = [row.copy() for row in rows]


    while (int(forecast_rows[-1]["year"]), int(forecast_rows[-1]["month"])) < (target_year, target_month):
        year, month = next_period(int(forecast_rows[-1]["year"]), int(forecast_rows[-1]["month"]))
        forecast_input = build_forecast_input(forecast_rows, year, month)
        prediction = float(predict_row(model, forecast_input))
        forecast_rows.append({**forecast_input, "consumption_kwh": prediction})


    return forecast_rows[-1]




def main():
    dataset_path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_path("qc_final_merged_dataset.csv")
    model_path = Path(sys.argv[2]) if len(sys.argv) > 2 else default_path("qc_energy_model_final.pkl")
    metrics_path = Path(sys.argv[3]) if len(sys.argv) > 3 else default_path("metrics.json")
    train_script_path = default_path("train_model.py")


    rows = read_rows(dataset_path)
    if len(rows) < 3:
        raise ValueError("At least 3 processed rows are required to predict the next month.")


    if not os.path.exists(model_path):
        subprocess.run(
            [sys.executable, train_script_path, dataset_path, model_path, metrics_path],
            check=True,
            capture_output=True,
            text=True,
        )


    try:
        with open(model_path, "rb") as model_file:
            model = pickle.load(model_file)
    except Exception:
        subprocess.run(
            [sys.executable, train_script_path, dataset_path, model_path, metrics_path],
            check=True,
            capture_output=True,
            text=True,
        )
        with open(model_path, "rb") as model_file:
            model = pickle.load(model_file)


    next_year, next_month = next_period_from_today()
    forecast_row = forecast_until_period(model, rows, next_year, next_month)
    prediction = round(float(forecast_row["consumption_kwh"]), 2)
    previous = round(float(forecast_row["lag_1"]), 2)
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
