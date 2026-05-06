<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsumptionRecord extends Model
{
    protected $fillable = [
        'dataset_id',
        'year',
        'month',
        'consumption_kwh',
        'peak_demand_kw',
    ];
}
