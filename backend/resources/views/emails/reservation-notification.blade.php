<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #8b4513; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .details p { margin: 5px 0; }
        .section-title { color: #8b4513; border-bottom: 2px solid #8b4513; padding-bottom: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Reservation Alert</h1>
    </div>
    <div class="content">
        <p>A new reservation has been received.</p>

        <h3 class="section-title">Guest Information</h3>
        <div class="details">
            <p><strong>Name:</strong> {{ $reservation->name }}</p>
            <p><strong>Email:</strong> {{ $reservation->email }}</p>
            <p><strong>Mobile:</strong> {{ $reservation->mobile }}</p>
        </div>

        <h3 class="section-title">Reservation Details</h3>
        <div class="details">
            <p><strong>Date & Time:</strong> {{ $reservation->visit_datetime->format('l, F j, Y \a\t g:i A') }}</p>
            <p><strong>Number of Guests:</strong> {{ $reservation->number_of_guests }}</p>
            <p><strong>Status:</strong> {{ ucfirst($reservation->status) }}</p>
            @if($reservation->special_requests)
                <p><strong>Special Requests:</strong> {{ $reservation->special_requests }}</p>
            @endif
        </div>

        <p><strong>Front of House:</strong> Please prepare seating for {{ $reservation->number_of_guests }} guests.</p>
        <p><strong>Kitchen / Back of House:</strong> Please note any menu pre-selections and special requests above.</p>
    </div>
    <div class="footer">
        <p>Restaurant Management System - Internal Notification</p>
    </div>
</body>
</html>
