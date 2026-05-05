<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'client@safargo.ma'],
            [
                'name'       => 'Client Test',
                'password'   => Hash::make('client1234'),
                'phone'      => '+212611111111',
                'is_admin'   => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
