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
            ['destination' => 'Marrakech', 'pays' => 'Maroc', 'description' => 'La ville ocre avec ses souks animés, ses riads et sa culture millénaire.', 'prix' => 850, 'duree' => 7, 'image' => 'https://images.unsplash.com/photo-1767397404266-ea5c2b1d361a?w=800&q=80', 'note' => 4.7, 'places_disponibles' => 20],
            ['destination' => 'New York', 'pays' => 'États-Unis', 'description' => 'La ville qui ne dort jamais — Times Square, Central Park, Broadway.', 'prix' => 2100, 'duree' => 8, 'image' => 'https://images.unsplash.com/photo-1538970272646-f61fabb3bfad?w=800', 'note' => 4.6, 'places_disponibles' => 12],
            ['destination' => 'Bali', 'pays' => 'Indonésie', 'description' => 'L\'île des dieux avec ses rizières en terrasses, temples et plages de rêve.', 'prix' => 1650, 'duree' => 12, 'image' => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 'note' => 4.9, 'places_disponibles' => 18],
            ['destination' => 'Rome', 'pays' => 'Italie', 'description' => 'La ville éternelle — Colisée, Vatican, Fontaine de Trévi et cuisine italienne.', 'prix' => 1100, 'duree' => 6, 'image' => 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', 'note' => 4.7, 'places_disponibles' => 16],
            ['destination' => 'Dubaï', 'pays' => 'Émirats Arabes Unis', 'description' => 'La cité du futur avec ses gratte-ciels, déserts et luxe absolu.', 'prix' => 1900, 'duree' => 7, 'image' => 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 'note' => 4.5, 'places_disponibles' => 14],
            ['destination' => 'Santorin', 'pays' => 'Grèce', 'description' => 'Les maisons bleues et blanches sur la caldeira volcanique, couchers de soleil magiques.', 'prix' => 1750, 'duree' => 8, 'image' => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', 'note' => 4.8, 'places_disponibles' => 8],
            ['destination' => 'Bangkok', 'pays' => 'Thaïlande', 'description' => 'Temples dorés, street food incroyable et vie nocturne animée.', 'prix' => 1450, 'duree' => 9, 'image' => 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 'note' => 4.6, 'places_disponibles' => 22],
            ['destination' => 'Barcelone', 'pays' => 'Espagne', 'description' => 'Gaudí, plages méditerranéennes, tapas et une énergie unique en son genre.', 'prix' => 980, 'duree' => 5, 'image' => 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800', 'note' => 4.7, 'places_disponibles' => 19],
            ['destination' => 'Finale coupe africaine', 'pays' => 'Maroc', 'description' => 'Billet événement avec assistance, transfert local et confirmation instantanée.', 'prix' => 120, 'duree' => 1, 'image' => 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=800', 'note' => 4.6, 'places_disponibles' => 80, 'type_offre' => 'evenement', 'lieu_depart' => 'Casablanca', 'lieu_arrivee' => 'Stade', 'date_evenement' => now()->addMonths(2)->format('Y-m-d')],
            ['destination' => 'Omra Ramadan', 'pays' => 'Arabie Saoudite', 'description' => 'Package Omra avec vol, hôtel proche Haram, visa et accompagnement complet.', 'prix' => 1850, 'duree' => 14, 'image' => 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800', 'note' => 4.9, 'places_disponibles' => 25, 'type_offre' => 'omra', 'transport_type' => 'Avion', 'lieu_depart' => 'Casablanca', 'lieu_arrivee' => 'Makkah'],
            ['destination' => 'Hajj économique', 'pays' => 'Arabie Saoudite', 'description' => 'Programme Hajj organisé avec hébergement, transport interne et encadrement religieux.', 'prix' => 6200, 'duree' => 21, 'image' => 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800', 'note' => 4.8, 'places_disponibles' => 12, 'type_offre' => 'hajj', 'transport_type' => 'Avion', 'lieu_depart' => 'Rabat', 'lieu_arrivee' => 'Makkah'],
            ['destination' => 'Navette Casablanca - Marrakech', 'pays' => 'Maroc', 'description' => 'Billet transport confortable avec horaires flexibles et réservation rapide.', 'prix' => 18, 'duree' => 1, 'image' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800', 'note' => 4.4, 'places_disponibles' => 45, 'type_offre' => 'transport', 'transport_type' => 'Bus', 'lieu_depart' => 'Casablanca', 'lieu_arrivee' => 'Marrakech'],
            ['destination' => 'Chefchaouen', 'pays' => 'Maroc', 'description' => 'Week-end dans la ville bleue avec hébergement, guide local et transport inclus.', 'prix' => 320, 'duree' => 3, 'image' => 'https://images.unsplash.com/photo-1548018560-c7196548e84d?w=800', 'note' => 4.7, 'places_disponibles' => 28, 'type_offre' => 'voyage', 'transport_type' => 'Bus', 'lieu_depart' => 'Rabat', 'lieu_arrivee' => 'Chefchaouen'],
            ['destination' => 'Istanbul', 'pays' => 'Turquie', 'description' => 'Séjour entre Bosphore, mosquées historiques, bazars et croisière incluse.', 'prix' => 980, 'duree' => 6, 'image' => 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', 'note' => 4.8, 'places_disponibles' => 18, 'type_offre' => 'voyage', 'transport_type' => 'Avion', 'lieu_depart' => 'Casablanca', 'lieu_arrivee' => 'Istanbul'],
            ['destination' => 'Maldives', 'pays' => 'Maldives', 'description' => 'Resort plage, pension complète et transfert bateau rapide.', 'prix' => 2400, 'duree' => 8, 'image' => 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 'note' => 4.9, 'places_disponibles' => 9, 'type_offre' => 'voyage', 'transport_type' => 'Avion', 'lieu_depart' => 'Casablanca', 'lieu_arrivee' => 'Malé'],
            ['destination' => 'Festival Mawazine', 'pays' => 'Maroc', 'description' => 'Billets concert avec accès prioritaire et assistance sur place.', 'prix' => 45, 'duree' => 1, 'image' => 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800', 'note' => 4.5, 'places_disponibles' => 140, 'type_offre' => 'evenement', 'lieu_depart' => 'Rabat', 'lieu_arrivee' => 'Scène OLM', 'date_evenement' => now()->addMonths(1)->format('Y-m-d')],
            ['destination' => 'Concert Marrakech Live', 'pays' => 'Maroc', 'description' => 'Billet soirée musicale avec transfert hôtel en option.', 'prix' => 55, 'duree' => 1, 'image' => 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', 'note' => 4.4, 'places_disponibles' => 90, 'type_offre' => 'evenement', 'lieu_depart' => 'Marrakech', 'lieu_arrivee' => 'Palais des Congrès', 'date_evenement' => now()->addWeeks(6)->format('Y-m-d')],
            ['destination' => 'Omra Confort', 'pays' => 'Arabie Saoudite', 'description' => 'Omra avec hôtels 4 étoiles, transferts privés et assistance visa.', 'prix' => 2250, 'duree' => 12, 'image' => 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800', 'note' => 4.8, 'places_disponibles' => 20, 'type_offre' => 'omra', 'transport_type' => 'Avion', 'lieu_depart' => 'Tanger', 'lieu_arrivee' => 'Makkah'],
            ['destination' => 'Omra Famille', 'pays' => 'Arabie Saoudite', 'description' => 'Formule Omra pensée pour familles avec chambres proches et accompagnement.', 'prix' => 1980, 'duree' => 10, 'image' => 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=800', 'note' => 4.7, 'places_disponibles' => 32, 'type_offre' => 'omra', 'transport_type' => 'Avion', 'lieu_depart' => 'Fès', 'lieu_arrivee' => 'Madinah'],
            ['destination' => 'Hajj Premium', 'pays' => 'Arabie Saoudite', 'description' => 'Package Hajj premium avec hôtels proches, guide dédié et pension complète.', 'prix' => 8900, 'duree' => 24, 'image' => 'https://images.unsplash.com/photo-1604234740238-ff7a333216c3?w=800', 'note' => 4.9, 'places_disponibles' => 8, 'type_offre' => 'hajj', 'transport_type' => 'Avion', 'lieu_depart' => 'Casablanca', 'lieu_arrivee' => 'Makkah'],
            ['destination' => 'Train Rabat - Tanger', 'pays' => 'Maroc', 'description' => 'Billet train rapide, choix flexible des horaires et confirmation immédiate.', 'prix' => 22, 'duree' => 1, 'image' => 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800', 'note' => 4.5, 'places_disponibles' => 70, 'type_offre' => 'transport', 'transport_type' => 'Train', 'lieu_depart' => 'Rabat', 'lieu_arrivee' => 'Tanger'],
            ['destination' => 'Vol Casablanca - Dubaï', 'pays' => 'Émirats Arabes Unis', 'description' => 'Billet avion aller-retour avec bagage et assistance réservation.', 'prix' => 420, 'duree' => 1, 'image' => 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800', 'note' => 4.6, 'places_disponibles' => 38, 'type_offre' => 'transport', 'transport_type' => 'Avion', 'lieu_depart' => 'Casablanca', 'lieu_arrivee' => 'Dubaï'],
            ['destination' => 'Ferry Tanger - Tarifa', 'pays' => 'Espagne', 'description' => 'Billet bateau rapide avec horaires quotidiens et embarquement simplifié.', 'prix' => 39, 'duree' => 1, 'image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 'note' => 4.3, 'places_disponibles' => 60, 'type_offre' => 'transport', 'transport_type' => 'Bateau', 'lieu_depart' => 'Tanger', 'lieu_arrivee' => 'Tarifa'],
        ];

        foreach ($voyages as $voyage) {
            $voyage['images'] = $voyage['images'] ?? $this->galleryFor($voyage);
            $voyage['image'] = $voyage['images'][0] ?? $voyage['image'];

            Voyage::updateOrCreate(
                ['destination' => $voyage['destination'], 'pays' => $voyage['pays']],
                $voyage
            );
        }
    }

    private function galleryFor(array $voyage): array
    {
        $fallback = [
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
        ];

        $galleries = [
            'Paris' => [
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000&q=80',
                'https://images.unsplash.com/photo-1508050919630-b135583b29ab?w=1000&q=80',
                'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=1000&q=80',
                'https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=1000&q=80',
            ],
            'Tokyo' => [
                'https://images.unsplash.com/photo-1505069446780-4ef442b5207f?w=1000&q=80',
                'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1000&q=80',
                'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=1000&q=80',
                'https://images.unsplash.com/photo-1554797589-7241bb691973?w=1000&q=80',
            ],
            'Marrakech' => [
                'https://images.unsplash.com/photo-1767397404266-ea5c2b1d361a?w=1000&q=80',
                'https://images.unsplash.com/photo-1672753566643-c67b5ac5359f?w=1000&q=80',
                'https://images.unsplash.com/photo-1727640567364-b1f039352132?w=1000&q=80',
                'https://images.unsplash.com/photo-1702211374779-792e3df71b59?w=1000&q=80',
                'https://images.unsplash.com/photo-1772580310425-63f2290c2ba7?w=1000&q=80',
            ],
            'New York' => [
                'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=1000&q=80',
                'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=1000&q=80',
                'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1000&q=80',
                'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=1000&q=80',
            ],
            'Bali' => [
                'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=1000&q=80',
                'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1000&q=80',
                'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1000&q=80',
                'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000&q=80',
            ],
            'Rome' => [
                'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=1000&q=80',
                'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=1000&q=80',
                'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1000&q=80',
                'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=1000&q=80',
            ],
            'Dubaï' => [
                'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1000&q=80',
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=80',
                'https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=1000&q=80',
                'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1000&q=80',
            ],
            'Santorin' => [
                'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1000&q=80',
                'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=80',
                'https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=1000&q=80',
                'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1000&q=80',
            ],
            'Bangkok' => [
                'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1000&q=80',
                'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1000&q=80',
                'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=1000&q=80',
                'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1000&q=80',
            ],
            'Barcelone' => [
                'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1000&q=80',
                'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=1000&q=80',
                'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=1000&q=80',
                'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?w=1000&q=80',
            ],
            'Finale coupe africaine' => [
                'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&q=80',
                'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1000&q=80',
                'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1000&q=80',
                'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1000&q=80',
            ],
            'Omra Ramadan' => [
                'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1000&q=80',
                'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1000&q=80',
                'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=1000&q=80',
                'https://images.unsplash.com/photo-1604234740238-ff7a333216c3?w=1000&q=80',
            ],
            'Hajj économique' => [
                'https://images.unsplash.com/photo-1604234740238-ff7a333216c3?w=1000&q=80',
                'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1000&q=80',
                'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1000&q=80',
                'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1000&q=80',
            ],
            'Navette Casablanca - Marrakech' => [
                'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&q=80',
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&q=80',
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=80',
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80',
            ],
            'Chefchaouen' => [
                'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1000&q=80',
                'https://images.unsplash.com/photo-1548018560-c7196548e84d?w=1000&q=80',
                'https://images.unsplash.com/photo-1528127269322-539801943592?w=1000&q=80',
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=80',
            ],
            'Istanbul' => [
                'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1000&q=80',
                'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=1000&q=80',
                'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=1000&q=80',
                'https://images.unsplash.com/photo-1605581810011-c6c684e7b2e5?w=1000&q=80',
            ],
            'Maldives' => [
                'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1000&q=80',
                'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1000&q=80',
                'https://images.unsplash.com/photo-1543731068-7e0f5beff43a?w=1000&q=80',
                'https://images.unsplash.com/photo-1578922746465-3a80a228f223?w=1000&q=80',
            ],
            'Festival Mawazine' => [
                'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&q=80',
                'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1000&q=80',
                'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000&q=80',
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=80',
            ],
            'Concert Marrakech Live' => [
                'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&q=80',
                'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000&q=80',
                'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&q=80',
                'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1000&q=80',
            ],
            'Omra Confort' => [
                'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=1000&q=80',
                'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1000&q=80',
                'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1000&q=80',
                'https://images.unsplash.com/photo-1604234740238-ff7a333216c3?w=1000&q=80',
            ],
            'Omra Famille' => [
                'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1000&q=80',
                'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=1000&q=80',
                'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1000&q=80',
                'https://images.unsplash.com/photo-1604234740238-ff7a333216c3?w=1000&q=80',
            ],
            'Hajj Premium' => [
                'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1000&q=80',
                'https://images.unsplash.com/photo-1604234740238-ff7a333216c3?w=1000&q=80',
                'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1000&q=80',
                'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1000&q=80',
            ],
            'Train Rabat - Tanger' => [
                'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1000&q=80',
                'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1000&q=80',
                'https://images.unsplash.com/photo-1518084823714-2f59a7315a39?w=1000&q=80',
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=80',
            ],
            'Vol Casablanca - Dubaï' => [
                'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&q=80',
                'https://images.unsplash.com/photo-1483450388369-9ed95738483c?w=1000&q=80',
                'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1000&q=80',
                'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000&q=80',
            ],
            'Ferry Tanger - Tarifa' => [
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&q=80',
                'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1000&q=80',
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1000&q=80',
                'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1000&q=80',
            ],
        ];

        return $galleries[$voyage['destination']] ?? array_values(array_unique([$voyage['image'], ...$fallback]));
    }
}
