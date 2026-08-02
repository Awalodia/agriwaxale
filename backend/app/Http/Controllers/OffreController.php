<?php

namespace App\Http\Controllers;

use App\Models\Offre;
use Illuminate\Http\Request;

class OffreController extends Controller
{
    public function index(Request $request)
    {
        $query = Offre::with(['producteur.user', 'categorie']);
        $user = auth('sanctum')->user();

        if ($request->boolean('mine') && $user) {
            $query->where('producteur_id', $user->producteur?->id);
        } else {
            $query->where('statut', 'disponible');
        }

        if ($request->filled('categorie_id')) {
            $query->where('categorie_id', $request->categorie_id);
        }
        if ($request->filled('zone')) {
            $query->whereRaw('LOWER(zone_production) LIKE ?', ['%' . strtolower($request->zone) . '%']);
        }
        if ($request->filled('recherche')) {
            $query->whereRaw('LOWER(nom_produit) LIKE ?', ['%' . strtolower($request->recherche) . '%']);
        }
        if ($request->filled('prix_max')) {
            $query->where('prix_initial', '<=', $request->prix_max);
        }

        return response()->json($query->latest()->get());
    }

    public function show(Offre $offre)
    {
        return response()->json($offre->load(['producteur.user', 'categorie']));
    }

    public function store(Request $request)
    {
        $producteur = $request->user()->producteur;
        if (! $producteur) {
            return response()->json(['message' => 'Seul un producteur peut publier une offre.'], 403);
        }

        $validated = $request->validate([
            'categorie_id' => 'required|exists:categories,id',
            'nom_produit' => 'required|string|max:255',
            'quantite' => 'required|integer|min:1',
            'unite' => 'required|string|in:kg,g,sac,tonne,caisse,unite',
            'prix_initial' => 'required|integer|min:50',
            'zone_production' => 'nullable|string',
            'photo' => 'nullable|image|max:4096',
        ]);

        $validated['producteur_id'] = $producteur->id;
        $validated['date_publication'] = now();
        $validated['statut'] = 'disponible';

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('offres', 'public');
        }

        $offre = Offre::create($validated);
        return response()->json($offre, 201);
    }

    public function update(Request $request, Offre $offre)
    {
        $producteur = $request->user()->producteur;
        if (! $producteur || $offre->producteur_id !== $producteur->id) {
            return response()->json(['message' => 'Vous ne pouvez modifier que vos propres offres.'], 403);
        }

        $validated = $request->validate([
            'nom_produit' => 'sometimes|string|max:255',
            'quantite' => 'sometimes|integer|min:0',
            'unite' => 'sometimes|string|in:kg,g,sac,tonne,caisse,unite',
            'prix_initial' => 'sometimes|integer|min:50',
            'statut' => 'sometimes|string',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('offres', 'public');
        }

        $offre->update($validated);
        return response()->json($offre);
    }
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
