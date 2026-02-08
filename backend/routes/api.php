<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\ReservationController;
use Illuminate\Support\Facades\Route;

// Reservations
Route::apiResource('reservations', ReservationController::class);

// Events
Route::apiResource('events', EventController::class);

// Menu Items
Route::apiResource('menu-items', MenuItemController::class);

// Dashboard
Route::prefix('dashboard')->group(function () {
    Route::get('/summary', [DashboardController::class, 'summary']);
    Route::get('/upcoming', [DashboardController::class, 'upcoming']);
    Route::get('/calendar', [DashboardController::class, 'calendar']);
});
