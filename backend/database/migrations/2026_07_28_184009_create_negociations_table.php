<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('negociations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offre_id')->constrained('offres')->onDelete('cascade');
            $table->foreignId('acheteur_id')->constrained('acheteurs')->onDelete('cascade');
            $table->foreignId('producteur_id')->constrained('producteurs')->onDelete('cascade');
            $table->string('statut')->default('en_cours');
            $table->timestamp('date_creation')->useCurrent();
            $table->timestamp('date_cloture')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('negociations');
    }
};
