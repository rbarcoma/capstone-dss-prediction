<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ForecastResult extends Model
{
    protected $fillable = [
        'year',
        'month',
        'predicted_consumption_kwh',
        'previous_consumption_kwh',
        'change_percent',
        'mae',
        'rmse',
        'r2_score',
        'model_type',
    ];
}
