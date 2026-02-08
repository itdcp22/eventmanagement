<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
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
            'event_type' => 'required|in:birthday,corporate,team_building,company,family',
            'location' => 'required|in:indoor,outdoor',
            'event_datetime' => 'required|date|after:now',
            'event_end_datetime' => 'nullable|date|after:event_datetime',
            'number_of_attendees' => 'required|integer|min:1|max:500',
            'special_requests' => 'nullable|string|max:1000',
            'estimated_budget' => 'nullable|numeric|min:0',
        ];
    }
}
