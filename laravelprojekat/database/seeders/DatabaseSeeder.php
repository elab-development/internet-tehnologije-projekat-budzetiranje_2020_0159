<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Seed for users table
        DB::table('users')->insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Regular User',
                'email' => 'user@example.com',
                'password' => Hash::make('password'),
                'role' => 'user',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        

        // Seed for expenses table
        DB::table('expenses')->insert([
            [
                'amount' => 50.00,
                'date' => '2023-09-01',
                'category' => 'Food',
                'description' => 'Lunch at a restaurant',
                'paid_by' => 2, // ID of Regular User
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'amount' => 20.00,
                'date' => '2023-09-02',
                'category' => 'Transportation',
                'description' => 'Taxi fare',
                'paid_by' => 2, // ID of Regular User
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        // Seed for payments table
        DB::table('payments')->insert([
            [
               
                'payer_id' => 1,    // Admin User is paying
                'payee_id' => 2,    // Regular User is receiving the payment
                'amount' => 25.00,
                'status' => 'completed',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
               
                'payer_id' => 2,   // Regular User is paying
                'payee_id' => 1,   // Admin User is receiving the payment
                'amount' => 10.00,
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
