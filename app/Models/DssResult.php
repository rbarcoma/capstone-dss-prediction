<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DssResult extends Model
{
    protected $fillable = [
        'forecast_result_id',
        'demand_status',
        'readiness_level',
        'recommendations',
        'priority_actions',
        'basis',
    ];

    protected function casts(): array
    {
        return [
            'recommendations' => 'array',
            'priority_actions' => 'array',
            'basis' => 'array',
        ];
    }
}
