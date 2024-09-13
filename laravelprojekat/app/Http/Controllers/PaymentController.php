<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    // Prikaz svih plaćanja za ulogovanog korisnika 
    public function index()
    {
        $user = Auth::user();
        $payments = Payment::where('payer_id', $user->id)->get();
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
            'payee_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string|in:pending,completed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Koristimo ID ulogovanog korisnika kao `payer_id`
        $payment = Payment::create([
            'payer_id' => Auth::id(),
            'payee_id' => $request->payee_id,
            'amount' => $request->amount,
            'status' => $request->status,
        ]);

        return response()->json($payment, 201);
    }

    // Ažuriranje postojećeg plaćanja
    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'payee_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|string|in:pending,completed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Ažuriramo polja sa ID ulogovanog korisnika kao `payer_id`
        $payment->update([
            'payer_id' => Auth::id(),
            'payee_id' => $request->payee_id,
            'amount' => $request->amount,
            'status' => $request->status,
        ]);

        return response()->json($payment);
    }

    // Brisanje plaćanja
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
    public function paymentsByUserId($userId)
    {
        $payments = Payment::where('payer_id', $userId)->get();
 

        return response()->json($payments);
    }

}
