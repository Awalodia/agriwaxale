<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    protected $fillable = ['commande_id', 'producteur_id', 'note', 'commentaire', 'date'];

    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function producteur()
    {
        return $this->belongsTo(Producteur::class);
    }
}
