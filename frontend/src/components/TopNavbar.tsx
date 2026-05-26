import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import PreferenceControls from "./PreferenceControls";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import AppIcon from "./AppIcon";

const links = [
  { to: "/home", labelKey: "home", icon: "home" },
  { to: "/voyages", labelKey: "offers", icon: "offers" },
  { to: "/reservation", labelKey: "reservations", icon: "reservations" },
  { to: "/paiement", labelKey: "payment", icon: "payment" },
  { to: "/documents", labelKey: "tickets", icon: "tickets" },
] as const;

export default function TopNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = usePreferences();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="top-navbar">
      <NavLink to="/home" className="top-brand">
        <img src={logo} alt="SafarGo" />
      </NavLink>

      <nav className="top-nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => "top-nav-link" + (isActive ? " active" : "")}
          >
            <AppIcon name={link.icon} className="top-link-icon" />
            {t(link.labelKey)}
          </NavLink>
        ))}
      </nav>

      <div className="top-nav-actions">
        <PreferenceControls />
        <button className="top-user-btn" onClick={() => navigate("/profile")}>
          <span>{user?.name?.charAt(0).toUpperCase() || "S"}</span>
          <b>{user?.name?.split(" ")[0] || t("profile")}</b>
        </button>
        <button className="top-logout-btn" onClick={handleLogout}>
          <AppIcon name="logout" className="top-logout-icon" />
          {t("logout")}
        </button>
      </div>
    </header>
  );
}
