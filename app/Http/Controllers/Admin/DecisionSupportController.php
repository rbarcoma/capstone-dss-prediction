<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DssResult;
use App\Models\ForecastResult;
use App\Models\ProcessedRecord;
use App\Support\AuditLogger;
use App\Support\EnergyDss;
use Inertia\Inertia;

class DecisionSupportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/DecisionSupport', [
            'latestDss' => DssResult::latest()->first(),
            'history' => DssResult::latest()->take(20)->get(),
        ]);
    }

    public function generate()
    {
        $forecast = ForecastResult::latest('predicted_at')->first();
        if (! $forecast) {
            return back()->with('error', 'Run a forecast before generating DSS recommendations.');
        }

        $latest = ProcessedRecord::query()->orderByDesc('year')->orderByDesc('month')->first();
        $average = (float) ProcessedRecord::avg('consumption_kwh');
        $demand = EnergyDss::classifyDemand((float) $forecast->predicted_consumption_kwh, $average);
        $readiness = EnergyDss::readiness((float) ($latest?->solar_irradiance ?? 0), (float) ($latest?->peak_demand_kw ?? 0), (float) $forecast->predicted_consumption_kwh);
        [$recommendations, $actions] = EnergyDss::recommendations($forecast, $latest, $demand, $readiness);

        DssResult::updateOrCreate([
            'forecast_result_id' => $forecast->id,
        ], [
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
            'Generate DSS Result',
            'Generated DSS result: ' . $demand . ' and ' . $readiness . '.'
        );

        return back()->with('success', 'Decision support recommendations generated.');
    }
}
