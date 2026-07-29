<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producteur_id')->constrained('producteurs')->onDelete('cascade');
            $table->foreignId('categorie_id')->constrained('categories')->onDelete('cascade');
            $table->string('nom_produit');
            $table->float('quantite');
            $table->integer('prix_initial');
            $table->string('zone_production')->nullable();
            $table->string('photo')->nullable();
            $table->date('date_publication')->nullable();
            $table->string('statut')->default('disponible');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};
