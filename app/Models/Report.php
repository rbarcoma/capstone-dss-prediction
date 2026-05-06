<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'type',
        'summary',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'summary' => 'array',
        ];
    }
}
