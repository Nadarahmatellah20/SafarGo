import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import EditProfile from "../components/EditProfile";
import PaymentMethods from "../components/PaymentMethods";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../api/auth";
import { reservationsApi } from "../api/reservations";

function Profile() {
  const { user, logout, setUser } = useAuth();
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);
  const [stats, setStats] = useState({ voyages: 0, reservations: 0, paiements: 0 });

  useEffect(() => {
    reservationsApi.getAll().then((r) => {
      const confirmed = r.data.filter((res) => res.status === "confirmee").length;
      setStats({
        voyages: confirmed,
        reservations: r.data.length,
        paiements: confirmed,
      });
    });
  }, []);

  if (!user) return null;

  const saveProfile = async (updatedUser: any) => {
    try {
      const updated = await authApi.updateUser({
        name: updatedUser.name,
        phone: updatedUser.phone || undefined,
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
        alert(err?.response?.data?.message || "Erreur lors de la mise à jour");
      }
    }
  };

  const changePhoto = async (_photo: string) => {
    alert("La modification de photo n'est pas encore disponible.");
  };

  const deleteAccount = async () => {
    if (!window.confirm("Supprimer votre compte définitivement ?")) return;
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>SafarGo — Mon Profil</h2>
            <p>Gérez vos informations personnelles</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-box">
            <b>{stats.voyages}</b>
            <small>Voyages</small>
          </div>
          <div className="stat-box">
            <b>{stats.reservations}</b>
            <small>Réservations</small>
          </div>
          <div className="stat-box">
            <b>{stats.paiements}</b>
            <small>Paiements</small>
          </div>
        </div>

        <div className="grid">
          <ProfileCard
            user={user}
            onEdit={() => setEdit(true)}
            onDelete={deleteAccount}
            onPhotoChange={changePhoto}
          />
          <PaymentMethods />
        </div>
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
