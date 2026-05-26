import type { ReactNode } from "react";

type AppIconName =
  | "home"
  | "offers"
  | "reservations"
  | "payment"
  | "tickets"
  | "profile"
  | "dashboard"
  | "logout"
  | "users"
  | "edit"
  | "trash"
  | "cancel"
  | "google"
  | "apple"
  | "microsoft"
  | "visa"
  | "mastercard"
  | "amex"
  | "paypal";

type AppIconProps = {
  name: AppIconName;
  className?: string;
  title?: string;
};

const paths: Record<Exclude<AppIconName, "google" | "apple" | "microsoft" | "visa" | "mastercard" | "amex" | "paypal">, ReactNode> = {
  home: (
    <>
      <path d="M3 10.8 12 3l9 7.8" />
      <path d="M5.2 9.2V21h5.1v-6.2h3.4V21h5.1V9.2" />
    </>
  ),
  offers: (
    <>
      <path d="M4 19.5 19.5 4" />
      <path d="M7 4h12v12" />
      <path d="M6.5 13.5 10.5 17.5" />
      <path d="M3.5 20.5 6.5 13.5 13.5 20.5Z" />
    </>
  ),
  reservations: (
    <>
      <path d="M7 3v4" />
      <path d="M17 3v4" />
      <path d="M4 8h16" />
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="m8 14 2.2 2.2L16 11" />
    </>
  ),
  payment: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
      <path d="M3.5 10h17" />
      <path d="M7 15h4" />
      <path d="M15 15h2" />
    </>
  ),
  tickets: (
    <>
      <path d="M4 8a2 2 0 0 0 0 4 2 2 0 0 1 0 4v2h16v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H4Z" />
      <path d="M9 8v8" />
      <path d="M13 10h4" />
      <path d="M13 14h3" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  dashboard: (
    <>
      <rect x="4" y="4" width="6" height="7" rx="2" />
      <rect x="14" y="4" width="6" height="4" rx="2" />
      <rect x="14" y="12" width="6" height="8" rx="2" />
      <rect x="4" y="15" width="6" height="5" rx="2" />
    </>
  ),
  logout: (
    <>
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
      <path d="M15 8l4 4-4 4" />
      <path d="M9 12h10" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6" />
      <path d="M17.5 14.5A5 5 0 0 1 21 20" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4.5L19 9.5 14.5 5 4 15.5Z" />
      <path d="m13.5 6 4.5 4.5" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  cancel: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 8l8 8" />
      <path d="M16 8l-8 8" />
    </>
  ),
};

function BrandIcon({ name, title }: { name: AppIconName; title?: string }) {
  const label = name === "mastercard" ? "MC" : name === "amex" ? "AMEX" : name.toUpperCase();
  const fill =
    name === "google" ? "#fff" :
    name === "apple" ? "#111827" :
    name === "microsoft" ? "#fff" :
    name === "paypal" ? "#0070ba" :
    name === "mastercard" ? "#eb001b" :
    name === "amex" ? "#2e77bb" :
    "#1a1f71";

  if (name === "google") {
    return (
      <>
        {title && <title>{title}</title>}
        <circle cx="12" cy="12" r="9" fill="#fff" />
        <path fill="#4285f4" d="M20.3 12.2c0-.7-.1-1.2-.2-1.8H12v3.4h4.7a4 4 0 0 1-1.7 2.6v2.1h2.8a8.4 8.4 0 0 0 2.5-6.3Z" />
        <path fill="#34a853" d="M12 20.5c2.3 0 4.3-.8 5.7-2.1l-2.8-2.1c-.8.5-1.8.8-2.9.8a5.1 5.1 0 0 1-4.8-3.5H4.4v2.2a8.6 8.6 0 0 0 7.6 4.7Z" />
        <path fill="#fbbc05" d="M7.2 13.6a5.4 5.4 0 0 1 0-3.2V8.2H4.4a8.6 8.6 0 0 0 0 7.6Z" />
        <path fill="#ea4335" d="M12 6.9c1.3 0 2.4.4 3.3 1.3l2.5-2.5A8.5 8.5 0 0 0 4.4 8.2l2.8 2.2A5.1 5.1 0 0 1 12 6.9Z" />
      </>
    );
  }

  if (name === "microsoft") {
    return (
      <>
        {title && <title>{title}</title>}
        <path fill="#f25022" d="M4 4h7.4v7.4H4Z" />
        <path fill="#7fba00" d="M12.6 4H20v7.4h-7.4Z" />
        <path fill="#00a4ef" d="M4 12.6h7.4V20H4Z" />
        <path fill="#ffb900" d="M12.6 12.6H20V20h-7.4Z" />
      </>
    );
  }

  return (
    <>
      {title && <title>{title}</title>}
      <rect x="3" y="5" width="18" height="14" rx="4" fill={fill} />
      <text x="12" y="14.4" textAnchor="middle" fontSize={name === "amex" ? 5 : 6} fontWeight="800" fill="#fff">
        {label}
      </text>
    </>
  );
}

export default function AppIcon({ name, className, title }: AppIconProps) {
  const isBrand = !Object.prototype.hasOwnProperty.call(paths, name);

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
    >
      {isBrand ? (
        <BrandIcon name={name} title={title} />
      ) : (
        <>
          {title && <title>{title}</title>}
          <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {paths[name as keyof typeof paths]}
          </g>
        </>
      )}
    </svg>
  );
}
