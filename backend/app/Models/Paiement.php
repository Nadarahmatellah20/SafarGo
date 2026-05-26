<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reservation_id',
        'method_id',
        'montant',
        'statut',
    ];

    protected $casts = [
        'montant' => 'float',
    ];

    protected $appends = [
        'amount',
        'status',
        'description',
        'method_label',
        'invoice_number',
        'paid_at',
    ];

    public function getAmountAttribute(): float
    {
        return (float) $this->montant;
    }

    public function getStatusAttribute(): string
    {
        return match ($this->statut) {
            'payé'       => 'reussi',
            'remboursé'  => 'rembourse',
            'échoué'     => 'echec',
            default      => $this->statut,
        };
    }

    public function getDescriptionAttribute(): string
    {
        if ($this->relationLoaded('reservation') && $this->reservation?->voyage) {
            return 'Voyage : ' . $this->reservation->voyage->destination;
        }

        return 'Paiement SafarGo';
    }

    public function getMethodLabelAttribute(): string
    {
        if ($this->relationLoaded('method') && $this->method) {
            return strtoupper($this->method->type) . ' **** ' . $this->method->derniers_chiffres;
        }

        return 'Carte bancaire';
    }

    public function getInvoiceNumberAttribute(): string
    {
        return 'SG-FAC-' . str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }

    public function getPaidAtAttribute(): ?string
    {
        return $this->created_at?->format('Y-m-d');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }

    public function method()
    {
        return $this->belongsTo(PaiementMethod::class, 'method_id');
    }
}
