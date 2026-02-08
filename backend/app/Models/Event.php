<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'name',
        'email',
        'mobile',
        'event_type',
        'location',
        'event_datetime',
        'event_end_datetime',
        'number_of_attendees',
        'special_requests',
        'estimated_budget',
        'status',
    ];

    protected $casts = [
        'event_datetime' => 'datetime',
        'event_end_datetime' => 'datetime',
        'estimated_budget' => 'decimal:2',
    ];
}
