<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Tenant Company A
        $companyA = Company::create([
            'name' => 'Acme Corp',
            'slug' => 'acme-corp',
        ]);

        $userA = User::create([
            'company_id' => $companyA->id,
            'name' => 'Alex Rivera',
            'email' => 'alex@acme.com',
            'password' => bcrypt('password'),
        ]);
        Task::factory()->count(5)->create([
            'company_id' => $companyA->id,
            'user_id' => $userA->id,
        ]);

        // Tenant Company B 
        $companyB = Company::create([
            'name' => 'Globex Inc',
            'slug' => 'globex-inc',
        ]);

        $userB = User::create([
            'company_id' => $companyB->id,
            'name' => 'Sarah Connor',
            'email' => 'sarah@globex.com',
            'password' => bcrypt('password'),
        ]);
        Task::factory()->count(5)->create([
            'company_id' => $companyB->id,
            'user_id' => $userB->id,
        ]);
    }
}
