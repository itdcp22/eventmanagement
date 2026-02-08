<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
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
            'event_type' => 'sometimes|in:birthday,corporate,team_building,company,family',
            'location' => 'sometimes|in:indoor,outdoor',
            'event_datetime' => 'sometimes|date',
            'event_end_datetime' => 'nullable|date|after:event_datetime',
            'number_of_attendees' => 'sometimes|integer|min:1|max:500',
            'special_requests' => 'nullable|string|max:1000',
            'estimated_budget' => 'nullable|numeric|min:0',
            'status' => 'sometimes|in:pending,confirmed,cancelled,completed',
        ];
    }
}
