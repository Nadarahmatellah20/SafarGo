import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { voyagesApi, type Voyage } from "../api/voyages";
import { reservationsApi } from "../api/reservations";

const CATEGORIES = ["Tous", "Europe", "Asie", "Afrique", "Amériques", "Moyen-Orient", "Océan Indien"];

export default function Voyages() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [booking, setBooking] = useState<Voyage | null>(null);
  const [form, setForm] = useState({ departure_date: "", passengers: 1 });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const load = () => {
    setLoading(true);
    voyagesApi
      .getAll({
        search: search || undefined,
        category: category === "Tous" ? undefined : category,
        max_price: maxPrice,
      })
      .then((r) => setVoyages(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, category, maxPrice]);

  const handleBook = async () => {
    if (!booking || !form.departure_date) return;
    setSaving(true);
    try {
      await reservationsApi.create({
        voyage_id: booking.id,
        departure_date: form.departure_date,
        passengers: form.passengers,
      });
      setSuccess(`Réservation pour ${booking.destination} créée avec succès !`);
      setBooking(null);
      setForm({ departure_date: "", passengers: 1 });
      setTimeout(() => setSuccess(""), 4000);
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        alert(first[0]);
      } else {
        alert(e?.response?.data?.message || "Erreur lors de la réservation");
      }
    } finally {
      setSaving(false);
    }
  };

  const stars = (r: number) =>
    "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>Voyages & Offres</h2>
            <p>Découvrez nos meilleures destinations</p>
          </div>
        </div>

        {success && <div className="alert-success">{success}</div>}

        <div className="filters-bar">
          <input
            className="search-input"
            placeholder="Rechercher une destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="cat-tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`cat-tab ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="price-filter">
            <label>
              Budget max : <b>{maxPrice.toLocaleString("fr-FR")} €</b>
            </label>
            <input
              type="range"
              min={500}
              max={3000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Chargement des offres...</div>
        ) : voyages.length === 0 ? (
          <div className="empty-state">
            <p>Aucune offre trouvée.</p>
          </div>
        ) : (
          <div className="voyages-grid">
            {voyages.map((v) => (
              <div key={v.id} className="voyage-card">
                <div className="voyage-img-wrap">
                  <img src={v.image} alt={v.destination} />
                  <span className="voyage-category">{v.category}</span>
                  {v.available_spots <= 5 && (
                    <span className="voyage-urgent">
                      {v.available_spots} places restantes
                    </span>
                  )}
                </div>
                <div className="voyage-body">
                  <div className="voyage-top">
                    <div>
                      <h4>{v.destination}</h4>
                      <p className="voyage-country">{v.country}</p>
                    </div>
                    <div className="voyage-price">
                      <b>{v.price.toLocaleString("fr-FR")} €</b>
                      <small>/pers.</small>
                    </div>
                  </div>
                  <p className="voyage-desc">{v.description}</p>
                  <div className="voyage-footer">
                    <span className="voyage-rating">
                      {stars(v.rating)} {v.rating}
                    </span>
                    <span className="voyage-duration">
                      {v.duration} jours
                    </span>
                  </div>
                  <button
                    className="book-btn"
                    onClick={() => {
                      setBooking(v);
                      setForm({
                        departure_date: v.departure_dates[0] || "",
                        passengers: 1,
                      });
                    }}
                  >
                    Réserver maintenant
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {booking && (
          <div className="modal">
            <div className="modal-box">
              <h3>Réserver — {booking.destination}</h3>
              <p style={{ opacity: 0.7, marginBottom: 8 }}>
                {booking.country} · {booking.duration} jours
              </p>

              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Date de départ
              </label>
              <select
                className="modal-select"
                value={form.departure_date}
                onChange={(e) =>
                  setForm({ ...form, departure_date: e.target.value })
                }
              >
                {booking.departure_dates.map((d) => (
                  <option key={d} value={d}>
                    {new Date(d).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>

              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Nombre de passagers
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.passengers}
                onChange={(e) =>
                  setForm({ ...form, passengers: Number(e.target.value) })
                }
              />

              <div className="modal-total">
                Total :{" "}
                <b>
                  {(booking.price * form.passengers).toLocaleString("fr-FR")} €
                </b>
              </div>

              <div className="modal-actions">
                <button onClick={handleBook} disabled={saving}>
                  {saving ? "En cours..." : "Confirmer"}
                </button>
                <button className="ghost" onClick={() => setBooking(null)}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
