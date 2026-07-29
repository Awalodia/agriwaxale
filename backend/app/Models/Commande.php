<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'acheteur_id', 'negociation_id', 'statut', 'date_creation',
        'date_livraison', 'adresse_livraison', 'mode_livraison'
    ];

    public function acheteur()
    {
        return $this->belongsTo(Acheteur::class);
    }

    public function negociation()
    {
        return $this->belongsTo(Negociation::class);
    }

    public function ligneCommandes()
    {
        return $this->hasMany(LigneCommande::class);
    }

    public function paiement()
    {
        return $this->hasOne(Paiement::class);
    }

    public function evaluation()
    {
        return $this->hasOne(Evaluation::class);
    }
}
