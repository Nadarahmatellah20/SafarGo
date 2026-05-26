import client from "./client";

export interface VoyageForm {
  destination: string;
  pays: string;
  description: string;
  prix: number;
  duree: number;
  image: string;
  images: string[];
  note: number;
  places_disponibles: number;
  type_offre: "voyage" | "evenement" | "hajj" | "omra" | "transport";
  transport_type?: string;
  lieu_depart?: string;
  lieu_arrivee?: string;
  date_evenement?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  is_active: boolean;
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

export interface AdminPaiement {
  id: number;
  user_id: number;
  reservation_id: number;
  montant: number;
  statut: string;
  amount: number;
  status: string;
  method_label: string;
  invoice_number: string;
  created_at: string;
  user?: { id: number; name: string; email: string };
  reservation?: {
    id: number;
    nombre_personnes: number;
    date_depart: string;
    total: number;
    statut: string;
    voyage?: { id: number; destination: string; pays: string };
  };
}

export const adminApi = {
  getVoyages: () => client.get("/admin/voyages"),
  createVoyage: (data: VoyageForm) => client.post("/admin/voyages", data),
  updateVoyage: (id: number, data: Partial<VoyageForm>) => client.put(`/admin/voyages/${id}`, data),
  deleteVoyage: (id: number) => client.delete(`/admin/voyages/${id}`),
  getUsers: () => client.get("/admin/users"),
  updateUser: (id: number, data: Partial<Pick<AdminUser, "name" | "email" | "phone" | "is_active">>) =>
    client.put(`/admin/users/${id}`, data),
  deleteUser: (id: number) => client.delete(`/admin/users/${id}`),
  toggleAdmin: (id: number) => client.put(`/admin/users/${id}/toggle-admin`, {}),
  toggleActive: (id: number) => client.put(`/admin/users/${id}/toggle-active`, {}),
  getReservations: () => client.get("/admin/reservations"),
  cancelReservation: (id: number) => client.put(`/admin/reservations/${id}/cancel`, {}),
  deleteReservation: (id: number) => client.delete(`/admin/reservations/${id}`),
  getPaiements: () => client.get("/admin/paiements"),
};
