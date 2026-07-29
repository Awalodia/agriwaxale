<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proposition_negociations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('negociation_id')->constrained('negociations')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->integer('prix_propose');
            $table->float('quantite_proposee');
            $table->string('statut')->default('en_attente');
            $table->timestamp('date_proposition')->useCurrent();
            $table->text('message')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proposition_negociations');
    }
};
