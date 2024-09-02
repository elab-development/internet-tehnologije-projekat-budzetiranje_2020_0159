<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ExpenseController extends Controller
{
    // Prikaz svih troškova za ulogovanog korisnika
    public function index()
    {
        $user = Auth::user();
        $expenses = Expense::where('paid_by', $user->id)->get();
        return response()->json($expenses);
    }

    // Prikaz jednog troška
    public function show($id)
    {
        $expense = Expense::findOrFail($id);
        return response()->json($expense);
    }

    // Kreiranje novog troška
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $expense = Expense::create([
            'amount' => $request->amount,
            'date' => $request->date,
            'category' => $request->category,
            'description' => $request->description,
            'paid_by' => Auth::id(),
        ]);

        return response()->json($expense, 201);
    }

    // Ažuriranje postojećeg troška
    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $expense->update([
            'amount' => $request->amount,
            'date' => $request->date,
            'category' => $request->category,
            'description' => $request->description,
        ]);

        return response()->json($expense);
    }

    // Brisanje troška
    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully']);
    }
}
