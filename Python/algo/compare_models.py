import json
import pickle
import shutil
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "model"

MODEL_FILES = [
    MODEL_DIR / "linear_regression.pkl",
    MODEL_DIR / "random_forest.pkl",
    MODEL_DIR / "xgboost.pkl",
]

BEST_MODEL_PATH = MODEL_DIR / "best_model.pkl"
METRICS_PATH = MODEL_DIR / "metrics.json"


def load_model_result(model_path):
    if not model_path.exists():
        return None

    with open(model_path, "rb") as file:
        saved_model = pickle.load(file)

    metrics = saved_model.get("metrics", {})

    return {
        "path": model_path,
        "model_type": metrics.get("model_type", saved_model.get("model_type", "Unknown Model")),
        "mae": metrics.get("mae"),
        "rmse": metrics.get("rmse"),
        "r2_score": metrics.get("r2_score"),
        "cv_mae": metrics.get("cv_mae"),
        "cv_rmse": metrics.get("cv_rmse"),
        "cv_r2_score": metrics.get("cv_r2_score"),
        "cross_validation": metrics.get("cross_validation", []),
        "saved_model": saved_model,
    }


def select_best_model(results):
    """
    Best model selection:
    1. Main basis: lowest cv_rmse
    2. Tie breaker: highest cv_r2_score
    3. Next tie breaker: lowest rmse
    """

    return sorted(
        results,
        key=lambda item: (
            item["cv_rmse"],
            -item["cv_r2_score"],
            item["rmse"],
        ),
    )[0]


def main():
    MODEL_DIR.mkdir(exist_ok=True)

    results = []

    for model_file in MODEL_FILES:
        result = load_model_result(model_file)

        if result:
            results.append(result)

    if not results:
        raise FileNotFoundError("No trained model files found. Train the models first.")

    best = select_best_model(results)

    shutil.copyfile(best["path"], BEST_MODEL_PATH)

    comparison = {
        "best_model": best["model_type"],
        "selection_basis": "Lowest Cross-Validation RMSE",
        "best_metrics": {
            "mae": best["mae"],
            "rmse": best["rmse"],
            "r2_score": best["r2_score"],
            "cv_mae": best["cv_mae"],
            "cv_rmse": best["cv_rmse"],
            "cv_r2_score": best["cv_r2_score"],
        },
        "all_metrics": [
            {
                "model_type": item["model_type"],
                "mae": item["mae"],
                "rmse": item["rmse"],
                "r2_score": item["r2_score"],
                "cv_mae": item["cv_mae"],
                "cv_rmse": item["cv_rmse"],
                "cv_r2_score": item["cv_r2_score"],
            }
            for item in results
        ],
    }

    with open(METRICS_PATH, "w", encoding="utf-8") as file:
        json.dump(comparison, file, indent=4)

    print(json.dumps(comparison, indent=4))

    print("\nMODEL COMPARISON RESULT")
    print("------------------------")
    print(f"Best Model: {best['model_type']}")
    print(f"Basis: Lowest Cross-Validation RMSE")
    print(f"CV RMSE: {best['cv_rmse']}")
    print(f"CV MAE: {best['cv_mae']}")
    print(f"CV R2 Score: {best['cv_r2_score']}")
    print(f"\nSaved best model to: {BEST_MODEL_PATH}")
    print(f"Saved comparison metrics to: {METRICS_PATH}")


if __name__ == "__main__":
    main()
