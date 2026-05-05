import client from "./client";
import type { Voyage } from "./voyages";

export interface Reservation {
  id: string;
  user_id: string;
  voyage_id: string;
  voyage: Voyage;
  departure_date: string;
  passengers: number;
  total_price: number;
  status: "en_attente" | "confirmee" | "annulee";
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "paypal" | "amex";
  last4: string;
  expiry: string;
  holder: string;
  is_default: boolean;
}

export interface Payment {
  id: string;
  reservation_id: string;
  amount: number;
  status: "reussi" | "echec" | "rembourse";
  method_label: string;
  created_at: string;
  description: string;
}

export const reservationsApi = {
  async getAll(): Promise<{ data: Reservation[] }> {
    const { data } = await client.get("/reservations");
    return data;
  },

  async create(payload: {
    voyage_id: string;
    departure_date: string;
    passengers: number;
  }): Promise<Reservation> {
    const { data } = await client.post("/reservations", payload);
    return data.reservation ?? data;
  },

  async cancel(id: string): Promise<Reservation> {
    const { data } = await client.put(`/reservations/${id}/cancel`);
    return data.reservation ?? data;
  },

  async delete(id: string): Promise<void> {
    await client.delete(`/reservations/${id}`);
  },
};

export const paiementsApi = {
  async getMethods(): Promise<{ data: PaymentMethod[] }> {
    const { data } = await client.get("/paiements/methods");
    return data;
  },

  async addMethod(payload: {
    type: string;
    last4: string;
    expiry: string;
    holder: string;
  }): Promise<PaymentMethod> {
    const { data } = await client.post("/paiements/methods", payload);
    return data.method ?? data;
  },

  async deleteMethod(id: string): Promise<void> {
    await client.delete(`/paiements/methods/${id}`);
  },

  async getHistory(): Promise<{ data: Payment[] }> {
    const { data } = await client.get("/paiements/history");
    return data;
  },

  async pay(reservation_id: string, method_id: string): Promise<Payment> {
    const { data } = await client.post("/paiements/pay", {
      reservation_id,
      method_id,
    });
    return data.paiement ?? data;
  },
};
