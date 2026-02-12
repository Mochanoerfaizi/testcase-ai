<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('taiga_id')->unique();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('subject');
            $table->text('description')->nullable();
            $table->datetime('taiga_created_at');
            $table->string('creator_name');
            $table->string('creator_email')->nullable();
            $table->json('assigned_to')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
