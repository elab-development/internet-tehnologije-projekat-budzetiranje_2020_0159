<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'receiver_id',  
        'sender_id',
        'category',
        'amount',
        'status',
        'date'
    ];

    
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
