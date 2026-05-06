<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClimateRecord extends Model
{
    protected $fillable = [
        'dataset_id',
        'year',
        'month',
        'temperature',
        'humidity',
        'rainfall',
        'solar_irradiance',
    ];
}
