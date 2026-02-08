<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .header { background: #2d5016; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .details p { margin: 5px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Reservation Confirmed</h1>
    </div>
    <div class="content">
        <p>Dear {{ $reservation->name }},</p>
        <p>Thank you for your reservation! Here are your booking details:</p>
        <div class="details">
            <p><strong>Date & Time:</strong> {{ $reservation->visit_datetime->format('l, F j, Y \a\t g:i A') }}</p>
            <p><strong>Number of Guests:</strong> {{ $reservation->number_of_guests }}</p>
            @if($reservation->special_requests)
                <p><strong>Special Requests:</strong> {{ $reservation->special_requests }}</p>
            @endif
        </div>
        <p>If you need to modify or cancel your reservation, please contact us.</p>
        <p>We look forward to welcoming you!</p>
    </div>
    <div class="footer">
        <p>Restaurant Management System</p>
    </div>
</body>
</html>
