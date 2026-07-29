<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LigneCommande extends Model
{
    use HasFactory;

    protected $fillable = ['commande_id', 'offre_id', 'quantite', 'prix_unitaire', 'sous_total'];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function offre()
    {
        return $this->belongsTo(Offre::class);
    }
}
