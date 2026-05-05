import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      className="theme-btn"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      type="button"
    >
      {theme === "dark" ? "☀️ Mode clair" : "🌙 Mode sombre"}
    </button>
  );
}
