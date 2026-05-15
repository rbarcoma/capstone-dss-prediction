<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\DssResult;
use App\Models\ForecastResult;
use App\Models\ProcessedRecord;
use App\Models\Report;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ViewerController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('User/Dashboard', $this->sharedData());
    }

    public function analytics()
    {
        return Inertia::render('User/Analytics', $this->analyticsData());
    }

    public function forecasts()
    {
        return Inertia::render('User/ForecastResults', [
            'latestForecast' => ForecastResult::with('user:id,name')->latest('predicted_at')->first(),
            'forecastHistory' => ForecastResult::with('user:id,name')->latest('predicted_at')->take(20)->get(),
        ]);
    }

    public function decisionSupport()
    {
        return Inertia::render('User/DecisionSupportResults', [
            'latestDss' => DssResult::latest()->first(),
            'history' => DssResult::latest()->take(20)->get(),
        ]);
    }

    public function reports()
    {
        return Inertia::render('User/Reports', [
            'reports' => Report::latest()->get(),
        ]);
    }

    private function sharedData(): array
    {
        $latestProcessed = ProcessedRecord::query()->orderByDesc('year')->orderByDesc('month')->first();
        $latestForecast = ForecastResult::latest('predicted_at')->first();
        $latestDss = DssResult::latest()->first();

        return [
            'stats' => [
                'latest_average_consumption' => round((float) ($latestProcessed?->consumption_kwh ?? 0), 2),
                'latest_predicted_consumption' => round((float) ($latestForecast?->predicted_consumption_kwh ?? 0), 2),
                'demand_status' => $latestDss?->demand_status ?? 'No DSS result',
                'readiness_level' => $latestDss?->readiness_level ?? 'No assessment',
            ],
            'recommendations' => $latestDss?->recommendations ?? [],
            'forecastHistory' => ForecastResult::latest('predicted_at')->take(10)->get(),
            'trend' => ProcessedRecord::query()->select('year', 'month', 'consumption_kwh')->orderBy('year')->orderBy('month')->take(24)->get(),
        ];
    }

    private function analyticsData(): array
    {
        return [
            'monthlyTrend' => ProcessedRecord::query()
                ->select('year', 'month', 'consumption_kwh as value')
                ->orderBy('year')
                ->orderBy('month')
                ->get(),
            'yearlyComparison' => ProcessedRecord::query()
                ->select('year', DB::raw('AVG(consumption_kwh) as value'))
                ->groupBy('year')
                ->orderBy('year')
                ->get(),
            'seasonalPattern' => ProcessedRecord::query()
                ->select('month', DB::raw('AVG(consumption_kwh) as value'))
                ->groupBy('month')
                ->orderBy('month')
                ->get(),
            'summary' => [
                'average_consumption' => round((float) ProcessedRecord::avg('consumption_kwh'), 2),
                'highest_consumption' => round((float) ProcessedRecord::max('consumption_kwh'), 2),
                'average_peak_demand' => round((float) ProcessedRecord::avg('peak_demand_kw'), 2),
                'average_solar_irradiance' => round((float) ProcessedRecord::avg('solar_irradiance'), 2),
            ],
        ];
    }
}
