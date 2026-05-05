import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { reservationsApi, type Reservation } from "../api/reservations";

const FEATURED = [
  {
    destination: "Paris",
    country: "France",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80",
    price: 899,
  },
  {
    destination: "Maldives",
    country: "Maldives",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80",
    price: 2199,
  },
  {
    destination: "Tokyo",
    country: "Japon",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80",
    price: 1799,
  },
];

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    reservationsApi.getAll().then((r) => setReservations(r.data ?? []));
  }, []);

  const confirmed = reservations.filter((r) => r.status === "confirmee").length;
  const pending = reservations.filter((r) => r.status === "en_attente").length;
  const totalSpent = reservations
    .filter((r) => r.status === "confirmee")
    .reduce((sum, r) => sum + r.total_price, 0);

  const upcoming = reservations
    .filter((r) => r.status !== "annulee")
    .sort(
      (a, b) =>
        new Date(a.departure_date).getTime() -
        new Date(b.departure_date).getTime()
    )
    .slice(0, 3);

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>Bonjour, {user?.name?.split(" ")[0]}</h2>
            <p>Bienvenue sur SafarGo — prêt pour votre prochain voyage ?</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <b>{confirmed}</b>
            <small>Voyages confirmés</small>
          </div>
          <div className="stat-box">
            <b>{pending}</b>
            <small>En attente</small>
          </div>
          <div className="stat-box">
            <b>{totalSpent.toLocaleString("fr-FR")} €</b>
            <small>Total dépensé</small>
          </div>
        </div>

        <div className="home-section">
          <div className="section-header">
            <h3>Destinations populaires</h3>
            <button className="link-btn" onClick={() => navigate("/voyages")}>
              Voir tout →
            </button>
          </div>
          <div className="featured-grid">
            {FEATURED.map((f) => (
              <div
                key={f.destination}
                className="featured-card"
                onClick={() => navigate("/voyages")}
              >
                <img src={f.image} alt={f.destination} />
                <div className="featured-info">
                  <span className="featured-name">{f.destination}</span>
                  <span className="featured-country">{f.country}</span>
                  <span className="featured-price">dès {f.price} €</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-section">
          <div className="section-header">
            <h3>Prochains voyages</h3>
            <button
              className="link-btn"
              onClick={() => navigate("/reservation")}
            >
              Voir tout →
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state">
              <p>
                Aucun voyage prévu.{" "}
                <span onClick={() => navigate("/voyages")}>
                  Explorer les offres →
                </span>
              </p>
            </div>
          ) : (
            <div className="upcoming-list">
              {upcoming.map((r) => (
                <div key={r.id} className="upcoming-card">
                  <img
                    src={r.voyage?.image}
                    alt={r.voyage?.destination}
                  />
                  <div className="upcoming-info">
                    <b>
                      {r.voyage?.destination}, {r.voyage?.country}
                    </b>
                    <p>
                      Départ :{" "}
                      {new Date(r.departure_date).toLocaleDateString("fr-FR")}
                    </p>
                    <p>
                      {r.passengers} passager(s) ·{" "}
                      {r.total_price.toLocaleString("fr-FR")} €
                    </p>
                  </div>
                  <span className={`status-badge status-${r.status}`}>
                    {r.status === "en_attente"
                      ? "En attente"
                      : r.status === "confirmee"
                      ? "Confirmée"
                      : "Annulée"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="home-section">
          <div className="section-header">
            <h3>Accès rapide</h3>
          </div>
          <div className="quick-actions">
            <div className="quick-card" onClick={() => navigate("/voyages")}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/854/854866.png"
                alt=""
              />
              <span>Explorer les voyages</span>
            </div>
            <div
              className="quick-card"
              onClick={() => navigate("/reservation")}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png"
                alt=""
              />
              <span>Mes réservations</span>
            </div>
            <div className="quick-card" onClick={() => navigate("/paiement")}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/633/633611.png"
                alt=""
              />
              <span>Paiements</span>
            </div>
            <div className="quick-card" onClick={() => navigate("/profile")}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png"
                alt=""
              />
              <span>Mon profil</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
