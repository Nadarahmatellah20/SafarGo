<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Paiement;
use App\Models\User;
use App\Models\Voyage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    private function checkAdmin(Request $request)
    {
        if (!$request->user()->is_admin) {
            abort(403, 'Accès refusé — réservé aux administrateurs.');
        }
    }

    // ── Admin Registration ─────────────────────────────────────

    public function registerAdmin(Request $request)
    {
        $this->checkAdmin($request);

        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone'    => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $admin = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone ?? null,
            'is_admin' => true,
            'documents_enabled' => true,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Compte administrateur créé avec succès',
            'user'    => $admin,
        ], 201);
    }

    // ── Voyages CRUD ──────────────────────────────────────────

    public function indexVoyages(Request $request)
    {
        $this->checkAdmin($request);
        return response()->json(Voyage::orderBy('id')->get());
    }

    public function storeVoyage(Request $request)
    {
        $this->checkAdmin($request);

        $validator = Validator::make($request->all(), [
            'destination'        => 'required|string|max:255',
            'pays'               => 'required|string|max:255',
            'description'        => 'required|string',
            'prix'               => 'required|numeric|min:0',
            'duree'              => 'required|integer|min:1',
            'image'              => 'nullable|url',
            'images'             => 'nullable|array',
            'images.*'           => 'url',
            'note'               => 'nullable|numeric|min:0|max:5',
            'places_disponibles' => 'nullable|integer|min:0',
            'type_offre'         => 'nullable|in:voyage,evenement,hajj,omra,transport',
            'transport_type'     => 'nullable|string|max:255',
            'lieu_depart'        => 'nullable|string|max:255',
            'lieu_arrivee'       => 'nullable|string|max:255',
            'date_evenement'     => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $images = $request->images ?? [];
        $image = $request->image ?: ($images[0] ?? '');

        $voyage = Voyage::create([
            'destination'        => $request->destination,
            'pays'               => $request->pays,
            'description'        => $request->description,
            'prix'               => $request->prix,
            'duree'              => $request->duree,
            'image'              => $image,
            'images'             => $images,
            'note'               => $request->note ?? 4.5,
            'places_disponibles' => $request->places_disponibles ?? 20,
            'type_offre'         => $request->type_offre ?? 'voyage',
            'transport_type'     => $request->transport_type,
            'lieu_depart'        => $request->lieu_depart,
            'lieu_arrivee'       => $request->lieu_arrivee,
            'date_evenement'     => $request->date_evenement,
        ]);

        return response()->json([
            'message' => 'Voyage créé avec succès',
            'voyage'  => $voyage,
        ], 201);
    }

    public function updateVoyage(Request $request, $id)
    {
        $this->checkAdmin($request);

        $voyage = Voyage::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'destination'        => 'sometimes|string|max:255',
            'pays'               => 'sometimes|string|max:255',
            'description'        => 'sometimes|string',
            'prix'               => 'sometimes|numeric|min:0',
            'duree'              => 'sometimes|integer|min:1',
            'image'              => 'nullable|url',
            'images'             => 'nullable|array',
            'images.*'           => 'url',
            'note'               => 'nullable|numeric|min:0|max:5',
            'places_disponibles' => 'nullable|integer|min:0',
            'type_offre'         => 'nullable|in:voyage,evenement,hajj,omra,transport',
            'transport_type'     => 'nullable|string|max:255',
            'lieu_depart'        => 'nullable|string|max:255',
            'lieu_arrivee'       => 'nullable|string|max:255',
            'date_evenement'     => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only([
            'destination', 'pays', 'description',
            'prix', 'duree', 'image', 'images', 'note', 'places_disponibles',
            'type_offre', 'transport_type', 'lieu_depart', 'lieu_arrivee', 'date_evenement',
        ]);

        if (array_key_exists('images', $data) && empty($data['image']) && !empty($data['images'])) {
            $data['image'] = $data['images'][0];
        }

        $voyage->update($data);

        return response()->json([
            'message' => 'Voyage mis à jour',
            'voyage'  => $voyage->fresh(),
        ]);
    }

    public function destroyVoyage(Request $request, $id)
    {
        $this->checkAdmin($request);
        $voyage = Voyage::findOrFail($id);
        $voyage->delete();
        return response()->json(['message' => 'Voyage supprimé']);
    }

    // ── Users list ────────────────────────────────────────────

    public function indexUsers(Request $request)
    {
        $this->checkAdmin($request);
        return response()->json(
            User::select('id', 'name', 'email', 'phone', 'is_admin', 'is_active', 'created_at')
                ->orderBy('id')
                ->get()
        );
    }

    public function updateUser(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name'              => 'required|string|max:255',
            'email'             => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone'             => 'nullable|string|max:20',
            'is_active'         => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = [
            'name'              => trim($request->name),
            'email'             => strtolower(trim($request->email)),
            'phone'             => $request->phone ?: null,
        ];

        if ($request->has('is_active')) {
            if ($user->id === $request->user()->id && !$request->boolean('is_active')) {
                return response()->json(['message' => 'Impossible de désactiver votre propre compte'], 400);
            }

            $data['is_active'] = $request->boolean('is_active');
        }

        $user->update($data);

        if (array_key_exists('is_active', $data) && !$data['is_active']) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => 'Utilisateur mis à jour',
            'user'    => $user->fresh(),
        ]);
    }

    public function destroyUser(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Impossible de supprimer votre propre compte'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    public function toggleActive(Request $request, $id)
    {
        $this->checkAdmin($request);

        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Impossible de désactiver votre propre compte'], 400);
        }

        $user->update(['is_active' => !$user->is_active]);

        if (!$user->is_active) {
            $user->tokens()->delete();
        }

        return response()->json([
            'message' => $user->is_active ? 'Compte activé' : 'Compte désactivé',
            'user'    => $user->fresh(),
        ]);
    }

    public function toggleAdmin(Request $request, $id)
    {
        $this->checkAdmin($request);
        $user = User::findOrFail($id);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Impossible de modifier votre propre rôle'], 400);
        }

        $user->update(['is_admin' => !$user->is_admin]);

        return response()->json([
            'message' => $user->is_admin ? 'Utilisateur promu admin' : 'Droits admin retirés',
            'user'    => $user->fresh(),
        ]);
    }

    // ── Reservations (Admin) ──────────────────────────────────

    public function indexReservations(Request $request)
    {
        $this->checkAdmin($request);

        $reservations = Reservation::with(['user:id,name,email', 'voyage:id,destination,pays'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($reservations);
    }

    public function cancelReservation(Request $request, $id)
    {
        $this->checkAdmin($request);
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['statut' => 'annulée']);
        return response()->json(['message' => 'Réservation annulée', 'reservation' => $reservation->fresh()]);
    }

    public function destroyReservation(Request $request, $id)
    {
        $this->checkAdmin($request);
        $reservation = Reservation::findOrFail($id);
        $reservation->delete();
        return response()->json(['message' => 'Réservation supprimée']);
    }

    public function indexPaiements(Request $request)
    {
        $this->checkAdmin($request);

        $paiements = Paiement::with([
                'user:id,name,email',
                'reservation:id,voyage_id,nombre_personnes,date_depart,total,statut',
                'reservation.voyage:id,destination,pays',
                'method:id,type,derniers_chiffres',
            ])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($paiements);
    }
}
