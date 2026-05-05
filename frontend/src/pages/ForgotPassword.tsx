import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import "../styles/auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!email) return alert("Veuillez saisir votre email");
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      setGeneratedCode(res.code);
      setStep(2);
      alert(`Code de vérification (simulation) : ${res.code}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Aucun compte avec cet email");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = () => {
    if (code === generatedCode) {
      setStep(3);
    } else {
      alert("Code incorrect");
    }
  };

  const resetPassword = async () => {
    if (!newPassword) return alert("Veuillez saisir un nouveau mot de passe");
    setLoading(true);
    try {
      await authApi.resetPassword(email, code, newPassword);
      alert("Mot de passe mis à jour avec succès !");
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Erreur lors de la réinitialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box forgot">
        <div
          className="auth-left"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800')",
          }}
        >
          <div className="auth-quote">
            RÉINITIALISEZ VOTRE MOT DE PASSE <br /> ET VOYAGEZ À NOUVEAU ✈️
          </div>
        </div>

        <div className="auth-right">
          <h3>Mot de passe oublié</h3>

          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={sendCode} disabled={loading}>
                  {loading ? "Envoi..." : "Envoyer le code"}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <p style={{ opacity: 0.8, fontSize: 13 }}>
                  Code envoyé à <strong>{email}</strong>
                </p>
                <input
                  placeholder="Code de vérification"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button onClick={verifyCode}>Vérifier le code</button>
              </>
            )}

            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={resetPassword} disabled={loading}>
                  {loading ? "En cours..." : "Réinitialiser"}
                </button>
              </>
            )}
          </form>

          <span className="forgot" onClick={() => navigate("/")}>
            ← Retour à la connexion
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
