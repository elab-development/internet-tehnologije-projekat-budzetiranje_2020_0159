<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    // Prikaz svih plaćanja za ulogovanog korisnika (kao payer ili payee)
    public function index()
    {
        $user = Auth::user();
        $payments = Payment::where('payer_id', $user->id)
                            ->orWhere('payee_id', $user->id)
                            ->get();
        return response()->json($payments);
    }

    // Prikaz jednog plaćanja
    public function show($id)
    {
        $payment = Payment::findOrFail($id);
        return response()->json($payment);
    }

    // Kreiranje novog plaćanja
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'expense_id' => 'required|exists:expenses,id',
            'payer_id' => 'required|exists:users,id',
            'payee_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string|in:pending,completed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment = Payment::create($request->all());

        return response()->json($payment, 201);
    }

    // Ažuriranje postojećeg plaćanja
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'expense_id' => 'required|exists:expenses,id',
            'payer_id' => 'required|exists:users,id',
            'payee_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string|in:pending,completed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $payment->update($request->all());

        return response()->json($payment);
    }

    // Brisanje plaćanja
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
