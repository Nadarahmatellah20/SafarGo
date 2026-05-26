import { usePreferences } from "../context/PreferencesContext";

export default function NotFound() {
  const { t } = usePreferences();
  return (
    <div className="dashboard" style={{ alignItems: "center", justifyContent: "center" }}>
      <div className="card" style={{ maxWidth: 420, textAlign: "center" }}>
        <h1>404</h1>
        <p className="muted">{t("notFound")}</p>
      </div>
    </div>
  );
}
