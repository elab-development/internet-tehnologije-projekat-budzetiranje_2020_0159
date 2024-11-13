<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount', // Iznos troška
        'date',   // Datum plaćanja
        'category', // Kategorija troška (npr. hrana, prevoz)
        'description', // Opis troška
        'paid_by', // ID korisnika koji je platio
    ];

    // Trošak pripada jednom korisniku (onaj koji je platio)
    public function user()
    {
        return $this->belongsTo(User::class, 'paid_by');
    }

    // Trošak može imati više plaćanja/refundacija
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
