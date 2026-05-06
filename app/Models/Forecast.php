<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Forecast extends Model
{
    protected $fillable = [
        'year',
        'month',
        'predicted_consumption_kwh',
        'status',
        'readiness',
        'recommendation',
    ];
}
