import { usePreferences } from "../context/PreferencesContext";

interface User {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  photo?: string;
  is_admin?: boolean;
}

interface ProfileCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onPhotoChange: (photo: string) => void;
  canDelete?: boolean;
}

export default function ProfileCard({ user, onEdit, onDelete, onPhotoChange, canDelete = true }: ProfileCardProps) {
  const { t } = usePreferences();
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onPhotoChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card profile-card">
      <div className="profile-top">
        <div className="avatar">
          {user.photo ? (
            <img src={user.photo} alt="Avatar" />
          ) : (
            <span>{(user.name || "?")[0].toUpperCase()}</span>
          )}
        </div>

        <div className="profile-meta">
          <h3>{user.name}</h3>
          <p className="muted">{user.is_admin ? t("adminRole") : user.country || t("clientRole")}</p>
          <label className="change-photo-btn">
            {t("changePhoto")}
            <input type="file" accept="image/*" hidden onChange={handlePhoto} />
          </label>
        </div>
      </div>

      <div className="profile-info">
        <p><b>{t("role")} :</b> {user.is_admin ? t("adminRole") : t("clientRole")}</p>
        <p><b>{t("email")} :</b> {user.email}</p>
        <p><b>{t("phone")} :</b> {user.phone || "—"}</p>
      </div>

      <div className="profile-actions">
        <button className="btn primary" onClick={onEdit}>
          {t("editProfile")}
        </button>
        {canDelete && (
          <button className="btn danger" onClick={onDelete}>
            {t("deleteAccount")}
          </button>
        )}
      </div>
    </div>
  );
}
