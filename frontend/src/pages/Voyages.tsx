import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PromoTicker from "../components/PromoTicker";
import AppFooter from "../components/AppFooter";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { voyagesApi, type Voyage } from "../api/voyages";
import { reservationsApi } from "../api/reservations";

const CATEGORIES = [
  "Tous",
  "Voyages",
  "Événements",
  "Hajj",
  "Omra",
  "Transport",
  "Europe",
  "Asie",
  "Afrique",
  "Amériques",
  "Moyen-Orient",
  "Océan Indien",
];

const TRANSPORTS = ["Tous", "Avion", "Bus", "Train", "Bateau", "Voiture"];

const CATEGORY_LABEL_KEYS: Record<string, string> = {
  Tous: "catAll",
  Voyages: "catTrips",
  "Événements": "catEvents",
  Hajj: "catHajj",
  Omra: "catOmra",
  Transport: "catTransport",
  Europe: "catEurope",
  Asie: "catAsia",
  Afrique: "catAfrica",
  Amériques: "catAmericas",
  "Moyen-Orient": "catMiddleEast",
  "Océan Indien": "catIndianOcean",
};

const TRANSPORT_LABEL_KEYS: Record<string, string> = {
  Tous: "transportAll",
  Avion: "plane",
  Bus: "bus",
  Train: "train",
  Bateau: "boat",
  Voiture: "car",
};

const FALLBACK_IMAGES: Record<string, string> = {
  voyage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
  evenement: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  hajj: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
  omra: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800",
  transport: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
};

const imageFor = (v: Voyage, index = 0) =>
  v.gallery?.[index] || v.image || FALLBACK_IMAGES[v.offer_type] || FALLBACK_IMAGES.voyage;

const imagesFor = (v: Voyage) => {
  const images = v.gallery?.length ? v.gallery : [v.image];
  const clean = images.filter(Boolean);
  return clean.length ? clean : [FALLBACK_IMAGES[v.offer_type] || FALLBACK_IMAGES.voyage];
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, v: Voyage) => {
  const fallback = FALLBACK_IMAGES[v.offer_type] || FALLBACK_IMAGES.voyage;
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
};

