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
        Schema::create('testcases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_id')->constrained()->onDelete('cascade');
            $table->string('tc_id')->nullable();
            $table->string('title')->nullable();
            $table->text('summary')->nullable();
            $table->string('severity')->nullable();
            $table->text('prerequisites')->nullable();
            $table->text('test_procedure')->nullable();
            $table->text('expected_result')->nullable();
            $table->string('case_type')->nullable(); // Positive / Negative
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testcases');
    }
};
