import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AppFooter from "../components/AppFooter";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { reservationsApi, paiementsApi, type Reservation, type PaymentMethod } from "../api/reservations";

const FALLBACK_IMAGES: Record<string, string> = {
  voyage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
  evenement: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
  hajj: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
  omra: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800",
  transport: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800",
};

const imageFor = (r: Reservation) => {
  const voyage = r.voyage;
  return (
    voyage.gallery?.[0] ||
    voyage.image ||
    FALLBACK_IMAGES[voyage.offer_type] ||
    FALLBACK_IMAGES.voyage
  );
};

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, r: Reservation) => {
  const fallback = FALLBACK_IMAGES[r.voyage.offer_type] || FALLBACK_IMAGES.voyage;
  if (e.currentTarget.src !== fallback) {
    e.currentTarget.src = fallback;
  }
};

export default function ReservationPage() {
  const { logout } = useAuth();
  const { formatMoney, formatDate, t } = usePreferences();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "en_attente" | "confirmee" | "annulee">("all");
  const [payModal, setPayModal] = useState<Reservation | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState("");

  const load = () => {
    setLoading(true);
    reservationsApi.getAll().then((r) => {
      setReservations(r.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
    paiementsApi.getMethods().then((r) => {
      setMethods(r.data);
      if (r.data.length > 0) setSelectedMethod(r.data[0].id);
    });
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm(t("cancelReservationConfirm"))) return;
    await reservationsApi.cancel(id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("deleteReservationConfirm"))) return;
    await reservationsApi.delete(id);
    load();
  };

  const handlePay = async () => {
    if (!payModal || !selectedMethod) return;
    setPaying(true);
    try {
      await paiementsApi.pay(payModal.id, selectedMethod);
      setSuccess(`${t("paymentSuccess")} ${payModal.voyage.destination}`);
      setPayModal(null);
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (e: any) {
      alert(e?.response?.data?.message || t("paymentError"));
    } finally {
      setPaying(false);
    }
  };

  const filtered =
    filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

  const pendingCount = reservations.filter((r) => r.status === "en_attente").length;
  const confirmedCount = reservations.filter((r) => r.status === "confirmee").length;
  const cancelledCount = reservations.filter((r) => r.status === "annulee").length;
  const totalAmount = reservations
    .filter((r) => r.status !== "annulee")
    .reduce((sum, r) => sum + r.total_price, 0);

  const statusLabel = (status: string) =>
    status === "en_attente" ? t("pending") :
    status === "confirmee" ? t("confirmed") :
    status === "annulee" ? t("cancelled") :
    status;

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>{t("reservationsTitle")}</h2>
            <p>{t("reservationsSubtitle")}</p>
          </div>
          <button className="primary-action-btn" onClick={() => navigate("/voyages")}>
            {t("newReservation")}
          </button>
        </div>

        {success && <div className="alert-success">{success}</div>}

        <div className="reservation-summary">
          <div>
            <span>{t("activeTotal")}</span>
            <b>{formatMoney(totalAmount)}</b>
          </div>
          <div>
            <span>{t("confirmed")}</span>
            <b>{confirmedCount}</b>
          </div>
          <div>
            <span>{t("pending")}</span>
            <b>{pendingCount}</b>
          </div>
          <div>
            <span>{t("cancelled")}</span>
            <b>{cancelledCount}</b>
          </div>
        </div>

        <div className="filter-tabs">
          {(["all", "en_attente", "confirmee", "annulee"] as const).map((s) => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? t("all") : statusLabel(s)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">{t("loading")}</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>{t("noReservation")}{" "}
              <span onClick={() => navigate("/voyages")}>{t("exploreOffers")} →</span>
            </p>
          </div>
        ) : (
          <div className="reservation-list">
            {filtered.map((r) => (
              <div key={r.id} className="reservation-card">
                <div className="res-img-wrap">
                  <img
                    src={imageFor(r)}
                    alt={r.voyage.destination}
                    className="res-img"
                    onError={(e) => handleImageError(e, r)}
                  />
                  {r.voyage.gallery?.length > 1 && (
                    <div className="res-gallery-count">
                      +{r.voyage.gallery.length - 1} {t("photos")}
                    </div>
                  )}
                </div>
                <div className="res-info">
                  <div className="res-top">
                    <div>
                      <h4>{r.voyage.destination}, {r.voyage.country}</h4>
                      <p className="muted">
                        {t("departure")} : {formatDate(r.departure_date)} ·
                        {r.passengers} {t("passengers")} · {r.voyage.duration} {t("days")}
                      </p>
                    </div>
                    <span className={`status-badge status-${r.status}`}>
                      {statusLabel(r.status)}
                    </span>
                  </div>
                  <div className="res-bottom">
                    <div className="res-price-block">
                      <span>{t("total")}</span>
                      <b className="res-price">{formatMoney(r.total_price)}</b>
                    </div>
                    <div className="res-actions">
                      {r.status === "en_attente" && (
                        <>
                          <button
                            className="btn-pay"
                            onClick={() => {
                              setPayModal(r);
                              if (methods.length > 0) setSelectedMethod(methods[0].id);
                            }}
                          >
                            {t("pay")}
                          </button>
                          <button className="btn-cancel" onClick={() => handleCancel(r.id)}>
                            {t("cancelReservation")}
                          </button>
                        </>
                      )}
                      {r.status === "annulee" && (
                        <button className="btn-delete" onClick={() => handleDelete(r.id)}>
                          {t("delete")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {payModal && (
          <div className="modal">
            <div className="modal-box">
              <h3>{t("payTitle")} — {payModal.voyage.destination}</h3>
              <p style={{ opacity: 0.7 }}>
                {t("amount")} : <b>{formatMoney(payModal.total_price)}</b>
              </p>

              {methods.length === 0 ? (
                <div>
                  <p style={{ color: "#e05252", marginBottom: 12 }}>
                    {t("noCardForPayment")}
                  </p>
                  <button onClick={() => { setPayModal(null); navigate("/paiement"); }}>
                    {t("goToPayments")}
                  </button>
                </div>
              ) : (
                <>
                  <label style={{ fontWeight: 700, fontSize: 13 }}>{t("chooseCard")}</label>
                  <select
                    className="modal-select"
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  >
                    {methods.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.type.toUpperCase()} **** {m.last4} — {m.holder}
                      </option>
                    ))}
                  </select>
                  <div className="modal-actions">
                    <button onClick={handlePay} disabled={paying}>
                      {paying ? t("processing") : t("confirmPayment")}
                    </button>
                    <button className="ghost" onClick={() => setPayModal(null)}>
                      {t("cancel")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        <AppFooter compact />
      </main>
    </div>
  );
}
