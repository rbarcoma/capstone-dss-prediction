import csv
import json
import math
import pickle
import sys

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


def main():
    dataset_path = sys.argv[1] if len(sys.argv) > 1 else "qc_final_merged_dataset.csv"
    model_path = sys.argv[2] if len(sys.argv) > 2 else "qc_energy_model_final.pkl"
    metrics_path = sys.argv[3] if len(sys.argv) > 3 else "metrics.json"

    rows = read_rows(dataset_path)
    if len(rows) < 6:
        raise ValueError("At least 6 processed rows are required to train the model.")

    train_rows, test_rows = split_train_test(rows)
    model = train_model(train_rows)
    metrics = evaluate(model, test_rows)

    with open(model_path, "wb") as model_file:
        pickle.dump(model, model_file)

    with open(metrics_path, "w", encoding="utf-8") as metrics_file:
        json.dump(metrics, metrics_file)

    print(json.dumps(metrics))


if __name__ == "__main__":
    main()
