<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessedRecord extends Model
{
    protected $fillable = [
        'year',
        'month',
        'consumption_kwh',
        'temperature',
        'humidity',
        'rainfall',
        'solar_irradiance',
        'peak_demand_kw',
        'lag_1',
        'lag_2',
        'trend',
        'month_sin',
        'month_cos',
    ];
}
