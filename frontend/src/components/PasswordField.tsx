import { useState } from "react";

type PasswordFieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input {...props} type={visible ? "text" : "password"} />
      <button
        type="button"
        className="password-eye"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        title={visible ? "Masquer" : "Afficher"}
      >
        <span className={visible ? "eye-icon visible" : "eye-icon"} />
      </button>
    </div>
  );
}
