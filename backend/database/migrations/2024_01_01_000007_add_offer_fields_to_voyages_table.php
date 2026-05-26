<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voyages', function (Blueprint $table) {
            $table->string('type_offre')->default('voyage')->after('places_disponibles');
            $table->string('transport_type')->nullable()->after('type_offre');
            $table->string('lieu_depart')->nullable()->after('transport_type');
            $table->string('lieu_arrivee')->nullable()->after('lieu_depart');
            $table->date('date_evenement')->nullable()->after('lieu_arrivee');
        });
    }

    public function down(): void
    {
        Schema::table('voyages', function (Blueprint $table) {
            $table->dropColumn([
                'type_offre',
                'transport_type',
                'lieu_depart',
                'lieu_arrivee',
                'date_evenement',
            ]);
        });
    }
};
