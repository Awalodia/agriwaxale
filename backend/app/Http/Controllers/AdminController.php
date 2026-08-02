<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Categorie;
use App\Models\Offre;
use App\Models\Negociation;
use App\Models\Commande;
use App\Models\Paiement;
use App\Models\Evaluation;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function utilisateurs()
    {
        $users = User::with(['acheteur', 'producteur', 'administrateur'])->get();
        return response()->json($users);
    }

    public function validerCompte(Request $request, $producteurId)
    {
        $producteur = \App\Models\Producteur::findOrFail($producteurId);
        $producteur->update(['statut_compte' => true]);
        return response()->json($producteur);
    }

    public function storeCategorie(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        return response()->json(Categorie::create($validated), 201);
    }

    public function destroyCategorie(Categorie $categorie)
    {
        $categorie->delete();
        return response()->json(['message' => 'Catégorie supprimée.']);
    }

    public function commandes()
    {
        return response()->json(Commande::where('statut', '!=', 'brouillon')->with(['acheteur.user', 'ligneCommandes.offre'])->get());
    }

    public function negociations()
    {
        return response()->json(Negociation::with(['offre', 'acheteur.user', 'producteur.user'])->get());
    }

    public function evaluations()
    {
        return response()->json(Evaluation::with(['producteur.user', 'commande'])->get());
    }

    public function indicateurs()
    {
        return response()->json([
            'statistiques_utilisateurs' => [
                'total' => User::count(),
                'acheteurs' => \App\Models\Acheteur::count(),
                'producteurs' => \App\Models\Producteur::count(),
            ],
            'statistiques_offres' => [
                'total' => Offre::count(),
                'disponibles' => Offre::where('statut', 'disponible')->count(),
            ],
            'statistiques_negociations' => [
                'total' => Negociation::count(),
                'en_cours' => Negociation::where('statut', 'en_cours')->count(),
                'acceptees' => Negociation::where('statut', 'acceptee')->count(),
                'refusees' => Negociation::where('statut', 'refusee')->count(),
                'annulees' => Negociation::where('statut', 'annulee')->count(),
            ],
            'statistiques_transactions' => [
                'total_commandes' => Commande::where('statut', '!=', 'brouillon')->count(),
                'commandes_confirmees' => Commande::whereIn('statut', ['confirmee', 'livree'])->count(),
                'montant_total' => Paiement::where('statut', 'paye')->sum('montant'),
            ],
        ]);
    }
}
