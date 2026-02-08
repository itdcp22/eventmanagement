<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'mobile' => 'required|string|max:20',
            'visit_datetime' => 'required|date|after:now',
            'number_of_guests' => 'required|integer|min:1|max:50',
            'menu_selections' => 'nullable|array',
            'menu_selections.*' => 'integer|exists:menu_items,id',
            'special_requests' => 'nullable|string|max:1000',
        ];
    }
}
