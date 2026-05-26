import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/auth";
import { usePreferences } from "../context/PreferencesContext";
import "../styles/auth.css";

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = usePreferences();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!email) return alert(t("enterEmail"));
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email);
      const verificationCode = String(res.code);
      setGeneratedCode(verificationCode);
      setStep(2);
      alert(`${t("verificationCode")} : ${verificationCode}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || t("emailNotFound"));
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = () => {
    if (code.trim() === generatedCode.trim()) {
      setStep(3);
    } else {
      alert(t("invalidCode"));
    }
  };

  const resetPassword = async () => {
    if (!newPassword) return alert(t("enterNewPassword"));
    setLoading(true);
    try {
      await authApi.resetPassword(email, code.trim(), newPassword);
      alert(t("passwordUpdated"));
      navigate("/login");
    } catch (err: any) {
      alert(err?.response?.data?.message || t("resetError"));
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
            {t("resetHero")} <br /> {t("travelAgain")}
          </div>
        </div>

        <div className="auth-right">
          <h3>{t("forgotPassword")}</h3>

          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <>
                <input
                  type="email"
                  placeholder={t("yourEmail")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={sendCode} disabled={loading}>
                  {loading ? t("sending") : t("sendCode")}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <p style={{ opacity: 0.8, fontSize: 13 }}>
                  {t("codeSentTo")} <strong>{email}</strong>
                </p>
                <input
                  placeholder={t("verificationCode")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button onClick={verifyCode}>{t("verifyCode")}</button>
              </>
            )}

            {step === 3 && (
              <>
                <input
                  type="password"
                  placeholder={t("newPassword")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button onClick={resetPassword} disabled={loading}>
                  {loading ? t("inProgress") : t("reset")}
                </button>
              </>
            )}
          </form>

          <span className="forgot" onClick={() => navigate("/login")}>
            ← {t("backToLogin")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
