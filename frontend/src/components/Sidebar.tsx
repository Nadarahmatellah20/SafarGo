import { NavLink, useNavigate } from "react-router-dom";
import PreferenceControls from "./PreferenceControls";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import AppIcon from "./AppIcon";

const clientLinks = [
  { to: "/home", labelKey: "home", icon: "home" },
  { to: "/voyages", labelKey: "offers", icon: "offers" },
  { to: "/reservation", labelKey: "reservations", icon: "reservations" },
  { to: "/paiement", labelKey: "payment", icon: "payment" },
  { to: "/documents", labelKey: "tickets", icon: "tickets" },
] as const;

const adminLinks = [
  { to: "/admin", labelKey: "dashboard", icon: "dashboard" },
] as const;

function Sidebar({ setIsAuth }: { setIsAuth?: () => void | Promise<void> }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = usePreferences();
  const links = user?.is_admin ? adminLinks : clientLinks;

  const handleLogout = async () => {
    if (setIsAuth) {
      await setIsAuth();
    } else {
      await logout();
    }
    navigate("/", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="SafarGo" className="logo-img" />
      </div>

      {user && (
        <button className="sidebar-user" onClick={() => navigate("/profile")}>
          <span>{user.name?.charAt(0).toUpperCase()}</span>
          <div>
            <b>{user.name}</b>
            <small>{user.is_admin ? "Administrateur" : "Client"}</small>
          </div>
        </button>
      )}

      <nav className="sidebar-nav">
        <p className="sidebar-title">{user?.is_admin ? t("adminSpace") : t("clientSpace")}</p>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}
          >
            <AppIcon className="menu-icon" name={link.icon} />
            <span>{t(link.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <PreferenceControls />
        <button className="logout-btn" onClick={handleLogout}>
          <AppIcon name="logout" className="logout-icon" />
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
