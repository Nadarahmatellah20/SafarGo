<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voyage extends Model
{
    use HasFactory;

    protected $fillable = [
        'destination',
        'pays',
        'description',
        'prix',
        'duree',
        'image',
        'note',
        'places_disponibles',
    ];

    protected $casts = [
        'prix'               => 'float',
        'note'               => 'float',
        'places_disponibles' => 'integer',
        'duree'              => 'integer',
    ];

    protected $appends = [
        'country',
        'price',
        'duration',
        'rating',
        'available_spots',
        'category',
        'departure_dates',
    ];

    private static array $categoryMap = [
        'France'               => 'Europe',
        'Espagne'              => 'Europe',
        'Italie'               => 'Europe',
        'Grèce'                => 'Europe',
        'Portugal'             => 'Europe',
        'Allemagne'            => 'Europe',
        'Pays-Bas'             => 'Europe',
        'Maroc'                => 'Afrique',
        'Égypte'               => 'Afrique',
        'Tunisie'              => 'Afrique',
        'Afrique du Sud'       => 'Afrique',
        'Japon'                => 'Asie',
        'Thaïlande'            => 'Asie',
        'Indonésie'            => 'Asie',
        'Chine'                => 'Asie',
        'Inde'                 => 'Asie',
        'Vietnam'              => 'Asie',
        'Singapour'            => 'Asie',
        'États-Unis'           => 'Amériques',
        'Canada'               => 'Amériques',
        'Brésil'               => 'Amériques',
        'Mexique'              => 'Amériques',
        'Émirats Arabes Unis'  => 'Moyen-Orient',
        'Arabie Saoudite'      => 'Moyen-Orient',
        'Qatar'                => 'Moyen-Orient',
        'Turquie'              => 'Moyen-Orient',
        'Maldives'             => 'Océan Indien',
        'Maurice'              => 'Océan Indien',
        'Réunion'              => 'Océan Indien',
        'Seychelles'           => 'Océan Indien',
    ];

    public function getCountryAttribute(): string
    {
        return $this->pays;
    }

    public function getPriceAttribute(): float
    {
        return (float) $this->prix;
    }

    public function getDurationAttribute(): int
    {
        return (int) $this->duree;
    }

    public function getRatingAttribute(): float
    {
        return (float) $this->note;
    }

    public function getAvailableSpotsAttribute(): int
    {
        return (int) $this->places_disponibles;
    }

    public function getCategoryAttribute(): string
    {
        return self::$categoryMap[$this->pays] ?? 'Monde';
    }

    public function getDepartureDatesAttribute(): array
    {
        $dates = [];
        $base  = Carbon::now()->startOfMonth()->addMonth();
        $seed  = (int) $this->id;

        for ($i = 0; $i < 5; $i++) {
            $offset  = ($seed * 3 + $i * 7) % 25;
            $dates[] = $base->copy()->addMonths($i)->addDays($offset)->format('Y-m-d');
        }

        return $dates;
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
