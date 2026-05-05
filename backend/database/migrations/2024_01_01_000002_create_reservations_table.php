<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('voyage_id')->constrained()->onDelete('cascade');
            $table->integer('nombre_personnes');
            $table->date('date_depart');
            $table->decimal('total', 10, 2);
            $table->enum('statut', ['en attente', 'confirmée', 'annulée'])->default('en attente');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
