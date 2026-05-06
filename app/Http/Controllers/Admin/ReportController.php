<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DssResult;
use App\Models\ForecastResult;
use App\Models\ProcessedRecord;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Reports', [
            'reports' => Report::latest()->get(),
            'latestForecast' => ForecastResult::latest()->first(),
            'latestDss' => DssResult::latest()->first(),
        ]);
    }

    public function store(Request $request)
    {
        $forecast = ForecastResult::latest()->first();
        $dss = DssResult::latest()->first();

        $report = Report::create([
            'user_id' => $request->user()->id,
            'title' => 'Renewable Energy Transition Report - '.now()->format('Y-m-d H:i'),
            'type' => 'analytics_forecast_dss',
            'summary' => [
                'average_consumption' => round((float) ProcessedRecord::avg('consumption_kwh'), 2),
                'latest_forecast' => $forecast,
                'latest_dss' => $dss,
            ],
        ]);

        return back()->with('success', "Report #{$report->id} generated.");
    }

    public function download(Report $report)
    {
        $html = view('reports.energy', ['report' => $report])->render();

        return response($html, 200, [
            'Content-Type' => 'text/html',
            'Content-Disposition' => 'inline; filename="energy-transition-report-'.$report->id.'.html"',
        ]);
    }
}
