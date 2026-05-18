<?php

namespace App\Http\Controllers;

use App\Services\DemoTransactionStore;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, DemoTransactionStore $transactionStore): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => $transactionStore->stats($request),
            'transactions' => $transactionStore->recent($request, 12),
        ]);
    }
}
