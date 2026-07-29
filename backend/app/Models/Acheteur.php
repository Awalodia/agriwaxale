<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Acheteur extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'adresse_livraison'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function negociations()
    {
        return $this->hasMany(Negociation::class);
    }

    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }
}
