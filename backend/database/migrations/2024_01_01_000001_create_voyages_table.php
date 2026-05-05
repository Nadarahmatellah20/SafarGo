<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voyages', function (Blueprint $table) {
            $table->id();
            $table->string('destination');
            $table->string('pays');
            $table->text('description');
            $table->decimal('prix', 10, 2);
            $table->integer('duree');
            $table->string('image')->nullable();
            $table->decimal('note', 3, 1)->default(4.5);
            $table->integer('places_disponibles')->default(20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voyages');
    }
};
