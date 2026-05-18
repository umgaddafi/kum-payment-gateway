<?php

namespace App\Services;

class DummyDataService
{
    /**
     * Keeping the data here makes it easy to swap this service
     * with a repository or MySQL-backed implementation later.
     */
    public function user(): array
    {
        return [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ];
    }

    public function credentialsMatch(string $email, string $password): bool
    {
        return $email === 'admin@example.com' && $password === 'password';
    }

    public function token(): string
    {
        return 'fake-jwt-token-for-demo';
    }

    public function items(): array
    {
        return [
            [
                'id' => 1,
                'title' => 'Payment Overview',
                'description' => 'Track the latest payment activity from the dashboard.',
            ],
            [
                'id' => 2,
                'title' => 'Quick Reports',
                'description' => 'Review simple daily summaries without a database connection.',
            ],
            [
                'id' => 3,
                'title' => 'Easy Upgrade Path',
                'description' => 'Replace this dummy service with MySQL once real data is ready.',
            ],
        ];
    }
}
