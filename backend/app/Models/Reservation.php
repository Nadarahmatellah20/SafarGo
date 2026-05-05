<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'voyage_id',
        'nombre_personnes',
        'date_depart',
        'total',
        'statut',
    ];

    protected $casts = [
        'date_depart'      => 'date',
        'total'            => 'float',
        'nombre_personnes' => 'integer',
    ];

    protected $appends = [
        'departure_date',
        'passengers',
        'total_price',
        'status',
    ];

    public function getDepartureDateAttribute(): ?string
    {
        return $this->date_depart?->format('Y-m-d');
    }

    public function getPassengersAttribute(): int
    {
        return (int) $this->nombre_personnes;
    }

    public function getTotalPriceAttribute(): float
    {
        return (float) $this->total;
    }

    public function getStatusAttribute(): string
    {
        return match ($this->statut) {
            'en attente' => 'en_attente',
            'confirmée'  => 'confirmee',
            'annulée'    => 'annulee',
            default      => $this->statut,
        };
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function voyage()
    {
        return $this->belongsTo(Voyage::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }
}
