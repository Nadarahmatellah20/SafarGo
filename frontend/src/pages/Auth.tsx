import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import "../styles/auth.css";
import logo from "../assets/logo.png";
import PasswordField from "../components/PasswordField";
import AppIcon from "../components/AppIcon";

function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { t } = usePreferences();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email.trim().toLowerCase(), form.password);
      navigate("/home");
    } catch (err: any) {
      alert(err?.response?.data?.message || t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "apple" | "microsoft") => {
    window.location.href = `/api/auth/social/${provider}/redirect`;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert(t("passwordMismatch"));
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(form.password)) {
      alert(t("passwordRule"));
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email.trim().toLowerCase(),
        phone: form.phone || undefined,
        password: form.password,
        password_confirmation: form.confirm,
      });
      navigate("/home");
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        alert(first[0]);
      } else {
        alert(err?.response?.data?.message || t("registerError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className={`auth-box ${mode}`}>
        <div className="auth-left">
          <div className="auth-brand">
            <img src={logo} alt="SafarGo" />
          </div>
          <div className="auth-quote">
            <span>{t("authTagline")}</span>
            <h2>{t("authTitle")}</h2>
            <p>{t("authSubtitle")}</p>
          </div>
          <div className="auth-highlights">
            <span>{t("authOffers")}</span>
            <span>{t("authSecure")}</span>
            <span>{t("authSupport")}</span>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-heading">
            <span>{t("welcome")}</span>
            <h3 className="auth-title">
              {mode === "login" ? t("loginTitle") : t("registerTitle")}
            </h3>
            <p>
              {mode === "login"
                ? t("loginHelp")
                : t("registerHelp")}
            </p>
          </div>

          <div className="switch">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              {t("loginTitle")}
            </button>
            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              {t("signup")}
            </button>
          </div>

          {mode === "login" ? (
            <>
              <form onSubmit={handleLogin} className="auth-form">
                <input
                  name="email"
                  type="email"
                  placeholder={t("email")}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <PasswordField
                  name="password"
                  placeholder={t("password")}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="forgot"
                  onClick={() => navigate("/forgot-password")}
                >
                  {t("forgotPassword")}
                </span>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? t("signingIn") : t("signIn")}
                </button>
              </form>

              <div className="or-separator">{t("or")}</div>

              <div className="social">
                <button type="button" className="social-btn" onClick={() => handleSocialLogin("google")}>
                  <AppIcon name="google" className="social-icon" title="Google" />
                  {t("continueGoogle")}
                </button>
                <button type="button" className="social-btn" onClick={() => handleSocialLogin("apple")}>
                  <AppIcon name="apple" className="social-icon" title="Apple" />
                  {t("continueApple")}
                </button>
                <button type="button" className="social-btn" onClick={() => handleSocialLogin("microsoft")}>
                  <AppIcon name="microsoft" className="social-icon" title="Microsoft" />
                  {t("continueMicrosoft")}
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <input
                name="name"
                placeholder={t("fullName")}
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder={t("email")}
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder={t("phoneOptional")}
                value={form.phone}
                onChange={handleChange}
              />
              <PasswordField
                name="password"
                placeholder={t("passwordRuleShort")}
                value={form.password}
                onChange={handleChange}
                required
              />
              <PasswordField
                name="confirm"
                placeholder={t("confirmPassword")}
                value={form.confirm}
                onChange={handleChange}
                required
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? t("creatingAccount") : t("createAccount")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
