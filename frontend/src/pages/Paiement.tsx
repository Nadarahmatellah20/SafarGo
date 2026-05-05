import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { paiementsApi, type PaymentMethod, type Payment } from "../api/reservations";

export default function PaiementPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [history, setHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    type: "visa",
    last4: "",
    expiry: "",
    holder: "",
  });
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([
      paiementsApi.getMethods(),
      paiementsApi.getHistory(),
    ]).then(([m, h]) => {
      setMethods(m.data);
      setHistory(h.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!form.last4 || !form.expiry || !form.holder) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    if (form.last4.length !== 4 || !/^\d{4}$/.test(form.last4)) {
      alert("Veuillez saisir exactement 4 chiffres");
      return;
    }
    setSaving(true);
    try {
      await paiementsApi.addMethod(form);
      setShowAdd(false);
      setForm({ type: "visa", last4: "", expiry: "", holder: "" });
      load();
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        alert(first[0]);
      } else {
        alert(e?.response?.data?.message || "Erreur lors de l'ajout");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette carte ?")) return;
    await paiementsApi.deleteMethod(id);
    load();
  };

  const CARD_ICONS: Record<string, string> = {
    visa: "https://cdn-icons-png.flaticon.com/512/349/349221.png",
    mastercard: "https://cdn-icons-png.flaticon.com/512/349/349228.png",
    amex: "https://cdn-icons-png.flaticon.com/512/349/349230.png",
    paypal: "https://cdn-icons-png.flaticon.com/512/174/174861.png",
  };

  const totalPaid = history
    .filter((p) => p.status === "reussi")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>Paiements</h2>
            <p>Gérez vos cartes et consultez l'historique</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <b>{methods.length}</b>
            <small>Cartes enregistrées</small>
          </div>
          <div className="stat-box">
            <b>{history.filter((p) => p.status === "reussi").length}</b>
            <small>Paiements réussis</small>
          </div>
          <div className="stat-box">
            <b>{totalPaid.toLocaleString("fr-FR")} €</b>
            <small>Total payé</small>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Chargement...</div>
        ) : (
          <>
            <div className="section-header" style={{ marginTop: 24 }}>
              <h3>Mes cartes</h3>
              <button className="link-btn" onClick={() => setShowAdd(true)}>
                + Ajouter une carte
              </button>
            </div>

            {methods.length === 0 ? (
              <div className="empty-state">
                <p>Aucune carte enregistrée.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {methods.map((m) => (
                  <div key={m.id} className="payment-card-item">
                    <div className="payment-card-left">
                      <img
                        src={CARD_ICONS[m.type] || CARD_ICONS.visa}
                        alt={m.type}
                        className="card-logo"
                      />
                      <div>
                        <p className="card-number">**** **** **** {m.last4}</p>
                        <p className="card-holder">{m.holder}</p>
                        <p className="card-expiry">Exp. {m.expiry}</p>
                      </div>
                    </div>
                    <div className="payment-card-right">
                      {m.is_default && (
                        <span className="badge-default">Par défaut</span>
                      )}
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(m.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="section-header" style={{ marginTop: 32 }}>
              <h3>Historique des paiements</h3>
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                <p>Aucun paiement effectué.</p>
              </div>
            ) : (
              <div className="payment-history">
                <div className="history-header">
                  <span>Description</span>
                  <span>Méthode</span>
                  <span>Date</span>
                  <span>Statut</span>
                  <span>Montant</span>
                </div>
                {history.map((p) => (
                  <div key={p.id} className="history-row">
                    <span>{p.description}</span>
                    <span className="muted">{p.method_label}</span>
                    <span className="muted">
                      {new Date(p.created_at).toLocaleDateString("fr-FR")}
                    </span>
                    <span className={`status-badge status-${p.status}`}>
                      {p.status === "reussi"
                        ? "Réussi"
                        : p.status === "echec"
                        ? "Échoué"
                        : "Remboursé"}
                    </span>
                    <span className="history-amount">
                      {p.amount.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showAdd && (
          <div className="modal">
            <div className="modal-box">
              <h3>Ajouter une carte</h3>

              <label style={{ fontWeight: 700, fontSize: 13 }}>
                Type de carte
              </label>
              <select
                className="modal-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="amex">American Express</option>
                <option value="paypal">PayPal</option>
              </select>

              <input
                placeholder="4 derniers chiffres"
                maxLength={4}
                value={form.last4}
                onChange={(e) =>
                  setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })
                }
              />
              <input
                placeholder="Date d'expiration (ex: 12/28)"
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              />
              <input
                placeholder="Titulaire de la carte"
                value={form.holder}
                onChange={(e) => setForm({ ...form, holder: e.target.value })}
              />

              <div className="modal-actions">
                <button onClick={handleAdd} disabled={saving}>
                  {saving ? "Enregistrement..." : "Ajouter"}
                </button>
                <button className="ghost" onClick={() => setShowAdd(false)}>
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
