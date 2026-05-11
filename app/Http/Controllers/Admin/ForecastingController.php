<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DssResult;
use App\Models\ForecastResult;
use App\Models\ProcessedRecord;
use App\Support\AuditLogger;
use App\Support\EnergyDss;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ForecastingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Forecasting', [
            'latestForecast' => ForecastResult::latest()->first(),
            'forecastHistory' => ForecastResult::latest()->take(20)->get(),
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

    public function predict()
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

        $forecast = ForecastResult::create([
            'year' => $data['year'],
            'month' => $data['month'],
            'predicted_consumption_kwh' => $data['predicted_consumption_kwh'],
            'previous_consumption_kwh' => $data['previous_consumption_kwh'] ?? null,
            'change_percent' => $data['change_percent'] ?? null,
            'mae' => $data['mae'] ?? null,
            'rmse' => $data['rmse'] ?? null,
            'r2_score' => $data['r2_score'] ?? null,
            'model_type' => $data['model_type'] ?? 'Random Forest',
        ]);

        $this->generateDssResult($forecast);

        AuditLogger::log(
            'Forecasting',
            'Generate Prediction',
            'Generated next-month prediction for ' .
                $forecast->year . '-' .
                str_pad((string) $forecast->month, 2, '0', STR_PAD_LEFT) .
                ': ' . $forecast->predicted_consumption_kwh . ' kWh.'
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

    private function generateDssResult(ForecastResult $forecast): void
    {
        $latest = ProcessedRecord::query()
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->first();

        $average = (float) ProcessedRecord::avg('consumption_kwh');

        $demand = EnergyDss::classifyDemand(
            (float) $forecast->predicted_consumption_kwh,
            $average
        );

        $readiness = EnergyDss::readiness(
            (float) ($latest?->solar_irradiance ?? 0),
            (float) ($latest?->peak_demand_kw ?? 0),
            (float) $forecast->predicted_consumption_kwh
        );

        [$recommendations, $actions] = EnergyDss::recommendations(
            $forecast,
            $latest,
            $demand,
            $readiness
        );

        DssResult::create([
            'forecast_result_id' => $forecast->id,
            'demand_status' => $demand,
            'readiness_level' => $readiness,
            'recommendations' => $recommendations,
            'priority_actions' => $actions,
            'basis' => [
                'predicted_consumption_kwh' => (float) $forecast->predicted_consumption_kwh,
                'average_consumption_kwh' => $average,
                'peak_demand_kw' => (float) ($latest?->peak_demand_kw ?? 0),
                'solar_irradiance' => (float) ($latest?->solar_irradiance ?? 0),
            ],
        ]);

        AuditLogger::log(
            'Decision Support',
            'Auto Generate DSS Result',
            'System generated DSS result: ' . $demand . ' and ' . $readiness . '.'
        );
    }
}
