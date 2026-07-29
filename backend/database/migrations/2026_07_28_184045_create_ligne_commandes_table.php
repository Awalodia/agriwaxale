<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ligne_commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->foreignId('offre_id')->constrained('offres')->onDelete('cascade');
            $table->float('quantite');
            $table->integer('prix_unitaire');
            $table->integer('sous_total');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ligne_commandes');
    }
};
