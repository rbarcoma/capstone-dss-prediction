<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForecastResult;
use App\Models\ProcessedRecord;
use App\Support\AuditLogger;
use App\Support\EnergyDss;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ForecastingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Forecasting', [
            'latestForecast' => ForecastResult::with('user:id,name')->latest('predicted_at')->first(),
            'forecastHistory' => ForecastResult::with('user:id,name')->latest('predicted_at')->take(20)->get(),
        ]);
    }

    public function train()
    {
        $this->exportProcessedDataset();
        $result = $this->runPython('train_model.py');

        if ($result->failed()) {
            return back()->with('error', $result->errorOutput() ?: $result->output());
        }

        AuditLogger::log(
            'ML Forecasting',
            'Train Model',
            'Trained the machine learning forecasting model.'
        );

        return back()->with('success', 'Model trained successfully. ' . $result->output());
    }

    public function predict(Request $request)
    {
        $this->exportProcessedDataset();
        $result = $this->runPython('predict_next_month.py');

        if ($result->failed()) {
            return back()->with('error', $result->errorOutput() ?: $result->output());
        }

        $data = json_decode(trim($result->output()), true);

        if (! $data) {
            return back()->with('error', 'Invalid JSON output from Python prediction script.');
        }

        $generatedAt = now();

        $forecast = ForecastResult::updateOrCreate([
            'year' => $data['year'],
            'month' => $data['month'],
        ], [
            'user_id' => $request->user()?->id,
            'predicted_at' => $generatedAt,
            'predicted_consumption_kwh' => $data['predicted_consumption_kwh'],
            'previous_consumption_kwh' => $data['previous_consumption_kwh'] ?? null,
            'change_percent' => $data['change_percent'] ?? null,
            'mae' => $data['mae'] ?? null,
            'rmse' => $data['rmse'] ?? null,
            'r2_score' => $data['r2_score'] ?? null,
            'model_type' => $data['model_type'] ?? 'Random Forest',
        ]);

        $dss = EnergyDss::generateForForecast($forecast, $request->user()?->id, $generatedAt);

        AuditLogger::log(
            'Forecasting',
            'Generate Prediction',
            'Generated next-month prediction for ' .
                $forecast->year . '-' .
                str_pad((string) $forecast->month, 2, '0', STR_PAD_LEFT) .
                ': ' . $forecast->predicted_consumption_kwh . ' kWh.'
        );

        AuditLogger::log(
            'Decision Support',
            'Auto Generate DSS Result',
            'System generated DSS result: ' . $dss->demand_status . ' and ' . $dss->readiness_level . '.'
        );

        return back()->with('success', 'Next-month forecast and DSS recommendations saved.');
    }

    private function exportProcessedDataset(): void
    {
        $records = ProcessedRecord::query()
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        abort_if(
            $records->count() < 6,
            422,
            'At least 6 processed records are required for forecasting.'
        );

        Storage::makeDirectory('ml');

        $headers = [
            'year',
            'month',
            'consumption_kwh',
            'temperature',
            'humidity',
            'rainfall',
            'solar_irradiance',
            'peak_demand_kw',
            'lag_1',
            'lag_2',
            'trend',
            'month_sin',
            'month_cos',
        ];

        $lines = [implode(',', $headers)];

        foreach ($records as $record) {
            $lines[] = implode(',', array_map(
                fn ($field) => $record->{$field},
                $headers
            ));
        }

        Storage::put('ml/processed_dataset.csv', implode(PHP_EOL, $lines));
    }

    private function runPython(string $script)
    {
        $python = file_exists(base_path('venv314/Scripts/python.exe'))
            ? base_path('venv314/Scripts/python.exe')
            : 'python';

        return Process::path(base_path('Python'))->run([
            $python,
            $script,
            Storage::path('ml/processed_dataset.csv'),
            Storage::path('ml/qc_energy_model.pkl'),
            Storage::path('ml/metrics.json'),
        ]);
    }
}
