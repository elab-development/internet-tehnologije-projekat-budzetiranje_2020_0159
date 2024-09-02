<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_id',   // ID troška
        'payer_id',     // ID korisnika koji plaća
        'payee_id',     // ID korisnika kome se plaća
        'amount',       // Iznos plaćanja
        'status',       // Status plaćanja (npr. pending, completed)
    ];

    // Plaćanje pripada jednom trošku
    public function expense()
    {
        return $this->belongsTo(Expense::class);
    }

    // Plaćanje uključuje korisnika koji plaća
    public function payer()
    {
        return $this->belongsTo(User::class, 'payer_id');
    }

    // Plaćanje uključuje korisnika koji prima novac
    public function payee()
    {
        return $this->belongsTo(User::class, 'payee_id');
    }
}
