import { useState } from "react";
import PasswordField from "./PasswordField";
import { usePreferences } from "../context/PreferencesContext";

interface User {
  name: string;
  email: string;
  phone?: string;
  country?: string;
  password?: string;
  photo?: string;
}

interface EditProfileProps {
  user: User;
  onSave: (updated: any, oldEmail: string) => void;
  onClose: () => void;
}

function EditProfile({ user, onSave, onClose }: EditProfileProps) {
  const { t } = usePreferences();
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    country: user.country || "",
    photo: user.photo || "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, photo: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    let payload: any = { ...user, ...form };

    if (passwords.oldPassword || passwords.newPassword || passwords.confirmPassword) {
      if (passwords.newPassword !== passwords.confirmPassword) {
        alert(t("passwordMismatch"));
        return;
      }
      payload.oldPassword = passwords.oldPassword;
      payload.newPassword = passwords.newPassword;
    }

    onSave(payload, user.email || "");
  };

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>{t("editProfile")}</h3>

        <input
          placeholder={t("fullName")}
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder={t("phone")}
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder={t("country")}
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
        />

        <label style={{ fontSize: 13, fontWeight: 700, color: "#1e3f6f" }}>
          {t("changePhoto")}
        </label>
        <input type="file" accept="image/*" onChange={handlePhoto} />

        <hr style={{ border: "none", borderTop: "1px solid #c8d8ee" }} />
        <h4>{t("changePassword")}</h4>

        <PasswordField
          placeholder={t("oldPassword")}
          value={passwords.oldPassword}
          onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
        />
        <PasswordField
          placeholder={t("newPassword")}
          value={passwords.newPassword}
          onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
        />
        <PasswordField
          placeholder={t("confirmPassword")}
          value={passwords.confirmPassword}
          onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
        />

        <div className="modal-actions">
          <button onClick={handleSave}>{t("save")}</button>
          <button className="ghost" onClick={onClose}>{t("cancel")}</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
