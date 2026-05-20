<?php

namespace App\Support;

use App\Models\ClimateRecord;
use App\Models\ConsumptionRecord;
use App\Models\ProcessedRecord;
use RuntimeException;

class EnergyPreprocessor
{
    public static function run(): int
    {
        $consumption = ConsumptionRecord::query()
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $climate = ClimateRecord::query()
            ->get()
            ->keyBy(fn ($record) => "{$record->year}-{$record->month}");

        if ($consumption->count() < 3) {
            throw new RuntimeException('At least 3 monthly consumption records are required.');
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

        return count($rows);
    }
}
