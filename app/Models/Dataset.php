<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dataset extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'original_name',
        'path',
        'status',
        'validation_errors',
        'record_count',
    ];

    protected function casts(): array
    {
        return [
            'validation_errors' => 'array',
        ];
    }
}
