import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import PreferenceControls from "../components/PreferenceControls";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";

const highlights = [
  { label: "+25", text: "landingStatOffers" },
  { label: "24/7", text: "landingStatSupport" },
  { label: "100%", text: "landingStatSecure" },
];

const destinations = [
  {
    name: "Marrakech",
    image: "https://images.unsplash.com/photo-1767397404266-ea5c2b1d361a?w=700&q=80",
  },
  {
    name: "Omra",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=700&q=80",
  },
  {
    name: "Transport",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=700&q=80",
  },
];

const footerLinks = [
  { label: "offers", path: "/login" },
  { label: "reservations", path: "/login" },
  { label: "payment", path: "/login" },
  { label: "tickets", path: "/login" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();
  const { formatMoney, t } = usePreferences();

  const nextPath = isAuth ? (user?.is_admin ? "/admin" : "/home") : "/login";

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button className="landing-brand" onClick={() => navigate("/")}>
          <img src={logo} alt="SafarGo" />
        </button>
        <nav className="landing-nav-links" aria-label="Navigation principale">
          <a href="#offers">{t("offers")}</a>
          <a href="#services">{t("services")}</a>
          <a href="#contact">{t("contact")}</a>
        </nav>
        <div className="landing-actions">
          <PreferenceControls />
          <button className="landing-login-btn" onClick={() => navigate(nextPath)}>
            {isAuth ? t("mySpace") : t("login")}
          </button>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <video
            className="landing-video"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
          >
            <source
              src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="landing-hero-content">
            <span>{t("landingBadge")}</span>
            <h1>{t("landingTitle")}</h1>
            <p>
              {t("landingSubtitle")}
            </p>
            <div className="landing-cta-row">
              <button onClick={() => navigate("/login")}>{t("login")}</button>
              <button className="ghost" onClick={() => navigate("/login")}>{t("signup")}</button>
            </div>
          </div>
        </section>

        <section id="services" className="landing-band" aria-label="SafarGo en chiffres">
          <div className="landing-stats">
            {highlights.map((item) => (
              <div key={item.text}>
                <b>{item.label}</b>
                <span>{t(item.text)}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="offers" className="landing-section">
          <div className="section-header landing-section-header">
            <div>
              <span className="landing-small-title">{t("landingSelection")}</span>
              <h3>{t("popularOffers")}</h3>
            </div>
            <button className="link-btn" onClick={() => navigate("/login")}>
              {t("bookNow")} →
            </button>
          </div>
          <div className="landing-destinations">
            {destinations.map((destination, index) => (
              <article key={destination.name} className="landing-card">
                <img src={destination.image} alt={destination.name} />
                <div>
                  <span>{destination.name}</span>
                  <b>{t("from")} {formatMoney([850, 1850, 18][index])}</b>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer id="contact" className="site-footer">
        <div className="site-footer-main">
          <div>
            <img src={logo} alt="SafarGo" />
            <p>{t("footerText")}</p>
          </div>
          <div className="site-footer-links">
            <h4>{t("quickAccess")}</h4>
            {footerLinks.map((link) => (
              <button key={link.label} onClick={() => navigate(link.path)}>
                {t(link.label)}
              </button>
            ))}
          </div>
          <div className="site-footer-contact">
            <h4>{t("contact")}</h4>
            <span>support@safargo.ma</span>
            <span>+212 600 000 000</span>
            <span>Casablanca, Maroc</span>
          </div>
        </div>
        <div className="site-footer-bottom">
          <span>© 2026 SafarGo</span>
          <span>{t("securePayment")}</span>
        </div>
      </footer>
    </div>
  );
}
