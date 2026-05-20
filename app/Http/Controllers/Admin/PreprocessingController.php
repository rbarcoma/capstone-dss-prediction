<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\AuditLogger;
use App\Models\ClimateRecord;
use App\Models\ConsumptionRecord;
use App\Models\ProcessedRecord;
use App\Support\EnergyPreprocessor;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use RuntimeException;

class PreprocessingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Preprocessing', [
            'processedRecords' => ProcessedRecord::query()
                ->orderByDesc('year')
                ->orderByDesc('month')
                ->get(),

            'counts' => [
                'consumption' => ConsumptionRecord::count(),
                'climate' => ClimateRecord::query()
                    ->whereExists(function ($query) {
                        $query->select(DB::raw(1))
                            ->from('consumption_records')
                            ->whereColumn('consumption_records.year', 'climate_records.year')
                            ->whereColumn('consumption_records.month', 'climate_records.month');
                    })
                    ->count(),
                'processed' => ProcessedRecord::count(),
            ],
        ]);
    }

    public function run()
    {
        try {
            $count = EnergyPreprocessor::run();
        } catch (RuntimeException $exception) {
            return back()->with('error', $exception->getMessage());
        }

        AuditLogger::log(
            'Preprocessing',
            'Run Preprocessing',
            $count . ' processed records generated with ML features.'
        );

        return back()->with('success', $count . ' processed records generated.');
    }
}
