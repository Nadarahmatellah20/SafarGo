import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import EditProfile from "../components/EditProfile";
import PaymentMethods from "../components/PaymentMethods";
import AppFooter from "../components/AppFooter";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import { authApi } from "../api/auth";
import { adminApi } from "../api/admin";
import { reservationsApi } from "../api/reservations";

function Profile() {
  const { user, logout, setUser } = useAuth();
  const { t } = usePreferences();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [stats, setStats] = useState({ voyages: 0, reservations: 0, paiements: 0 });

  useEffect(() => {
    if (!user) return;

    if (user.is_admin) {
      Promise.all([
        adminApi.getVoyages(),
        adminApi.getReservations(),
        adminApi.getUsers(),
      ]).then(([voyagesRes, reservationsRes, usersRes]) => {
        setStats({
          voyages: voyagesRes.data.length,
          reservations: reservationsRes.data.length,
          paiements: usersRes.data.filter((u: any) => !u.is_admin).length,
        });
      }).catch(() => {
        setStats({ voyages: 0, reservations: 0, paiements: 0 });
      });
      return;
    }

    reservationsApi.getAll().then((r) => {
      const confirmed = r.data.filter((res) => res.status === "confirmee").length;
      setStats({
        voyages: confirmed,
        reservations: r.data.length,
        paiements: confirmed,
      });
    });
  }, [user]);

  if (!user) return null;

  const saveProfile = async (updatedUser: any) => {
    try {
      const updated = await authApi.updateUser({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || undefined,
        photo: updatedUser.photo || undefined,
      });

      if (updatedUser.oldPassword && updatedUser.newPassword) {
        await authApi.changePassword(updatedUser.oldPassword, updatedUser.newPassword);
      }

      setUser(updated);
      setEdit(false);
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        alert(first[0]);
      } else {
        alert(err?.response?.data?.message || t("updateError"));
      }
    }
  };

  const changePhoto = async (photo: string) => {
    try {
      const updated = await authApi.updateUser({ photo });
      setUser(updated);
    } catch (err: any) {
      alert(err?.response?.data?.message || t("addPhotoError"));
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm(t("deleteAccountConfirm"))) return;
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard profile-page">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <section className="profile-hero">
          <div className="profile-hero-main">
            <div className="profile-hero-avatar">
              {user.photo ? (
                <img src={user.photo} alt={user.name} />
              ) : (
                <span>{user.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <span className="profile-role-pill">
                {user.is_admin ? t("adminRole") : t("clientRole")}
              </span>
              <h2>{user.is_admin ? t("profileAdmin") : t("profileMine")}</h2>
              <p>{user.name} · {user.email}</p>
            </div>
          </div>
          <button className="profile-hero-action" onClick={() => setEdit(true)}>
            {t("edit")}
          </button>
        </section>

        <div className="stats-grid profile-stats-grid">
          <div className="stat-box profile-stat-box">
            <b>{stats.voyages}</b>
            <small>{user.is_admin ? t("managedOffers") : t("offers")}</small>
          </div>
          <div className="stat-box profile-stat-box">
            <b>{stats.reservations}</b>
            <small>{user.is_admin ? t("clientReservations") : t("reservations")}</small>
          </div>
          <div className="stat-box profile-stat-box">
            <b>{stats.paiements}</b>
            <small>{user.is_admin ? t("clients") : t("payments")}</small>
          </div>
        </div>

        <section className={user.is_admin ? "profile-shell profile-admin-grid" : "profile-shell"}>
          <div className="profile-main-panel">
            <ProfileCard
              user={user}
              onEdit={() => setEdit(true)}
              onDelete={deleteAccount}
              onPhotoChange={changePhoto}
              canDelete={!user.is_admin}
            />
          </div>
          <div className="profile-side-panel">
            {user.is_admin ? (
              <div className="card admin-profile-card profile-feature-card">
                <span className="admin-profile-kicker">Console</span>
                <h3>{t("adminArea")}</h3>
                <p>
                  {t("adminAreaText")}
                </p>
                <button className="btn primary" onClick={() => navigate("/admin")}>
                  {t("openDashboard")}
                </button>
              </div>
            ) : (
              <PaymentMethods />
            )}
          </div>
        </section>
        <AppFooter compact />
      </main>

      {edit && (
        <EditProfile
          user={{ ...user, password: "" }}
          onSave={(updated: any, _: string) => saveProfile(updated)}
          onClose={() => setEdit(false)}
        />
      )}
    </div>
  );
}

export default Profile;
