import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { reservationsApi, paiementsApi, type Reservation, type PaymentMethod } from "../api/reservations";

const STATUS_LABELS: Record<string, string> = {
  en_attente: "En attente",
  confirmee: "Confirmée",
  annulee: "Annulée",
};

export default function ReservationPage() {
  const { logout } = useAuth();
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
    if (!window.confirm("Annuler cette réservation ?")) return;
    await reservationsApi.cancel(id);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer définitivement cette réservation ?")) return;
    await reservationsApi.delete(id);
    load();
  };

  const handlePay = async () => {
    if (!payModal || !selectedMethod) return;
    setPaying(true);
    try {
      await paiementsApi.pay(payModal.id, selectedMethod);
      setSuccess(`Paiement réussi pour ${payModal.voyage.destination} !`);
      setPayModal(null);
      load();
      setTimeout(() => setSuccess(""), 4000);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Erreur de paiement");
    } finally {
      setPaying(false);
    }
  };

  const filtered =
    filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>Mes Réservations</h2>
            <p>Gérez tous vos voyages réservés</p>
          </div>
          <button className="primary-action-btn" onClick={() => navigate("/voyages")}>
            + Nouvelle réservation
          </button>
        </div>

        {success && <div className="alert-success">{success}</div>}

        <div className="filter-tabs">
          {(["all", "en_attente", "confirmee", "annulee"] as const).map((s) => (
            <button
              key={s}
              className={`filter-tab ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "Toutes" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>Aucune réservation.{" "}
              <span onClick={() => navigate("/voyages")}>Explorer les offres →</span>
            </p>
          </div>
        ) : (
          <div className="reservation-list">
            {filtered.map((r) => (
              <div key={r.id} className="reservation-card">
                <img src={r.voyage.image} alt={r.voyage.destination} className="res-img" />
                <div className="res-info">
                  <div className="res-top">
                    <div>
                      <h4>{r.voyage.destination}, {r.voyage.country}</h4>
                      <p className="muted">
                        Départ : {new Date(r.departure_date).toLocaleDateString("fr-FR")} ·
                        {r.passengers} passager(s) · {r.voyage.duration} jours
                      </p>
                    </div>
                    <span className={`status-badge status-${r.status}`}>
                      {STATUS_LABELS[r.status]}
                    </span>
                  </div>
                  <div className="res-bottom">
                    <b className="res-price">{r.total_price.toLocaleString("fr-FR")} €</b>
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
                            Payer
                          </button>
                          <button className="btn-cancel" onClick={() => handleCancel(r.id)}>
                            Annuler
                          </button>
                        </>
                      )}
                      {r.status === "annulee" && (
                        <button className="btn-delete" onClick={() => handleDelete(r.id)}>
                          Supprimer
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
              <h3>Payer — {payModal.voyage.destination}</h3>
              <p style={{ opacity: 0.7 }}>
                Montant : <b>{payModal.total_price.toLocaleString("fr-FR")} €</b>
              </p>

              {methods.length === 0 ? (
                <div>
                  <p style={{ color: "#e05252", marginBottom: 12 }}>
                    Aucune carte enregistrée. Ajoutez-en une dans Paiements.
                  </p>
                  <button onClick={() => { setPayModal(null); navigate("/paiement"); }}>
                    Aller aux paiements
                  </button>
                </div>
              ) : (
                <>
                  <label style={{ fontWeight: 700, fontSize: 13 }}>Choisir une carte</label>
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
                      {paying ? "Traitement..." : "Confirmer le paiement"}
                    </button>
                    <button className="ghost" onClick={() => setPayModal(null)}>
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
