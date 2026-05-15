<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use App\Models\DssResult;
use App\Models\ForecastResult;
use App\Models\ProcessedRecord;
use App\Models\Report;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        $latestProcessed = ProcessedRecord::query()->orderByDesc('year')->orderByDesc('month')->first();
        $latestForecast = ForecastResult::latest('predicted_at')->first();
        $latestDss = DssResult::latest()->first();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'latest_average_consumption' => round((float) ($latestProcessed?->consumption_kwh ?? 0), 2),
                'latest_predicted_consumption' => round((float) ($latestForecast?->predicted_consumption_kwh ?? 0), 2),
                'demand_status' => $latestDss?->demand_status ?? 'No DSS result',
                'readiness_level' => $latestDss?->readiness_level ?? 'No assessment',
                'datasets' => Dataset::count(),
                'processed_records' => ProcessedRecord::count(),
                'forecasts' => ForecastResult::count(),
                'reports' => Report::count(),
            ],
            'recentForecasts' => ForecastResult::latest('predicted_at')->take(5)->get(),
            'recentReports' => Report::latest()->take(5)->get(),
            'trend' => ProcessedRecord::query()
                ->select('year', 'month', 'consumption_kwh')
                ->orderBy('year')
                ->orderBy('month')
                ->take(24)
                ->get(),
            'yearly' => ProcessedRecord::query()
                ->select('year', DB::raw('AVG(consumption_kwh) as consumption_kwh'))
                ->groupBy('year')
                ->orderBy('year')
                ->get(),
        ]);
    }
}
