<?php

namespace App\Http\Controllers;

use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class IncomeController extends Controller
{
    // Prikaz svih priliva za ulogovanog korisnika
    public function index()
    {
        $user = Auth::user();
        $incomes = Income::where('receiver_id', $user->id)->get();
        return response()->json($incomes);
    }

    // Prikaz jednog priliva
    public function show($id)
    {
        $income = Income::findOrFail($id);
        return response()->json($income);
    }

    // Kreiranje novog priliva
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'status' => 'required|string|in:pending,completed',
            'sender_id' => 'nullable|exists:users,id',
            'amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Dodajemo receiver_id kao id ulogovanog korisnika
        $incomeData = $request->all();
        $incomeData['receiver_id'] =  Auth::user()->id;;  // Dodajemo receiver_id
      //  return $incomeData;
        $income = Income::create($incomeData);

        return response()->json($income, 201);
    }

    // Ažuriranje postojećeg priliva
    public function update(Request $request, $id)
    {
        $income = Income::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'status' => 'required|string|in:pending,completed',
            'sender_id' => 'nullable|exists:users,id',
            'amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Ažuriramo receiver_id ako je potrebno (ali u ovom slučaju, ne menjamo receiver_id jer je već postavljen)
        $income->update($request->all());

        return response()->json($income);
    }

    // Brisanje priliva
    public function destroy($id)
    {
        $income = Income::findOrFail($id);
        $income->delete();

        return response()->json(['message' => 'Income deleted successfully']);
    }
}
