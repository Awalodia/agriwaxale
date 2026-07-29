<?php

namespace App\Http\Controllers;

use App\Models\Commande;
use App\Models\Evaluation;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    // Évaluer un producteur — uniquement après réception d'une commande confirmée
    public function store(Request $request)
    {
        $validated = $request->validate([
            'commande_id' => 'required|exists:commandes,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string',
        ]);

        $commande = Commande::with('ligneCommandes.offre.producteur')->findOrFail($validated['commande_id']);

        if ($commande->statut !== 'confirmee') {
            return response()->json(['message' => 'Seule une commande confirmée peut être évaluée.'], 403);
        }

        if ($commande->evaluation) {
            return response()->json(['message' => 'Cette commande a déjà été évaluée.'], 403);
        }

        $producteur = $commande->ligneCommandes->first()->offre->producteur;

        $evaluation = Evaluation::create([
            'commande_id' => $commande->id,
            'producteur_id' => $producteur->id,
            'note' => $validated['note'],
            'commentaire' => $validated['commentaire'] ?? null,
            'date' => now(),
        ]);

        return response()->json($evaluation, 201);
    }
}
