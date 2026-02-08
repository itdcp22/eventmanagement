<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('mobile');
            $table->enum('event_type', ['birthday', 'corporate', 'team_building', 'company', 'family']);
            $table->enum('location', ['indoor', 'outdoor']);
            $table->dateTime('event_datetime');
            $table->dateTime('event_end_datetime')->nullable();
            $table->integer('number_of_attendees');
            $table->text('special_requests')->nullable();
            $table->decimal('estimated_budget', 10, 2)->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
