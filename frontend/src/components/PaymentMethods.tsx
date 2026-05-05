import { useNavigate } from "react-router-dom";

export default function PaymentMethods() {
  const navigate = useNavigate();

  return (
    <div className="card profile-card">
      <h3 style={{ marginBottom: 12 }}>Moyens de paiement</h3>
      <p style={{ opacity: 0.7 }}>
        Gérez vos cartes bancaires et consultez l'historique de vos paiements.
      </p>
      <button
        className="btn primary"
        style={{ marginTop: 16 }}
        onClick={() => navigate("/paiement")}
      >
        Gérer mes cartes
      </button>
    </div>
  );
}
