<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Method to retrieve all users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }
}
