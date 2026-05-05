interface User {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  photo?: string;
}

interface ProfileCardProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
  onPhotoChange: (photo: string) => void;
}

export default function ProfileCard({ user, onEdit, onDelete, onPhotoChange }: ProfileCardProps) {
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
          <p className="muted">{user.country}</p>
          <label className="change-photo-btn">
            Changer la photo
            <input type="file" accept="image/*" hidden onChange={handlePhoto} />
          </label>
        </div>
      </div>

      <div className="profile-info">
        <p><b>Email :</b> {user.email}</p>
        <p><b>Téléphone :</b> {user.phone || "—"}</p>
      </div>

      <div className="profile-actions">
        <button className="btn primary" onClick={onEdit}>
          Modifier le profil
        </button>
        <button className="btn danger" onClick={onDelete}>
          Supprimer le compte
        </button>
      </div>
    </div>
  );
}
