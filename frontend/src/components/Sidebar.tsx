import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="SafarGo" className="logo-img" />
      </div>

      <p className="sidebar-title">MENU</p>

      <NavLink to="/home" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
        <img className="menu-icon" src="https://cdn-icons-png.flaticon.com/512/1946/1946436.png" alt="Home" />
        Accueil
      </NavLink>

      <NavLink to="/voyages" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
        <img className="menu-icon" src="https://cdn-icons-png.flaticon.com/512/854/854866.png" alt="Voyages" />
        Voyages / Offres
      </NavLink>

      <NavLink to="/reservation" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
        <img className="menu-icon" src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png" alt="Réservations" />
        Réservations
      </NavLink>

      <NavLink to="/paiement" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
        <img className="menu-icon" src="https://cdn-icons-png.flaticon.com/512/633/633611.png" alt="Paiement" />
        Paiement
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
        <img className="menu-icon" src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" alt="Profil" />
        Mon Profil
      </NavLink>

      {user?.is_admin && (
        <NavLink to="/admin" className={({ isActive }) => "sidebar-link sidebar-admin" + (isActive ? " active" : "")}>
          <img className="menu-icon" src="https://cdn-icons-png.flaticon.com/512/2099/2099058.png" alt="Admin" />
          Administration
        </NavLink>
      )}

      <div className="sidebar-bottom">
        <ThemeToggle />
        <button className="logout-btn" onClick={handleLogout}>
          <img src="https://cdn-icons-png.flaticon.com/512/1828/1828490.png" alt="Logout" />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
