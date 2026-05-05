<?php

namespace Database\Seeders;

use App\Models\Voyage;
use Illuminate\Database\Seeder;

class VoyageSeeder extends Seeder
{
    public function run(): void
    {
        $voyages = [
            ['destination' => 'Paris', 'pays' => 'France', 'description' => 'La ville lumière avec la Tour Eiffel, le Louvre et une gastronomie exceptionnelle.', 'prix' => 1200, 'duree' => 5, 'image' => 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 'note' => 4.8, 'places_disponibles' => 15],
            ['destination' => 'Tokyo', 'pays' => 'Japon', 'description' => 'La métropole futuriste alliant tradition et modernité, temples et néons.', 'prix' => 2800, 'duree' => 10, 'image' => 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 'note' => 4.9, 'places_disponibles' => 10],
            ['destination' => 'Marrakech', 'pays' => 'Maroc', 'description' => 'La ville ocre avec ses souks animés, ses riads et sa culture millénaire.', 'prix' => 850, 'duree' => 7, 'image' => 'https://images.unsplash.com/photo-1553603229-e7d7d7b43183?w=800', 'note' => 4.7, 'places_disponibles' => 20],
            ['destination' => 'New York', 'pays' => 'États-Unis', 'description' => 'La ville qui ne dort jamais — Times Square, Central Park, Broadway.', 'prix' => 2100, 'duree' => 8, 'image' => 'https://images.unsplash.com/photo-1538970272646-f61fabb3bfad?w=800', 'note' => 4.6, 'places_disponibles' => 12],
            ['destination' => 'Bali', 'pays' => 'Indonésie', 'description' => 'L\'île des dieux avec ses rizières en terrasses, temples et plages de rêve.', 'prix' => 1650, 'duree' => 12, 'image' => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'note' => 4.9, 'places_disponibles' => 18],
            ['destination' => 'Rome', 'pays' => 'Italie', 'description' => 'La ville éternelle — Colisée, Vatican, Fontaine de Trévi et cuisine italienne.', 'prix' => 1100, 'duree' => 6, 'image' => 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', 'note' => 4.7, 'places_disponibles' => 16],
            ['destination' => 'Dubaï', 'pays' => 'Émirats Arabes Unis', 'description' => 'La cité du futur avec ses gratte-ciels, déserts et luxe absolu.', 'prix' => 1900, 'duree' => 7, 'image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'note' => 4.5, 'places_disponibles' => 14],
            ['destination' => 'Santorin', 'pays' => 'Grèce', 'description' => 'Les maisons bleues et blanches sur la caldeira volcanique, couchers de soleil magiques.', 'prix' => 1750, 'duree' => 8, 'image' => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 'note' => 4.8, 'places_disponibles' => 8],
            ['destination' => 'Bangkok', 'pays' => 'Thaïlande', 'description' => 'Temples dorés, street food incroyable et vie nocturne animée.', 'prix' => 1450, 'duree' => 9, 'image' => 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 'note' => 4.6, 'places_disponibles' => 22],
            ['destination' => 'Barcelone', 'pays' => 'Espagne', 'description' => 'Gaudí, plages méditerranéennes, tapas et une énergie unique en son genre.', 'prix' => 980, 'duree' => 5, 'image' => 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', 'note' => 4.7, 'places_disponibles' => 19],
        ];

        foreach ($voyages as $voyage) {
            Voyage::create($voyage);
        }
    }
}
