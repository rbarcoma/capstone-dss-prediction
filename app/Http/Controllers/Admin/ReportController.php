<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DssResult;
use App\Models\ForecastResult;
use App\Models\ProcessedRecord;
use App\Support\AuditLogger;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports', [
            'reports' => Report::with('user:id,name')->latest()->get(),
            'latestForecast' => ForecastResult::latest('predicted_at')->first(),
            'latestDss' => DssResult::latest()->first(),
        ]);
    }

    public function store(Request $request)
    {
        $forecast = ForecastResult::latest('predicted_at')->first();
        $dss = DssResult::latest()->first();
        $latestProcessed = ProcessedRecord::query()
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->first();

        $report = Report::create([
            'user_id' => $request->user()->id,
            'title' => 'Renewable Energy Transition Report - '.now()->format('Y-m-d H:i'),
            'type' => 'analytics_forecast_dss',
            'summary' => [
                'analytics' => [
                    'record_count' => ProcessedRecord::count(),
                    'latest_period' => $latestProcessed
                        ? $latestProcessed->year . '-' . str_pad((string) $latestProcessed->month, 2, '0', STR_PAD_LEFT)
                        : null,
                    'latest_consumption_kwh' => round((float) ($latestProcessed?->consumption_kwh ?? 0), 2),
                    'average_consumption_kwh' => round((float) ProcessedRecord::avg('consumption_kwh'), 2),
                    'highest_consumption_kwh' => round((float) ProcessedRecord::max('consumption_kwh'), 2),
                    'average_peak_demand_kw' => round((float) ProcessedRecord::avg('peak_demand_kw'), 2),
                    'average_solar_irradiance' => round((float) ProcessedRecord::avg('solar_irradiance'), 2),
                ],
                'latest_forecast' => $forecast,
                'latest_dss' => $dss,
            ],
        ]);

        AuditLogger::log(
            'Reports',
            'Generate Report',
            'Generated report: ' . $report->title . '.'
        );

        return back()->with('success', "Report #{$report->id} generated.");
    }

    public function download(Report $report)
    {
        $report->load('user:id,name');
        $html = view('reports.energy', ['report' => $report])->render();
        
        AuditLogger::log(
            'Reports',
            'Open / Print Report',
            'Opened or printed report: ' . $report->title . '.'
        );

        return response($html, 200, [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'inline; filename="energy-transition-report-'.$report->id.'.html"',
        ]);
    }
}
