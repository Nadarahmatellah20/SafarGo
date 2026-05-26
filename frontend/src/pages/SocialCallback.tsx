import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SocialCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    localStorage.setItem("token", token);
    window.location.replace("/home");
  }, [navigate, params]);

  return (
    <div className="auth-wrap">
      <div className="auth-box forgot">
        <div className="auth-right">
          <div className="auth-heading">
            <span>SafarGo</span>
            <h3 className="auth-title">Connexion en cours</h3>
            <p>Veuillez patienter pendant la finalisation de votre session.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
