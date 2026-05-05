<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
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
            'note'               => 'nullable|numeric|min:0|max:5',
            'places_disponibles' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voyage = Voyage::create([
            'destination'        => $request->destination,
            'pays'               => $request->pays,
            'description'        => $request->description,
            'prix'               => $request->prix,
            'duree'              => $request->duree,
            'image'              => $request->image ?? '',
            'note'               => $request->note ?? 4.5,
            'places_disponibles' => $request->places_disponibles ?? 20,
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
            'note'               => 'nullable|numeric|min:0|max:5',
            'places_disponibles' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $voyage->update($request->only([
            'destination', 'pays', 'description',
            'prix', 'duree', 'image', 'note', 'places_disponibles',
        ]));

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
            User::select('id', 'name', 'email', 'phone', 'is_admin', 'created_at')
                ->orderBy('id')
                ->get()
        );
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
}
