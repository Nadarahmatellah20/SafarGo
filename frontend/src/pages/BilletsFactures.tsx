import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AppFooter from "../components/AppFooter";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import {
  paiementsApi,
  reservationsApi,
  type Payment,
  type Reservation,
} from "../api/reservations";

type Tab = "billets" | "factures";

function barcodeBits(code: string) {
  return code
    .split("")
    .flatMap((char) => {
      const value = char.charCodeAt(0);
      return [value % 2, value % 3, value % 5, value % 7, value % 11].map((n) => n > 0);
    });
}

function barcodeHtml(code: string) {
  return barcodeBits(code)
    .map((wide, index) => `<i style="width:${wide ? 3 : 1}px;height:${34 + (index % 3) * 8}px"></i>`)
    .join("");
}

function Barcode({ code }: { code: string }) {
  return (
    <div className="ticket-barcode" aria-label={`Code barre ${code}`}>
      <div>{barcodeBits(code).map((wide, index) => <i key={`${code}-${index}`} className={wide ? "wide" : ""} />)}</div>
      <small>{code}</small>
    </div>
  );
}

function openDocument(title: string, body: string) {
  const win = window.open("", "_blank", "width=760,height=900");
  if (!win) return;
  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #102a43; padding: 32px; background: #f3f7fb; }
          .doc { background: white; border: 1px solid #d8e2ef; border-radius: 18px; padding: 28px; box-shadow: 0 18px 45px rgba(16,42,67,.12); }
          h1 { margin: 0 0 8px; color: #1e3f6f; letter-spacing: .5px; }
          .muted { color: #627d98; margin-bottom: 22px; font-weight: 700; }
          .row { display: flex; justify-content: space-between; border-top: 1px solid #edf2f7; padding: 12px 0; gap: 18px; }
          .total { font-size: 22px; font-weight: 800; color: #0f766e; }
          .stamp { display: inline-block; border: 2px solid #0f766e; color: #0f766e; padding: 8px 14px; border-radius: 8px; font-weight: 900; transform: rotate(-4deg); }
          .barcode { margin: 18px 0; padding: 14px; border: 1px solid #d8e2ef; border-radius: 12px; background: #fff; width: fit-content; }
          .barcode div { height: 58px; display: flex; align-items: flex-end; gap: 2px; }
          .barcode i { display: block; background: #102a43; }
          .barcode small { display: block; margin-top: 8px; letter-spacing: 2px; font-size: 11px; font-weight: 800; color: #102a43; }
        </style>
      </head>
      <body><div class="doc">${body}</div><script>window.print()</script></body>
    </html>
  `);
  win.document.close();
}

function saveTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function saveHtmlFile(filename: string, title: string, body: string) {
  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body { margin: 0; font-family: Arial, sans-serif; color: #102a43; background: #f3f7fb; padding: 28px; }
      .ticket { max-width: 860px; margin: 0 auto; display: grid; grid-template-columns: 1fr 210px; background: #fff; border: 1px solid #d8e2ef; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 45px rgba(16,42,67,.14); }
      .main { padding: 30px; }
      .stub { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 24px; background: #0b2c4d; color: #fff; border-left: 2px dashed rgba(255,255,255,.35); text-align: center; }
      .brand { color: #0f766e; font-size: 13px; font-weight: 900; text-transform: uppercase; }
      h1 { margin: 8px 0 6px; font-size: 34px; color: #1e3f6f; }
      p { margin: 0; color: #627d98; font-weight: 700; }
      .fields { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 26px; }
      .fields div { border-top: 1px solid #edf2f7; padding-top: 12px; }
      small { display: block; color: #829ab1; font-weight: 800; text-transform: uppercase; font-size: 11px; }
      b { display: block; margin-top: 4px; color: #102a43; font-size: 16px; }
      .barcode { margin-top: 26px; padding: 14px; border: 1px solid #d8e2ef; border-radius: 12px; width: fit-content; }
      .barcode div { height: 58px; display: flex; align-items: flex-end; gap: 2px; }
      .barcode i { display: block; background: #102a43; }
      .barcode small { margin-top: 8px; letter-spacing: 2px; color: #102a43; }
      .qr { width: 104px; height: 104px; display: grid; place-items: center; border: 2px solid rgba(255,255,255,.7); border-radius: 18px; font-size: 28px; font-weight: 900; }
      .status { border: 2px solid #f59e0b; border-radius: 999px; padding: 8px 14px; color: #fbbf24; font-weight: 900; }
      @media print { body { background: #fff; } .ticket { box-shadow: none; } }
      @media (max-width: 720px) { .ticket { grid-template-columns: 1fr; } .stub { border-left: 0; border-top: 2px dashed rgba(255,255,255,.35); } .fields { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>${body}</body>
</html>`;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BilletsFactures() {
  const { logout } = useAuth();
  const { formatMoney, formatDate, t } = usePreferences();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("billets");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reservationsApi.getAll(), paiementsApi.getHistory()])
      .then(([res, pay]) => {
        setReservations(res.data ?? []);
        setPayments(pay.data ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const billets = useMemo(
    () => reservations.filter((r) => r.status === "confirmee"),
    [reservations]
  );

  const paidInvoices = useMemo(
    () => payments.filter((p) => p.status === "reussi"),
    [payments]
  );

  const printTicket = (r: Reservation) => {
    openDocument(
      r.ticket_number,
      `
        <h1>${t("ticket")} SafarGo</h1>
        <p class="muted">${r.ticket_number}</p>
        <p><span class="stamp">${t("confirmed")}</span></p>
        <div class="barcode"><div>${barcodeHtml(r.ticket_number)}</div><small>${r.ticket_number}</small></div>
        <div class="row"><b>${t("offers")}</b><span>${r.voyage.destination}, ${r.voyage.country}</span></div>
        <div class="row"><b>${t("departure")}</b><span>${formatDate(r.departure_date)}</span></div>
        <div class="row"><b>${t("passengers")}</b><span>${r.passengers}</span></div>
        <div class="row"><b>Type</b><span>${r.voyage.offer_label}</span></div>
        <div class="row"><b>${t("totalPaid")}</b><span class="total">${formatMoney(r.total_price)}</span></div>
      `
    );
  };

  const downloadTicket = (r: Reservation) => {
    saveHtmlFile(
      `${r.ticket_number}.html`,
      `${t("ticket")} ${r.ticket_number}`,
      `
        <article class="ticket">
          <section class="main">
            <span class="brand">SafarGo</span>
            <h1>${r.voyage.destination}</h1>
            <p>${r.voyage.country} · ${formatDate(r.departure_date)}</p>
            <div class="fields">
              <div><small>${t("ticket")}</small><b>${r.ticket_number}</b></div>
              <div><small>${t("passengers")}</small><b>${r.passengers}</b></div>
              <div><small>${t("transport")}</small><b>${r.voyage.transport || t("program")}</b></div>
              <div><small>${t("total")}</small><b>${formatMoney(r.total_price)}</b></div>
            </div>
            <div class="barcode"><div>${barcodeHtml(r.ticket_number)}</div><small>${r.ticket_number}</small></div>
          </section>
          <aside class="stub">
            <div class="qr">${r.ticket_number.slice(-4)}</div>
            <span class="status">${t("confirmed")}</span>
            <strong>${r.voyage.offer_label}</strong>
          </aside>
        </article>
      `
    );
  };

  const printInvoice = (p: Payment) => {
    openDocument(
      p.invoice_number,
      `
        <h1>${t("invoice")} SafarGo</h1>
        <p class="muted">${p.invoice_number}</p>
        <p><span class="stamp">${t("paid")}</span></p>
        <div class="row"><b>${t("description")}</b><span>${p.description}</span></div>
        <div class="row"><b>${t("date")}</b><span>${formatDate(p.paid_at || p.created_at)}</span></div>
        <div class="row"><b>${t("method")}</b><span>${p.method_label}</span></div>
        <div class="row"><b>${t("status")}</b><span>${p.status}</span></div>
        <div class="row"><b>${t("amount")}</b><span class="total">${formatMoney(p.amount)}</span></div>
      `
    );
  };

  return (
    <div className="dashboard">
      <Sidebar setIsAuth={() => logout().then(() => navigate("/"))} />
      <main className="content">
        <div className="page-header">
          <div>
            <h2>{t("docsTitle")}</h2>
            <p>{t("docsSubtitle")}</p>
          </div>
        </div>

        <div className="doc-summary">
          <div>
            <b>{billets.length}</b>
            <span>{t("ticketsTab")}</span>
          </div>
          <div>
            <b>{paidInvoices.length}</b>
            <span>{t("generatedInvoices")}</span>
          </div>
          <div>
            <b>{formatMoney(paidInvoices.reduce((sum, p) => sum + p.amount, 0))}</b>
            <span>{t("totalInvoiced")}</span>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab${tab === "billets" ? " active" : ""}`} onClick={() => setTab("billets")}>
            {t("ticketsTab")}
          </button>
          <button className={`admin-tab${tab === "factures" ? " active" : ""}`} onClick={() => setTab("factures")}>
            {t("invoicesTab")}
          </button>
        </div>

        {loading ? (
          <div className="loading-state">{t("loadingDocuments")}</div>
        ) : tab === "billets" ? (
          <div className="documents-grid">
            {billets.length === 0 ? (
              <div className="empty-state">{t("noTicket")}</div>
            ) : billets.map((r) => (
              <article className="real-ticket" key={r.id}>
                <div className="ticket-main">
                  <div className="ticket-route">
                    <span>SafarGo</span>
                    <b>{r.voyage.offer_label}</b>
                  </div>
                  <h3>{r.voyage.destination}</h3>
                  <p>{r.voyage.country} · {formatDate(r.departure_date)}</p>
                  <div className="ticket-fields">
                    <div><small>{t("ticket")}</small><b>{r.ticket_number}</b></div>
                    <div><small>{t("passengers")}</small><b>{r.passengers}</b></div>
                    <div><small>{t("transport")}</small><b>{r.voyage.transport || t("program")}</b></div>
                    <div><small>{t("total")}</small><b>{formatMoney(r.total_price)}</b></div>
                  </div>
                  <Barcode code={r.ticket_number} />
                  <div className="ticket-actions">
                    <button onClick={() => printTicket(r)}>{t("print")}</button>
                    <button onClick={() => downloadTicket(r)}>
                      {t("download")}
                    </button>
                  </div>
                </div>
                <div className="ticket-stub">
                  <div className="ticket-qr">{r.ticket_number.slice(-4)}</div>
                  <span>{t("confirmed")}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="documents-grid">
            {paidInvoices.length === 0 ? (
              <div className="empty-state">{t("noInvoice")}</div>
            ) : paidInvoices.map((p) => (
              <article className="real-invoice" key={p.id}>
                <div className="invoice-head">
                  <div>
                    <span>{t("invoice").toUpperCase()}</span>
                    <h3>{p.invoice_number}</h3>
                  </div>
                  <b>{t("paid")}</b>
                </div>
                <div className="invoice-lines">
                  <div><span>{t("description")}</span><b>{p.description}</b></div>
                  <div><span>{t("date")}</span><b>{formatDate(p.paid_at || p.created_at)}</b></div>
                  <div><span>{t("method")}</span><b>{p.method_label}</b></div>
                  <div className="invoice-total"><span>{t("total")}</span><b>{formatMoney(p.amount)}</b></div>
                </div>
                <div className="document-actions">
                  <button onClick={() => printInvoice(p)}>{t("print")}</button>
                  <button onClick={() => saveTextFile(`${p.invoice_number}.txt`, `Facture ${p.invoice_number}\n${p.description}\n${formatMoney(p.amount)}`)}>
                    {t("download")}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        <AppFooter compact />
      </main>
    </div>
  );
}
