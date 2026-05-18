<?php

namespace App\Http\Controllers;

use App\Services\DemoTransactionStore;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request, DemoTransactionStore $transactionStore): Response
    {
        return Inertia::render('Payments/Home', [
            'canLogin' => false,
            'canRegister' => false,
            'transactions' => $transactionStore->recent($request),
            'simulationRules' => [
                ['card' => '**** 4242', 'result' => 'Approved'],
                ['card' => '**** 0002', 'result' => 'Declined: insufficient funds'],
                ['card' => '**** 9995', 'result' => 'Declined: suspected fraud'],
                ['card' => 'Amount >= 5000', 'result' => 'Pending manual review'],
            ],
        ]);
    }
}
