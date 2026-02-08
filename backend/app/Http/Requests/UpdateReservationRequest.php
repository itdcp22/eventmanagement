<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'mobile' => 'sometimes|string|max:20',
            'visit_datetime' => 'sometimes|date',
            'number_of_guests' => 'sometimes|integer|min:1|max:50',
            'menu_selections' => 'nullable|array',
            'menu_selections.*' => 'integer|exists:menu_items,id',
            'special_requests' => 'nullable|string|max:1000',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
        ];
    }
}
