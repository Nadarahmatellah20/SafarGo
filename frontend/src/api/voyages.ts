import client from "./client";

export interface Voyage {
  id: string;
  destination: string;
  country: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  gallery: string[];
  category: string;
  offer_type: string;
  offer_label: string;
  transport?: string | null;
  departure_place?: string | null;
  arrival_place?: string | null;
  event_date?: string | null;
  available_spots: number;
  rating: number;
  departure_dates: string[];
}

export const voyagesApi = {
  async getAll(params?: {
    search?: string;
    category?: string;
    type_offre?: string;
    transport_type?: string;
    min_price?: number;
    max_price?: number;
  }): Promise<{ data: Voyage[]; total: number }> {
    const { data } = await client.get("/voyages", { params });
    return data;
  },

  async getOne(id: string): Promise<Voyage> {
    const { data } = await client.get(`/voyages/${id}`);
    return data;
  },
};
