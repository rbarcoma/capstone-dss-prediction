import csv
import json
import math
import pickle
import sys
from pathlib import Path

FEATURES = [
    "year",
    "month",
    "temperature",
    "humidity",
    "rainfall",
    "solar_irradiance",
    "peak_demand_kw",
    "lag_1",
    "lag_2",
    "trend",
    "month_sin",
    "month_cos",
]


SCRIPT_DIR = Path(__file__).resolve().parent


def default_path(filename):
    return SCRIPT_DIR / filename


def log(message):
    print(message, flush=True)


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


def split_train_test(rows):
    test_count = max(1, math.ceil(len(rows) * 0.25))
    if len(rows) - test_count < 3:
        test_count = max(1, len(rows) - 3)

    return rows[:-test_count], rows[-test_count:]


def standardize(train_rows):
    means = {}
    stds = {}

    for feature in FEATURES:
        values = [row[feature] for row in train_rows]
        mean = sum(values) / len(values)
        variance = sum((value - mean) ** 2 for value in values) / len(values)
        std = math.sqrt(variance) or 1.0
        means[feature] = mean
        stds[feature] = std

    return means, stds


def matrix_for(rows, means, stds):
    matrix = []
    for row in rows:
        matrix.append([1.0] + [(row[feature] - means[feature]) / stds[feature] for feature in FEATURES])

    return matrix


def solve_linear_system(matrix, vector):
    size = len(vector)
    augmented = [matrix[row][:] + [vector[row]] for row in range(size)]

    for column in range(size):
        pivot = max(range(column, size), key=lambda row: abs(augmented[row][column]))
        augmented[column], augmented[pivot] = augmented[pivot], augmented[column]

        pivot_value = augmented[column][column]
        if abs(pivot_value) < 1e-12:
            augmented[column][column] = 1e-12
            pivot_value = augmented[column][column]

        for item in range(column, size + 1):
            augmented[column][item] /= pivot_value

        for row in range(size):
            if row == column:
                continue
            factor = augmented[row][column]
            for item in range(column, size + 1):
                augmented[row][item] -= factor * augmented[column][item]

    return [augmented[row][size] for row in range(size)]


def train_model(train_rows):
    means, stds = standardize(train_rows)
    x = matrix_for(train_rows, means, stds)
    y = [row["consumption_kwh"] for row in train_rows]
    columns = len(x[0])
    ridge = 0.1

    xtx = [[0.0 for _ in range(columns)] for _ in range(columns)]
    xty = [0.0 for _ in range(columns)]

    for row_values, target in zip(x, y):
        for left in range(columns):
            xty[left] += row_values[left] * target
            for right in range(columns):
                xtx[left][right] += row_values[left] * row_values[right]

    for index in range(1, columns):
        xtx[index][index] += ridge

    coefficients = solve_linear_system(xtx, xty)

    return {
        "model_type": "Linear Regression",
        "features": FEATURES,
        "means": means,
        "stds": stds,
        "coefficients": coefficients,
    }


def predict_row(model, row):
    values = [1.0]
    for feature in model["features"]:
        values.append((row[feature] - model["means"][feature]) / model["stds"][feature])

    return sum(coefficient * value for coefficient, value in zip(model["coefficients"], values))


def evaluate(model, rows):
    actual = [row["consumption_kwh"] for row in rows]
    predicted = [predict_row(model, row) for row in rows]
    errors = [target - prediction for target, prediction in zip(actual, predicted)]
    mae = sum(abs(error) for error in errors) / len(errors)
    rmse = math.sqrt(sum(error ** 2 for error in errors) / len(errors))
    mean_actual = sum(actual) / len(actual)
    total_variance = sum((target - mean_actual) ** 2 for target in actual)
    residual_variance = sum(error ** 2 for error in errors)
    r2_score = 1 - (residual_variance / total_variance) if total_variance else 0

    return {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "r2_score": round(r2_score, 4),
        "model_type": model["model_type"],
    }


def period_label(row):
    return f"{int(row['year'])}-{int(row['month']):02d}"


def main():
    dataset_path = Path(sys.argv[1]) if len(sys.argv) > 1 else default_path("qc_final_merged_dataset.csv")
    model_path = Path(sys.argv[2]) if len(sys.argv) > 2 else default_path("qc_energy_model_final.pkl")
    metrics_path = Path(sys.argv[3]) if len(sys.argv) > 3 else default_path("metrics.json")

    log("Starting model training...")
    log(f"Dataset: {dataset_path}")
    log(f"Model output: {model_path}")
    log(f"Metrics output: {metrics_path}")
    log("")

    log("Step 1/6: Loading dataset")
    rows = read_rows(dataset_path)
    if len(rows) < 6:
        raise ValueError("At least 6 processed rows are required to train the model.")

    log(f"Loaded {len(rows)} rows from {period_label(rows[0])} to {period_label(rows[-1])}.")
    log("")

    log("Step 2/6: Preparing training features")
    log(f"Using {len(FEATURES)} features: {', '.join(FEATURES)}")
    log("Derived lag, trend, and seasonal month features are ready.")
    log("")

    log("Step 3/6: Splitting dataset")
    train_rows, test_rows = split_train_test(rows)
    log(f"Training rows: {len(train_rows)} ({period_label(train_rows[0])} to {period_label(train_rows[-1])})")
    log(f"Testing rows: {len(test_rows)} ({period_label(test_rows[0])} to {period_label(test_rows[-1])})")
    log("")

    log("Step 4/6: Training Linear Regression model")
    model = train_model(train_rows)
    log("Standardized feature values, built the regression matrix, and solved the coefficients.")
    log(f"Learned {len(model['coefficients'])} coefficients including the intercept.")
    log("")

    log("Step 5/6: Evaluating model on test data")
    metrics = evaluate(model, test_rows)
    log(f"MAE: {metrics['mae']}")
    log(f"RMSE: {metrics['rmse']}")
    log(f"R2 score: {metrics['r2_score']}")
    log("")

    log("Step 6/6: Saving model and metrics")
    with open(model_path, "wb") as model_file:
        pickle.dump(model, model_file)

    with open(metrics_path, "w", encoding="utf-8") as metrics_file:
        json.dump(metrics, metrics_file)

    log(f"Saved model to {model_path}")
    log(f"Saved metrics to {metrics_path}")
    log("")
    log("Training complete.")
    log("Final metrics JSON:")
    print(json.dumps(metrics))


if __name__ == "__main__":
    main()