export default function Voyages() {
  const { logout } = useAuth();
  const { formatMoney, formatDate, t } = usePreferences();
  const navigate = useNavigate();
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [transport, setTransport] = useState("Tous");
  const [maxPrice, setMaxPrice] = useState(9000);
  const [booking, setBooking] = useState<Voyage | null>(null);
  const [details, setDetails] = useState<Voyage | null>(null);
  const [detailImage, setDetailImage] = useState("");
  const [form, setForm] = useState({ departure_date: "", passengers: 1 });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const load = () => {
    setLoading(true);
    voyagesApi
      .getAll({
        search: search || undefined,
        category: category === "Tous" ? undefined : category,
        transport_type: transport === "Tous" ? undefined : transport,
        max_price: maxPrice,
      })
      .then((r) => setVoyages(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, category, transport, maxPrice]);

  const handleBook = async () => {
    if (!booking || !form.departure_date) return;
    setSaving(true);
    try {
      await reservationsApi.create({
        voyage_id: booking.id,
        departure_date: form.departure_date,
        passengers: form.passengers,
      });
      setSuccess(`${booking.destination} - ${t("reservationSuccess")}`);
      setBooking(null);
      setForm({ departure_date: "", passengers: 1 });
      setTimeout(() => setSuccess(""), 4000);
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        alert(first[0]);
      } else {
        alert(e?.response?.data?.message || t("reservationError"));
      }
    } finally {
      setSaving(false);
    }
  };

  const stars = (r: number) =>
    "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

  const openBooking = (v: Voyage) => {
    setBooking(v);
    setForm({
      departure_date: v.departure_dates[0] || "",
      passengers: 1,
    });
  };

  const openDetails = (v: Voyage) => {
    setDetails(v);
    setDetailImage(imageFor(v));
  };

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>{t("offersTitle")}</h2>
            <p>{t("offersSubtitle")}</p>
          </div>
        </div>

        {success && <div className="alert-success">{success}</div>}

        <PromoTicker />

        <div className="filters-bar">
          <input
            className="search-input"
            placeholder={t("searchDestination")}
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
                {t(CATEGORY_LABEL_KEYS[c] || c)}
              </button>
            ))}
          </div>
          <div className="transport-filter">
            <span>{t("transportMode")}</span>
            <select
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
            >
              {TRANSPORTS.map((item) => (
                <option key={item} value={item}>
                  {t(TRANSPORT_LABEL_KEYS[item] || item)}
                </option>
              ))}
            </select>
          </div>
          <div className="price-filter">
            <label>
              {t("maxBudget")} : <b>{formatMoney(maxPrice)}</b>
            </label>
            <input
              type="range"
              min={500}
              max={9000}
              step={100}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">{t("loadingOffers")}</div>
        ) : voyages.length === 0 ? (
          <div className="empty-state">
            <p>{t("noOffers")}</p>
          </div>
        ) : (
          <div className="voyages-grid">
            {voyages.map((v) => (
              <div
                key={v.id}
                className="voyage-card"
                role="button"
                tabIndex={0}
                onClick={() => openDetails(v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetails(v);
                  }
                }}
              >
                <div className="voyage-img-wrap">
                  <img src={imageFor(v)} alt={v.destination} onError={(e) => handleImageError(e, v)} />
                  <span className="voyage-category">{v.category}</span>
                  <span className="offer-badge">{v.offer_label}</span>
                  {v.gallery?.length > 1 && (
                    <div className="gallery-strip">
                      {v.gallery.slice(0, 4).map((img, index) => (
                        <img key={`${v.id}-${img}-${index}`} src={img} alt={`${v.destination} ${index + 1}`} onError={(e) => handleImageError(e, v)} />
                      ))}
                    </div>
                  )}
                  {v.available_spots <= 5 && (
                    <span className="voyage-urgent">
                      {v.available_spots} {t("seatsLeft")}
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
                      <b>{formatMoney(v.price)}</b>
                      <small>{t("perPerson")}</small>
                    </div>
                  </div>
                  <p className="voyage-desc">{v.description}</p>
                  <div className="offer-meta">
                    {v.transport && <span>{v.transport}</span>}
                    {v.departure_place && v.arrival_place && (
                      <span>{v.departure_place} → {v.arrival_place}</span>
                    )}
                    {v.event_date && (
                      <span>
                        {formatDate(v.event_date)}
                      </span>
                    )}
                  </div>
                  <div className="voyage-footer">
                    <span className="voyage-rating">
                      {stars(v.rating)} {v.rating}
                    </span>
                    <span className="voyage-duration">
                      {v.duration} {t("days")}
                    </span>
                  </div>
                  <button
                    className="book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(v);
                    }}
                  >
                    {t("bookOffer")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {details && (
          <div className="modal" onClick={() => setDetails(null)}>
            <div className="modal-box offer-detail-modal" onClick={(e) => e.stopPropagation()}>
              <button className="offer-detail-close" onClick={() => setDetails(null)} aria-label={t("close")}>
                x
              </button>

              <div className="offer-detail-shell">
                <div className="offer-detail-gallery">
                  <img
                    className="offer-detail-main"
                    src={detailImage || imageFor(details)}
                    alt={details.destination}
                    onError={(e) => handleImageError(e, details)}
                  />
                  <div className="offer-detail-thumbs">
                    {imagesFor(details).slice(0, 5).map((img, index) => (
                      <button
                        key={`${details.id}-detail-${index}`}
                        className={img === (detailImage || imageFor(details)) ? "active" : ""}
                        onClick={() => setDetailImage(img)}
                        type="button"
                      >
                        <img src={img} alt={`${details.destination} ${index + 1}`} onError={(e) => handleImageError(e, details)} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="offer-detail-content">
                  <div className="offer-detail-head">
                    <span>{details.offer_label}</span>
                    <h3>{details.destination}</h3>
                    <p>{details.country} · {details.duration} {t("days")}</p>
                  </div>

                  <div className="offer-detail-price">
                    <small>{t("startingFrom")}</small>
                    <b>{formatMoney(details.price)}</b>
                    <span>{t("person")}</span>
                  </div>

                  <p className="offer-detail-desc">{details.description}</p>

                  <div className="offer-detail-grid">
                    <div>
                      <small>{t("rating")}</small>
                      <b>{stars(details.rating)} {details.rating}</b>
                    </div>
                    <div>
                      <small>{t("seats")}</small>
                      <b>{details.available_spots} {t("available")}</b>
                    </div>
                    <div>
                      <small>{t("transport")}</small>
                      <b>{details.transport || t("accordingProgram")}</b>
                    </div>
                    <div>
                      <small>{t("nextDeparture")}</small>
                      <b>
                        {details.departure_dates[0]
                          ? formatDate(details.departure_dates[0])
                          : t("onRequest")}
                      </b>
                    </div>
                    {details.departure_place && details.arrival_place && (
                      <div className="offer-detail-wide">
                        <small>{t("route")}</small>
                        <b>{details.departure_place} → {details.arrival_place}</b>
                      </div>
                    )}
                    {details.event_date && (
                      <div className="offer-detail-wide">
                        <small>{t("eventDate")}</small>
                        <b>{formatDate(details.event_date)}</b>
                      </div>
                    )}
                  </div>

                  <div className="offer-detail-actions">
                    <button
                      onClick={() => {
                        openBooking(details);
                        setDetails(null);
                      }}
                    >
                      {t("continueBooking")}
                    </button>
                    <button className="ghost" onClick={() => setDetails(null)}>
                      {t("close")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {booking && (
          <div className="modal">
            <div className="modal-box">
              <h3>{t("bookingFor")} — {booking.destination}</h3>
              <p style={{ opacity: 0.7, marginBottom: 8 }}>
                {booking.country} · {booking.duration} {t("days")}
              </p>

              <label style={{ fontWeight: 700, fontSize: 13 }}>
                {t("departureDate")}
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
                    {formatDate(d, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>

              <label style={{ fontWeight: 700, fontSize: 13 }}>
                {t("passengerCount")}
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
                {t("total")} :{" "}
                <b>
                  {formatMoney(booking.price * form.passengers)}
                </b>
              </div>

              <div className="modal-actions">
                <button onClick={handleBook} disabled={saving}>
                  {saving ? t("inProgress") : t("confirm")}
                </button>
                <button className="ghost" onClick={() => setBooking(null)}>
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        )}
        <AppFooter compact />
      </main>
    </div>
  );
}
