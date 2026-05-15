<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\AuditLogger;
use App\Models\ClimateRecord;
use App\Models\ConsumptionRecord;
use App\Models\ProcessedRecord;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
        $consumption = ConsumptionRecord::query()
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $climate = ClimateRecord::query()
            ->get()
            ->keyBy(fn ($record) => "{$record->year}-{$record->month}");

        if ($consumption->count() < 3) {
            return back()->with('error', 'At least 3 monthly consumption records are required.');
        }

        ProcessedRecord::truncate();

        $rows = [];

        foreach ($consumption as $index => $record) {
            $climateRecord = $climate->get("{$record->year}-{$record->month}");

            $rows[] = [
                'year' => $record->year,
                'month' => $record->month,
                'consumption_kwh' => (float) $record->consumption_kwh,
                'temperature' => (float) ($climateRecord?->temperature ?? 0),
                'humidity' => (float) ($climateRecord?->humidity ?? 0),
                'rainfall' => (float) ($climateRecord?->rainfall ?? 0),
                'solar_irradiance' => (float) ($climateRecord?->solar_irradiance ?? 0),
                'peak_demand_kw' => (float) ($record->peak_demand_kw ?? 0),
                'lag_1' => (float) ($consumption[$index - 1]->consumption_kwh ?? $record->consumption_kwh),
                'lag_2' => (float) ($consumption[$index - 2]->consumption_kwh ?? $record->consumption_kwh),
                'trend' => $index + 1,
                'month_sin' => sin(2 * pi() * $record->month / 12),
                'month_cos' => cos(2 * pi() * $record->month / 12),
            ];
        }

        foreach ($rows as $row) {
            ProcessedRecord::create($row);
        }

        AuditLogger::log(
            'Preprocessing',
            'Run Preprocessing',
            count($rows) . ' processed records generated with ML features.'
        );

        return back()->with('success', count($rows) . ' processed records generated.');
    }
}
