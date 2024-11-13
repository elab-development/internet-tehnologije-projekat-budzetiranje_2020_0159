<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Payment;
use App\Models\Income;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    // Method to retrieve all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

     // Metoda za brisanje korisnika i svih povezanih podataka
     public function destroy($id)
     {
         DB::beginTransaction(); // Započinjemo transakciju
 
         try {
             // Pronađemo korisnika
             $user = User::findOrFail($id);
 
             // Brišemo sve troškove povezane sa korisnikom
             Expense::where('paid_by', $user->id)->delete();
 
             // Brišemo sva plaćanja povezana sa korisnikom
             Payment::where('payer_id', $user->id)->orWhere('payee_id', $user->id)->delete();
 
             // Brišemo sve prihode povezane sa korisnikom
             Income::where('receiver_id', $user->id)->orWhere('sender_id', $user->id)->delete();
 
             // Na kraju brišemo korisnika
             $user->delete();
 
             // Ako su sve operacije uspešno završene, potvrđujemo transakciju
             DB::commit();
 
             return response()->json(['message' => 'User and related data deleted successfully']);
         } catch (\Exception $e) {
             // U slučaju greške, poništavamo sve promene
             DB::rollBack();
 
             return response()->json(['error' => 'Failed to delete user and related data: ' . $e->getMessage()], 500);
         }
     }
}
