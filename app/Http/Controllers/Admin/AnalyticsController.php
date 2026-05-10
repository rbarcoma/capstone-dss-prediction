<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcessedRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $query = ProcessedRecord::query();

        if ($request->filled('year')) {
            $query->where('year', $request->integer('year'));
        }

        if ($request->filled('month')) {
            $query->where('month', $request->integer('month'));
        }

        $records = $query->orderBy('year')->orderBy('month')->get();
        $all = ProcessedRecord::query();

        $highestConsumptionRecord = ProcessedRecord::query()
            ->orderByDesc('consumption_kwh')
            ->first();

        return Inertia::render('Admin/Analytics', [
            'filters' => $request->only('year', 'month'),
            'records' => $records,
            'monthlyTrend' => $records->map(fn ($record) => [
                'label' => $record->year.'-'.str_pad((string) $record->month, 2, '0', STR_PAD_LEFT),
                'value' => (float) $record->consumption_kwh,
            ])->values(),
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
            'peakDemand' => ProcessedRecord::query()
                ->select('year', 'month', 'peak_demand_kw as value')
                ->orderByDesc('peak_demand_kw')
                ->take(12)
                ->get(),
            'summary' => [
                'average_consumption' => round((float) $all->avg('consumption_kwh'), 2),
                'highest_consumption' => round((float) ($highestConsumptionRecord?->consumption_kwh ?? 0), 2),
                'highest_consumption_year' => $highestConsumptionRecord?->year,
                'highest_consumption_month' => $highestConsumptionRecord?->month,
                'average_peak_demand' => round((float) ProcessedRecord::avg('peak_demand_kw'), 2),
                'average_solar_irradiance' => round((float) ProcessedRecord::avg('solar_irradiance'), 2),
            ],
        ]);
    }
}
