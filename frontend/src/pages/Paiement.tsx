import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AppFooter from "../components/AppFooter";
import AppIcon from "../components/AppIcon";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { paiementsApi, type PaymentMethod, type Payment } from "../api/reservations";

export default function PaiementPage() {
  const { logout } = useAuth();
  const { formatMoney, formatDate, t } = usePreferences();
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
      alert(t("requiredFields"));
      return;
    }
    if (form.last4.length !== 4 || !/^\d{4}$/.test(form.last4)) {
      alert(t("fourDigitsRequired"));
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
        alert(e?.response?.data?.message || t("addError"));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("deleteCardConfirm"))) return;
    await paiementsApi.deleteMethod(id);
    load();
  };

  const cardIcon = (type: string) =>
    (["visa", "mastercard", "amex", "paypal"].includes(type) ? type : "visa") as
      | "visa"
      | "mastercard"
      | "amex"
      | "paypal";

  const totalPaid = history
    .filter((p) => p.status === "reussi")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content payment-content">
        <div className="page-header payment-page-header">
          <div>
            <h2>{t("paymentsTitle")}</h2>
            <p>{t("paymentsSubtitle")}</p>
          </div>
          <div className="payment-header-actions">
            <span>{t("securePayment")}</span>
            <button onClick={() => setShowAdd(true)}>{t("addCard")}</button>
          </div>
        </div>

        <div className="stats-grid payment-stats">
          <div className="stat-box">
            <b>{methods.length}</b>
            <small>{t("savedCards")}</small>
          </div>
          <div className="stat-box">
            <b>{history.filter((p) => p.status === "reussi").length}</b>
            <small>{t("successfulPayments")}</small>
          </div>
          <div className="stat-box">
            <b>{formatMoney(totalPaid)}</b>
            <small>{t("totalPaid")}</small>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">{t("loading")}</div>
        ) : (
          <>
            <div className="section-header" style={{ marginTop: 24 }}>
              <h3>{t("myCards")}</h3>
              <button className="link-btn payment-add-link" onClick={() => setShowAdd(true)}>
                + {t("addCard")}
              </button>
            </div>

            {methods.length === 0 ? (
              <div className="empty-state">
                <p>{t("noSavedCards")}</p>
              </div>
            ) : (
              <div className="cards-grid">
                {methods.map((m) => (
                  <div key={m.id} className={`payment-card-item payment-card-${m.type}`}>
                    <div className="payment-card-visual">
                      <div className="payment-card-topline">
                        <span className="payment-card-chip" />
                        {m.is_default && (
                          <span className="badge-default">{t("default")}</span>
                        )}
                      </div>
                      <AppIcon name={cardIcon(m.type)} className="card-logo" title={m.type} />
                      <p className="card-number">**** **** **** {m.last4}</p>
                      <div className="payment-card-meta">
                        <span>{m.holder}</span>
                        <span>{m.expiry}</span>
                      </div>
                    </div>
                    <div className="payment-card-left">
                      <div>
                        <span className="payment-method-label">{m.type.toUpperCase()}</span>
                        <p className="card-holder">{m.holder}</p>
                        <p className="card-expiry">{t("savedCardHint")}</p>
                      </div>
                    </div>
                    <div className="payment-card-right">
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(m.id)}
                      >
                        {t("delete")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="section-header" style={{ marginTop: 32 }}>
              <h3>{t("paymentHistory")}</h3>
            </div>

            {history.length === 0 ? (
              <div className="empty-state">
                <p>{t("noPayments")}</p>
              </div>
            ) : (
              <div className="payment-history">
                <div className="history-header">
                  <span>{t("description")}</span>
                  <span>{t("method")}</span>
                  <span>{t("date")}</span>
                  <span>{t("status")}</span>
                  <span>{t("amount")}</span>
                </div>
                {history.map((p) => (
                  <div key={p.id} className="history-row">
                    <span className="history-description">{p.description}</span>
                    <span className="muted history-method">{p.method_label}</span>
                    <span className="muted history-date">
                      {formatDate(p.created_at)}
                    </span>
                    <span className={`status-badge status-${p.status}`}>
                      {p.status === "reussi"
                        ? t("paidStatus")
                        : p.status === "echec"
                        ? t("failedStatus")
                        : t("refundedStatus")}
                    </span>
                    <span className="history-amount">
                      {formatMoney(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showAdd && (
          <div className="modal">
            <div className="modal-box payment-modal-box">
              <h3>{t("addCard")}</h3>

              <label className="payment-form-label">{t("cardType")}</label>
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
                placeholder={t("lastFour")}
                maxLength={4}
                value={form.last4}
                onChange={(e) =>
                  setForm({ ...form, last4: e.target.value.replace(/\D/g, "") })
                }
              />
              <input
                placeholder={t("expiryPlaceholder")}
                value={form.expiry}
                onChange={(e) => setForm({ ...form, expiry: e.target.value })}
              />
              <input
                placeholder={t("cardHolder")}
                value={form.holder}
                onChange={(e) => setForm({ ...form, holder: e.target.value })}
              />

              <div className="modal-actions">
                <button onClick={handleAdd} disabled={saving}>
                  {saving ? t("saving") : t("addCard")}
                </button>
                <button className="ghost" onClick={() => setShowAdd(false)}>
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
