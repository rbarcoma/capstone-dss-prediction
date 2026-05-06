<?php

namespace App\Http\Controllers;

use App\Models\Forecast;
use Illuminate\Support\Facades\Process;
use Inertia\Inertia;

class ForecastController extends Controller
{
    public function index()
    {
        $latestForecast = Forecast::latest()->first();

        return Inertia::render('Admin/Forecasting', [
            'latestForecast' => $latestForecast,
        ]);
    }

    public function runForecast()
    {
        abort_unless(auth()->check() && auth()->user()->role === 'admin', 403);

        $pythonPath = base_path('venv314/Scripts/python.exe');

        $result = Process::path(base_path('Python'))->run([$pythonPath, 'predict_next_month.py']);

        if ($result->failed()) {
            return back()->with('error', $result->errorOutput() ?: $result->output());
        }

        $data = json_decode(trim($result->output()), true);

        if (!$data) {
            return back()->with('error', 'Invalid JSON output from Python script.');
        }

        Forecast::create([
            'year' => $data['year'],
            'month' => $data['month'],
            'predicted_consumption_kwh' => $data['predicted_consumption_kwh'],
            'status' => $data['status'],
            'readiness' => $data['readiness'],
            'recommendation' => $data['recommendation'],
        ]);

        return back()->with('success', 'Forecast completed successfully.');
    }
}
