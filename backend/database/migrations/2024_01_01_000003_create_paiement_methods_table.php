<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiement_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['visa', 'mastercard', 'paypal']);
            $table->string('derniers_chiffres', 4);
            $table->string('nom_titulaire');
            $table->string('expiration', 7);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiement_methods');
    }
};
