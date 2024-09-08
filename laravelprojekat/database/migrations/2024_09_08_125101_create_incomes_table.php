<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIncomesTable extends Migration
{
    public function up()
    {
        Schema::create('incomes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('receiver_id');  // Ensure receiver_id is a foreign key
            $table->foreign('receiver_id')->references('id')->on('users')->onDelete('cascade');  // Foreign key reference
            $table->unsignedBigInteger('sender_id')->nullable();
            $table->string('category');
            $table->decimal('amount', 10, 2);
            $table->string('status');
            $table->date('date');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('incomes');
    }
}
