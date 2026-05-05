import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Auth() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
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
      await login(form.email, form.password);
      navigate("/home");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    if (form.password.length < 6) {
      alert("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
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
        alert(err?.response?.data?.message || "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className={`auth-box ${mode}`}>
        <div className="auth-left">
          <div className="auth-quote">
            TRAVEL IS THE ONLY THING <br />
            YOU BUY THAT MAKES YOU RICHER
          </div>
        </div>

        <div className="auth-right">
          <h3 className="auth-title">
            {mode === "login" ? "LOGIN" : "CRÉER UN COMPTE"}
          </h3>

          <div className="switch">
            <span
              className={mode === "login" ? "active" : ""}
              onClick={() => setMode("login")}
            >
              Connexion
            </span>
            <span
              className={mode === "register" ? "active" : ""}
              onClick={() => setMode("register")}
            >
              Inscription
            </span>
          </div>

          {mode === "login" ? (
            <>
              <form onSubmit={handleLogin} className="auth-form">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="forgot"
                  onClick={() => navigate("/forgot-password")}
                >
                  Mot de passe oublié ?
                </span>
                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? "CONNEXION..." : "SE CONNECTER"}
                </button>
              </form>

              <div className="or-separator">OU</div>

              <div className="social">
                <button type="button" className="social-btn">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                    alt="Google"
                  />
                  Continuer avec Google
                </button>
                <button type="button" className="social-btn">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/0/747.png"
                    alt="Apple"
                  />
                  Continuer avec Apple
                </button>
                <button type="button" className="social-btn">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/732/732221.png"
                    alt="Microsoft"
                  />
                  Continuer avec Microsoft
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleRegister} className="auth-form">
              <input
                name="name"
                placeholder="Nom complet"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Téléphone (optionnel)"
                value={form.phone}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe (min. 6 caractères)"
                value={form.password}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirm"
                placeholder="Confirmer le mot de passe"
                value={form.confirm}
                onChange={handleChange}
                required
              />
              <button type="submit" className="primary-btn" disabled={loading}>
                {loading ? "CRÉATION..." : "CRÉER MON COMPTE"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
