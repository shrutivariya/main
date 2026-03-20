<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Currency;

class CurrencyController extends Controller
{
   public function StoreCurrencies()
    {
        // Step 1: Fetch data from API
        $response = Http::get('https://open.er-api.com/v6/latest/USD');

        if ($response->successful()) {
            $data = $response->json();

            // Step 2: Extract USD and INR values
            $usdRate = $data['rates']['USD'] ?? null; // Base currency is always 1 USD
            $inrRate = $data['rates']['INR'] ?? null;

            Currency::updateOrCreate(
                ['base' => 'USD', 'usd' => $usdRate, 'inr' => $inrRate]
            );

                return response()->json([
                    'success' => true,
                    'base' => 'USD',
                    'rates' => [
                        'USD' => $usdRate,
                        'INR' => $inrRate
                    ],
                ]);
        }

        // Fallback if API fails
        return response()->json([
            'success' => false,
            'message' => 'Unable to fetch currency rates'
        ], 500);
    }
    public function GetCurrencies()
    {
        $currentRate = Currency::latest()->first();

        return response()->json([
                    'success' => true,
                    'base' => 'USD',
                    'rates' => [
                        'USD' => $currentRate->usd,
                        'INR' => $currentRate->inr,
                    ],
                ]);
    }
}
