<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    // Consulter le catalogue — accessible à tous (Visiteur inclus)
    public function index(Request $request)
    {
        $query = Offre::with(['producteur.user', 'categorie'])->where('statut', 'disponible');

        // Rechercher un produit / filtrage (catégorie, zone géographique, prix)
        if ($request->has('categorie_id')) {
            $query->where('categorie_id', $request->categorie_id);
        }
        if ($request->has('zone')) {
            $query->where('zone_production', 'like', '%' . $request->zone . '%');
        }
        if ($request->has('recherche')) {
            $query->where('nom_produit', 'like', '%' . $request->recherche . '%');
        }

        return response()->json($query->latest()->get());
    }

    // Consulter le détail d'une offre
    public function show(Offre $offre)
    {
        return response()->json($offre->load(['producteur.user', 'categorie']));
    }

    // Publier une offre — Producteur uniquement
    public function store(Request $request)
    {
        $producteur = $request->user()->producteur;
        if (! $producteur) {
            return response()->json(['message' => 'Seul un producteur peut publier une offre.'], 403);
        }

        $validated = $request->validate([
            'categorie_id' => 'required|exists:categories,id',
            'nom_produit' => 'required|string|max:255',
            'quantite' => 'required|numeric|min:0',
            'prix_initial' => 'required|integer|min:0',
            'zone_production' => 'nullable|string',
            'photo' => 'nullable|string',
        ]);

        $validated['producteur_id'] = $producteur->id;
        $validated['date_publication'] = now();
        $validated['statut'] = 'disponible';

        $offre = Offre::create($validated);
        return response()->json($offre, 201);
    }

    // Modifier une offre — seul le producteur propriétaire
    public function update(Request $request, Offre $offre)
    {
        $producteur = $request->user()->producteur;
        if (! $producteur || $offre->producteur_id !== $producteur->id) {
            return response()->json(['message' => 'Vous ne pouvez modifier que vos propres offres.'], 403);
        }

        $validated = $request->validate([
            'nom_produit' => 'sometimes|string|max:255',
            'quantite' => 'sometimes|numeric|min:0',
            'prix_initial' => 'sometimes|integer|min:0',
            'statut' => 'sometimes|string',
        ]);

        $offre->update($validated);
        return response()->json($offre);
    }

    // Supprimer une offre — seul le producteur propriétaire
    public function destroy(Request $request, Offre $offre)
    {
        $producteur = $request->user()->producteur;
        if (! $producteur || $offre->producteur_id !== $producteur->id) {
            return response()->json(['message' => 'Vous ne pouvez supprimer que vos propres offres.'], 403);
        }

        $offre->delete();
        return response()->json(['message' => 'Offre supprimée.']);
    }
}
