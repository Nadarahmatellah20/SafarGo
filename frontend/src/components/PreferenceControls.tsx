import { usePreferences } from "../context/PreferencesContext";

export default function PreferenceControls() {
  const { language, currency, setLanguage, setCurrency, t } = usePreferences();

  return (
    <div className="preference-controls">
      <label>
        <span>{t("language")}</span>
        <select value={language} onChange={(e) => setLanguage(e.target.value as "fr" | "ar" | "en")}>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
          <option value="en">English</option>
        </select>
      </label>
      <label>
        <span>{t("currency")}</span>
        <select value={currency} onChange={(e) => setCurrency(e.target.value as "EUR" | "MAD")}>
          <option value="EUR">Euro</option>
          <option value="MAD">Dirham</option>
        </select>
      </label>
    </div>
  );
}
