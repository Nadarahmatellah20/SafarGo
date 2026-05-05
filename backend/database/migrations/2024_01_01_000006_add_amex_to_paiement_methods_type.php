<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE paiement_methods MODIFY COLUMN type ENUM('visa', 'mastercard', 'paypal', 'amex') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE paiement_methods MODIFY COLUMN type ENUM('visa', 'mastercard', 'paypal') NOT NULL");
    }
};
