<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('reservation_id')->constrained()->onDelete('cascade');
            $table->foreignId('method_id')->references('id')->on('paiement_methods')->onDelete('cascade');
            $table->decimal('montant', 10, 2);
            $table->enum('statut', ['payé', 'remboursé', 'échoué'])->default('payé');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
