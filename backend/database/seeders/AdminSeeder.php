<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@safargo.ma'],
            [
                'name'       => 'Admin SafarGo',
                'password'   => Hash::make('admin1234'),
                'phone'      => '+212600000000',
                'is_admin'   => 1,
                'documents_enabled' => 1,
                'is_active'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
