import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, logout, user } = useAuth();
  const { t } = usePreferences();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminLogin(email.trim().toLowerCase(), password);
      navigate("/admin", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || t("adminLoginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content admin-login-content">
        <form className="admin-login-card" onSubmit={submit}>
          <span className="admin-login-kicker">{t("adminAccess")}</span>
          <h2>{t("adminLogin")}</h2>
          <p>
            {t("loggedAsClient")}: <b>{user?.name}</b>. {t("adminLoginHelp")}
          </p>

          {error && <div className="admin-form-error">{error}</div>}

          <label>{t("adminEmail")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@safargo.com"
          />

          <label>{t("adminPassword")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t("password")}
          />

          <button type="submit" disabled={loading}>
            {loading ? t("checking") : t("enterAsAdmin")}
          </button>
        </form>
      </main>
    </div>
  );
}
