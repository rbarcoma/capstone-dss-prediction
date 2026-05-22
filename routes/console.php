<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Support\MlWorkflow;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('energy:monthly-prediction', function () {
    $result = app(MlWorkflow::class)->runScheduledMonthlyPrediction();
    $forecast = $result['forecast'];

    $this->info(
        'System prediction completed for ' .
        $forecast->year . '-' . str_pad((string) $forecast->month, 2, '0', STR_PAD_LEFT) .
        ': ' . $forecast->predicted_consumption_kwh . ' kWh.'
    );
})->purpose('Run the automated end-of-month energy prediction, DSS, and report workflow.');

Schedule::command('energy:monthly-prediction')
    ->dailyAt('23:55')
    ->when(fn () => now()->isSameDay(now()->copy()->endOfMonth()));
