import { useNavigate } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext";

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { t } = usePreferences();

  return (
    <div className="card profile-card">
      <h3 style={{ marginBottom: 12 }}>{t("paymentMethods")}</h3>
      <p style={{ opacity: 0.7 }}>
        {t("paymentMethodsText")}
      </p>
      <button
        className="btn primary"
        style={{ marginTop: 16 }}
        onClick={() => navigate("/paiement")}
      >
        {t("manageCards")}
      </button>
    </div>
  );
}
