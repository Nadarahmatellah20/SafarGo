import { usePreferences } from "../context/PreferencesContext";

export default function PromoTicker() {
  const { formatMoney, t } = usePreferences();
  const PROMOS = [
    t("promoOmra"),
    t("promoEvents"),
    `${t("promoShuttle")} ${formatMoney(18)}`,
    t("promoHajj"),
    t("promoTransport"),
  ];
  const items = [...PROMOS, ...PROMOS];

  return (
    <div className="promo-ticker" aria-label="Promotions SafarGo">
      <div className="promo-track">
        {items.map((promo, index) => (
          <span className="promo-item" key={`${promo}-${index}`}>
            <b>{t("promo")}</b>
            {promo}
          </span>
        ))}
      </div>
    </div>
  );
}
