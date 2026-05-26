import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNavbar from "../components/TopNavbar";
import PromoTicker from "../components/PromoTicker";
import AppFooter from "../components/AppFooter";
import AppIcon from "../components/AppIcon";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
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

const FALLBACK_IMAGES: Record<string, string> = {
  voyage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
  evenement: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  hajj: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
  omra: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800",
  transport: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
};

const QUICK_ACTIONS = [
  { path: "/voyages", labelKey: "exploreTrips", icon: "offers" },
  { path: "/reservation", labelKey: "myReservations", icon: "reservations" },
  { path: "/paiement", labelKey: "payments", icon: "payment" },
  { path: "/documents", labelKey: "documents", icon: "tickets" },
  { path: "/profile", labelKey: "myProfile", icon: "profile" },
] as const;

const imageFor = (r: Reservation) => {
  const voyage = r.voyage;
  return (
    voyage?.gallery?.[0] ||
    voyage?.image ||
    FALLBACK_IMAGES[voyage?.offer_type || "voyage"] ||
    FALLBACK_IMAGES.voyage
  );
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, r: Reservation) => {
  const fallback = FALLBACK_IMAGES[r.voyage?.offer_type || "voyage"] || FALLBACK_IMAGES.voyage;
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
};

export default function Home() {
  const { user } = useAuth();
  const { formatMoney, formatDate, t } = usePreferences();
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
    <div className="home-layout">
      <TopNavbar />
      <main className="content home-content">
        <div className="page-header">
          <div>
            <h2>{t("hello")}, {user?.name?.split(" ")[0]}</h2>
            <p>{t("homeSubtitle")}</p>
          </div>
        </div>

        <PromoTicker />

        <section className="marketing-video-section">
          <video
            className="marketing-video"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80"
          >
            <source
              src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="marketing-video-overlay">
            <span>{t("landingBadge")}</span>
            <h1>{t("marketingTitle")}</h1>
            <p>{t("marketingSubtitle")}</p>
            <button onClick={() => navigate("/voyages")}>
              {t("exploreOffers")}
            </button>
          </div>
        </section>

        <div className="stats-grid">
          <div className="stat-box">
            <b>{confirmed}</b>
            <small>{t("confirmedTrips")}</small>
          </div>
          <div className="stat-box">
            <b>{pending}</b>
            <small>{t("pending")}</small>
          </div>
          <div className="stat-box">
            <b>{formatMoney(totalSpent)}</b>
            <small>{t("totalSpent")}</small>
          </div>
        </div>

        <div className="home-section">
          <div className="section-header">
            <h3>{t("popularDestinations")}</h3>
            <button className="link-btn" onClick={() => navigate("/voyages")}>
              {t("seeAll")} →
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
                  <span className="featured-price">{t("from")} {formatMoney(f.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="home-section">
          <div className="section-header">
            <h3>{t("upcomingTrips")}</h3>
            <button
              className="link-btn"
              onClick={() => navigate("/reservation")}
            >
              {t("seeAll")} →
            </button>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state">
              <p>
                {t("noUpcomingTrips")}{" "}
                <span onClick={() => navigate("/voyages")}>
                  {t("exploreOffers")} →
                </span>
              </p>
            </div>
          ) : (
            <div className="upcoming-list">
              {upcoming.map((r) => (
                <div key={r.id} className="upcoming-card">
                  <img
                    src={imageFor(r)}
                    alt={r.voyage?.destination}
                    onError={(e) => handleImageError(e, r)}
                  />
                  <div className="upcoming-info">
                    <b>
                      {r.voyage?.destination}, {r.voyage?.country}
                    </b>
                    <p>
                      {t("departure")} :{" "}
                      {formatDate(r.departure_date)}
                    </p>
                    <p>
                      {r.passengers} {t("passengers")} ·{" "}
                      {formatMoney(r.total_price)}
                    </p>
                  </div>
                  <span className={`status-badge status-${r.status}`}>
                    {r.status === "en_attente"
                      ? t("pending")
                      : r.status === "confirmee"
                      ? t("confirmed")
                      : t("cancelled")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="home-section">
          <div className="section-header">
            <h3>{t("quickAccess")}</h3>
          </div>
          <div className="quick-actions">
            {QUICK_ACTIONS.map((action) => (
              <div
                key={action.path}
                className="quick-card"
                onClick={() => navigate(action.path)}
              >
                <AppIcon name={action.icon} className="quick-icon" />
                <span>{t(action.labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
        <AppFooter compact />
      </main>
    </div>
  );
}
