<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary(): JsonResponse
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        return response()->json([
            'today_reservations' => Reservation::whereDate('visit_datetime', $today)->count(),
            'today_events' => Event::whereDate('event_datetime', $today)->count(),
            'month_reservations' => Reservation::whereBetween('visit_datetime', [$startOfMonth, $endOfMonth])->count(),
            'month_events' => Event::whereBetween('event_datetime', [$startOfMonth, $endOfMonth])->count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
            'confirmed_reservations' => Reservation::where('status', 'confirmed')->count(),
            'pending_events' => Event::where('status', 'pending')->count(),
            'confirmed_events' => Event::where('status', 'confirmed')->count(),
            'total_guests_today' => Reservation::whereDate('visit_datetime', $today)
                ->whereIn('status', ['pending', 'confirmed'])
                ->sum('number_of_guests'),
            'total_attendees_today' => Event::whereDate('event_datetime', $today)
                ->whereIn('status', ['pending', 'confirmed'])
                ->sum('number_of_attendees'),
            'estimated_revenue' => Event::whereBetween('event_datetime', [$startOfMonth, $endOfMonth])
                ->whereIn('status', ['confirmed', 'completed'])
                ->sum('estimated_budget'),
        ]);
    }

    public function upcoming(): JsonResponse
    {
        $reservations = Reservation::where('visit_datetime', '>=', Carbon::now())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('visit_datetime')
            ->limit(10)
            ->get();

        $events = Event::where('event_datetime', '>=', Carbon::now())
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('event_datetime')
            ->limit(10)
            ->get();

        return response()->json([
            'reservations' => $reservations,
            'events' => $events,
        ]);
    }

    public function calendar(Request $request): JsonResponse
    {
        $month = $request->get('month', Carbon::now()->month);
        $year = $request->get('year', Carbon::now()->year);

        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth = Carbon::create($year, $month, 1)->endOfMonth();

        $reservations = Reservation::whereBetween('visit_datetime', [$startOfMonth, $endOfMonth])
            ->orderBy('visit_datetime')
            ->get()
            ->groupBy(function ($item) {
                return $item->visit_datetime->format('Y-m-d');
            });

        $events = Event::whereBetween('event_datetime', [$startOfMonth, $endOfMonth])
            ->orderBy('event_datetime')
            ->get()
            ->groupBy(function ($item) {
                return $item->event_datetime->format('Y-m-d');
            });

        return response()->json([
            'month' => $month,
            'year' => $year,
            'reservations' => $reservations,
            'events' => $events,
        ]);
    }
}
