<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncomesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->date('date'); // Datum
            $table->string('category'); // Kategorija
            $table->string('status'); // Status (npr. 'pending', 'completed')
            $table->unsignedBigInteger('sender_id')->nullable(); // ID osobe koja šalje novac, nullable
            $table->foreign('sender_id')->references('id')->on('users')->onDelete('set null'); // Spoljni ključ ka korisnicima
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('incomes');
    }
}
