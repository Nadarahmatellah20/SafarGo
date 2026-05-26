import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { usePreferences } from "../context/PreferencesContext";
import AppIcon from "./AppIcon";

const links = [
  { label: "offers", path: "/voyages", icon: "offers" },
  { label: "reservations", path: "/reservation", icon: "reservations" },
  { label: "payment", path: "/paiement", icon: "payment" },
  { label: "tickets", path: "/documents", icon: "tickets" },
] as const;

export default function AppFooter({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const { t } = usePreferences();

  return (
    <footer className={`app-footer${compact ? " app-footer-compact" : ""}`}>
      <div className="app-footer-main">
        <div className="app-footer-brand">
          <img src={logo} alt="SafarGo" />
          <p>{t("footerText")}</p>
        </div>

        <nav className="app-footer-links" aria-label="Footer">
          {links.map((link) => (
            <button key={link.path} type="button" onClick={() => navigate(link.path)}>
              <AppIcon name={link.icon} className="footer-icon" />
              <span>{t(link.label)}</span>
            </button>
          ))}
        </nav>

        <div className="app-footer-contact">
          <span>support@safargo.ma</span>
          <span>+212 600 000 000</span>
          <span>Casablanca, Maroc</span>
        </div>
      </div>
      <div className="app-footer-bottom">
        <span>© 2026 SafarGo</span>
        <span>{t("securePayment")}</span>
      </div>
    </footer>
  );
}
