<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'name',
        'email',
        'mobile',
        'visit_datetime',
        'number_of_guests',
        'menu_selections',
        'special_requests',
        'status',
    ];

    protected $casts = [
        'visit_datetime' => 'datetime',
        'menu_selections' => 'array',
    ];
}
