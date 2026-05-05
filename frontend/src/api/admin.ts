import client from "./client";

export interface VoyageForm {
  destination: string;
  pays: string;
  description: string;
  prix: number;
  duree: number;
  image: string;
  note: number;
  places_disponibles: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  created_at: string;
}

export interface AdminReservation {
  id: number;
  user_id: number;
  voyage_id: number;
  nombre_personnes: number;
  date_depart: string;
  total: number;
  statut: string;
  created_at: string;
  user?: { id: number; name: string; email: string };
  voyage?: { id: number; destination: string; pays: string };
}

export const adminApi = {
  getVoyages: () => client.get("/admin/voyages"),
  createVoyage: (data: VoyageForm) => client.post("/admin/voyages", data),
  updateVoyage: (id: number, data: Partial<VoyageForm>) => client.put(`/admin/voyages/${id}`, data),
  deleteVoyage: (id: number) => client.delete(`/admin/voyages/${id}`),
  getUsers: () => client.get("/admin/users"),
  toggleAdmin: (id: number) => client.put(`/admin/users/${id}/toggle-admin`, {}),
  getReservations: () => client.get("/admin/reservations"),
  cancelReservation: (id: number) => client.put(`/admin/reservations/${id}/cancel`, {}),
  deleteReservation: (id: number) => client.delete(`/admin/reservations/${id}`),
};
