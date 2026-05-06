<?php

namespace App\Support;

use App\Models\ForecastResult;
use App\Models\ProcessedRecord;

class EnergyDss
{
    public static function classifyDemand(float $predicted, ?float $average = null): string
    {
        $baseline = max($average ?: $predicted, 1);
        $ratio = $predicted / $baseline;

        return match (true) {
            $ratio >= 1.15 => 'High Demand',
            $ratio >= 0.90 => 'Moderate Demand',
            default => 'Low Demand',
        };
    }

    public static function readiness(float $solarIrradiance, float $peakDemand, float $predicted): string
    {
        $score = 0;
        $score += $solarIrradiance >= 5 ? 2 : ($solarIrradiance >= 3.5 ? 1 : 0);
        $score += $peakDemand <= ($predicted * 0.20) ? 2 : 1;

        return match (true) {
            $score >= 4 => 'High Readiness',
            $score >= 2 => 'Moderate Readiness',
            default => 'Low Readiness',
        };
    }

    public static function recommendations(ForecastResult $forecast, ?ProcessedRecord $latest, string $demand, string $readiness): array
    {
        $items = [];
        $actions = [];
        $solar = (float) ($latest?->solar_irradiance ?? 0);
        $peak = (float) ($latest?->peak_demand_kw ?? 0);
        $predicted = (float) $forecast->predicted_consumption_kwh;

        if ($demand === 'High Demand' && $solar >= 4) {
            $items[] = 'Plan solar energy transition for high-demand facilities and priority public buildings.';
            $actions[] = 'Prepare solar PV feasibility screening and roof/site inventory.';
        }

        if ($peak > ($predicted * 0.18)) {
            $items[] = 'Apply energy efficiency and load management programs to reduce peak demand.';
            $actions[] = 'Schedule demand response, efficient equipment replacement, and peak-hour monitoring.';
        }

        if (($forecast->change_percent ?? 0) > 5) {
            $items[] = 'Conduct renewable energy feasibility assessment because forecasted consumption is increasing.';
            $actions[] = 'Review high-growth barangays or facilities and prioritize renewable offset targets.';
        }

        if ($readiness === 'Low Readiness') {
            $items[] = 'Improve data collection and energy monitoring before large renewable investments.';
            $actions[] = 'Standardize monthly electricity, climate, solar, and peak-demand reporting.';
        }

        if ($items === []) {
            $items[] = 'Maintain monitoring and prepare phased renewable energy transition options.';
            $actions[] = 'Update forecasts monthly and compare actual consumption against predicted values.';
        }

        return [$items, $actions];
    }
}
