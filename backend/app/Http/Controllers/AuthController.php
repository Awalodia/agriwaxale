<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Acheteur;
use App\Models\Producteur;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Inscription : correspond au cas d'utilisation "S'inscrire" (Visiteur)
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'telephone' => 'nullable|string',
            'localisation' => 'nullable|string',
            'role' => 'required|in:acheteur,producteur',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Création du profil selon le rôle choisi à l'inscription
        if ($validated['role'] === 'acheteur') {
            Acheteur::create(['user_id' => $user->id]);
        } else {
            Producteur::create([
                'user_id' => $user->id,
                'zone_production' => $validated['localisation'] ?? '',
                'statut_compte' => false,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'role' => $validated['role'],
            'token' => $token,
        ], 201);
    }

    // Connexion : correspond au cas d'utilisation "S'authentifier"
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Identifiants incorrects.'],
            ]);
        }

        $role = $user->acheteur ? 'acheteur' : ($user->producteur ? 'producteur' : 'administrateur');
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'role' => $role,
            'token' => $token,
        ]);
    }

    // Déconnexion
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // Profil de l'utilisateur connecté : "Gérer son profil"
    public function profile(Request $request)
    {
        return response()->json($request->user()->load(['acheteur', 'producteur', 'administrateur']));
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'telephone' => 'nullable|string',
            'localisation' => 'nullable|string',
            'adresse_livraison' => 'nullable|string',
        ]);

        $user->update([
            'name' => $validated['name'] ?? $user->name,
            'telephone' => $validated['telephone'] ?? $user->telephone,
            'localisation' => $validated['localisation'] ?? $user->localisation,
        ]);

        if ($user->acheteur && isset($validated['adresse_livraison'])) {
            $user->acheteur->update(['adresse_livraison' => $validated['adresse_livraison']]);
        }

        return response()->json($user->load(['acheteur', 'producteur', 'administrateur']));
    }
}

