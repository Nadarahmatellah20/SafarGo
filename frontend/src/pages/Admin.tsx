import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import Sidebar from "../components/Sidebar";
import AppFooter from "../components/AppFooter";
import AppIcon from "../components/AppIcon";
import { adminApi, VoyageForm, AdminUser, AdminReservation, AdminPaiement } from "../api/admin";

interface Voyage {
  id: number;
  destination: string;
  pays: string;
  description: string;
  prix: number;
  duree: number;
  image: string;
  images: string[];
  note: number;
  places_disponibles: number;
  type_offre: "voyage" | "evenement" | "hajj" | "omra" | "transport";
  transport_type?: string;
  lieu_depart?: string;
  lieu_arrivee?: string;
  date_evenement?: string;
}

const emptyForm: VoyageForm = {
  destination: "",
  pays: "",
  description: "",
  prix: 0,
  duree: 1,
  image: "",
  images: [],
  note: 4.5,
  places_disponibles: 20,
  type_offre: "voyage",
  transport_type: "",
  lieu_depart: "",
  lieu_arrivee: "",
  date_evenement: "",
};

const emptyUserForm = {
  name: "",
  email: "",
  phone: "",
  is_active: true,
};

const offerLabelKeys: Record<Voyage["type_offre"], string> = {
  voyage: "catTrips",
  evenement: "catEvents",
  hajj: "catHajj",
  omra: "catOmra",
  transport: "catTransport",
};

const ADMIN_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800";

const cleanImages = (images: string[] = []) =>
  images.map((url) => url.trim()).filter(Boolean);

const imageListFor = (v: Voyage) => {
  const images = cleanImages(v.images || []);
  if (v.image && !images.includes(v.image)) images.unshift(v.image);
  return images;
};

const statutLabel: Record<string, string> = {
  "en attente": "En attente",
  "en_attente": "En attente",
  "confirmée": "Confirmée",
  "confirmee": "Confirmée",
  "annulée": "Annulée",
  "annulee": "Annulée",
};

const statutColor: Record<string, string> = {
  "en attente": "badge-pending",
  "en_attente": "badge-pending",
  "confirmée": "badge-admin",
  "confirmee": "badge-admin",
  "annulée": "badge-cancelled",
  "annulee": "badge-cancelled",
};

export default function Admin() {
  const { user } = useAuth();
  const { formatMoney, formatDate, t } = usePreferences();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"voyages" | "users" | "reservations" | "paiements">("voyages");
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [paiements, setPaiements] = useState<AdminPaiement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [userModal, setUserModal] = useState(false);
  const [selected, setSelected] = useState<Voyage | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<VoyageForm>(emptyForm);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState<number | null>(null);
  const [confirmCancelRes, setConfirmCancelRes] = useState<number | null>(null);
  const [confirmDeleteRes, setConfirmDeleteRes] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.is_admin) { navigate("/home"); return; }
    loadVoyages();
  }, [user]);

  useEffect(() => {
    if (tab === "users") loadUsers();
    else if (tab === "reservations") loadReservations();
    else if (tab === "paiements") loadPaiements();
    else loadVoyages();
  }, [tab]);

  const flash = (message: string) => { setMsg(message); setTimeout(() => setMsg(""), 3000); };

  const loadVoyages = async () => {
    setLoading(true);
    setError("");
    try { const res = await adminApi.getVoyages(); setVoyages(res.data); }
    catch { setError("Erreur de chargement des voyages"); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try { const res = await adminApi.getUsers(); setUsers(res.data); }
    catch { setError("Erreur de chargement des utilisateurs"); }
    finally { setLoading(false); }
  };

  const loadReservations = async () => {
    setLoading(true);
    setError("");
    try { const res = await adminApi.getReservations(); setReservations(res.data); }
    catch { setError("Erreur de chargement des réservations"); }
    finally { setLoading(false); }
  };

  const loadPaiements = async () => {
    setLoading(true);
    setError("");
    try { const res = await adminApi.getPaiements(); setPaiements(res.data); }
    catch { setError("Erreur de chargement des paiements"); }
    finally { setLoading(false); }
  };

  const openAdd = () => { setForm(emptyForm); setSelected(null); setModal("add"); setError(""); };
  const openEdit = (v: Voyage) => {
    setForm({
      destination: v.destination,
      pays: v.pays,
      description: v.description,
      prix: v.prix,
      duree: v.duree,
      image: v.image,
      images: v.images || [],
      note: v.note,
      places_disponibles: v.places_disponibles,
      type_offre: v.type_offre || "voyage",
      transport_type: v.transport_type || "",
      lieu_depart: v.lieu_depart || "",
      lieu_arrivee: v.lieu_arrivee || "",
      date_evenement: v.date_evenement || "",
    });
    setSelected(v); setModal("edit"); setError("");
  };

  const openEditUser = (u: AdminUser) => {
    setSelectedUser(u);
    setUserForm({
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      is_active: u.is_active !== false,
    });
    setUserModal(true);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    const images = cleanImages(form.images);
    const payload = {
      ...form,
      image: form.image || images[0] || "",
      images,
    };
    try {
      if (modal === "add") { await adminApi.createVoyage(payload); flash("Voyage ajouté !"); }
      else if (modal === "edit" && selected) { await adminApi.updateVoyage(selected.id, payload); flash("Voyage mis à jour !"); }
      setModal(null);
      loadVoyages();
    } catch (e: any) { setError(e.response?.data?.message || "Erreur lors de l'opération"); }
  };

  const handleDelete = async (id: number) => {
    try { await adminApi.deleteVoyage(id); setConfirmDelete(null); flash("Voyage supprimé !"); loadVoyages(); }
    catch { setError("Erreur lors de la suppression"); }
  };

  const handleToggleAdmin = async (id: number) => {
    try { await adminApi.toggleAdmin(id); loadUsers(); }
    catch { setError("Erreur"); }
  };

  const handleUserSubmit = async () => {
    if (!selectedUser) return;
    setError("");
    try {
      await adminApi.updateUser(selectedUser.id, userForm);
      setUserModal(false);
      setSelectedUser(null);
      flash("Utilisateur mis à jour !");
      loadUsers();
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        setError(first[0]);
      } else {
        setError(e.response?.data?.message || "Erreur lors de la mise à jour");
      }
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await adminApi.deleteUser(id);
      setConfirmDeleteUser(null);
      flash("Utilisateur supprimé !");
      loadUsers();
    } catch (e: any) {
      setError(e.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const handleToggleActive = async (id: number) => {
    try { await adminApi.toggleActive(id); loadUsers(); }
    catch (e: any) { setError(e.response?.data?.message || "Erreur lors de la mise à jour du compte"); }
  };

  const handleCancelReservation = async (id: number) => {
    try { await adminApi.cancelReservation(id); setConfirmCancelRes(null); flash("Réservation annulée !"); loadReservations(); }
    catch { setError("Erreur lors de l'annulation"); }
  };

  const handleDeleteReservation = async (id: number) => {
    try { await adminApi.deleteReservation(id); setConfirmDeleteRes(null); flash("Réservation supprimée !"); loadReservations(); }
    catch { setError("Erreur lors de la suppression"); }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="content">
        <div className="page-header">
          <div>
            <h2 className="heading-with-icon">
              <AppIcon name="dashboard" className="heading-icon" />
              {t("adminSpace")}
            </h2>
            <p>{t("adminContent")}</p>
          </div>
        </div>

        {msg && <div className="admin-success">{msg}</div>}
        {error && <div className="admin-error">{error}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === "voyages" ? " active" : ""}`} onClick={() => setTab("voyages")}>
            <AppIcon name="offers" className="tab-icon" /> {t("offers")}
          </button>
          <button className={`admin-tab${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>
            <AppIcon name="users" className="tab-icon" /> {t("users")}
          </button>
          <button className={`admin-tab${tab === "reservations" ? " active" : ""}`} onClick={() => setTab("reservations")}>
            <AppIcon name="reservations" className="tab-icon" /> {t("reservations")}
          </button>
          <button className={`admin-tab${tab === "paiements" ? " active" : ""}`} onClick={() => setTab("paiements")}>
            <AppIcon name="payment" className="tab-icon" /> {t("payments")}
          </button>
        </div>

        {/* ── VOYAGES TAB ── */}
        {tab === "voyages" && (
          <div style={{ marginTop: "20px" }}>
            <div className="admin-section-header">
              <h2>{t("destinations")} ({voyages.length})</h2>
              <button className="admin-btn-primary" onClick={openAdd}>+ {t("addTrip")}</button>
            </div>
            {loading ? <p className="admin-loading">Chargement...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>{t("photos")}</th><th>Type</th><th>{t("destination")}</th><th>{t("country")}</th><th>{t("price")}</th>
                      <th>{t("duration")}</th><th>{t("rating")}</th><th>{t("seats")}</th><th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voyages.length === 0 ? (
                      <tr><td colSpan={10} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>{t("noOffers")}</td></tr>
                    ) : voyages.map(v => (
                      <tr key={v.id}>
                        <td>{v.id}</td>
                        <td>
                          <div className="admin-photo-stack">
                            {imageListFor(v).slice(0, 3).map((img, index) => (
                              <img
                                key={`${v.id}-admin-${index}`}
                                src={img}
                                alt=""
                                onError={(e) => { e.currentTarget.src = ADMIN_FALLBACK_IMAGE; }}
                              />
                            ))}
                            <span>{imageListFor(v).length}</span>
                          </div>
                        </td>
                        <td><span className="admin-badge badge-user">{t(offerLabelKeys[v.type_offre || "voyage"])}</span></td>
                        <td><strong>{v.destination}</strong></td>
                        <td>{v.pays}</td>
                        <td>{formatMoney(Number(v.prix))}</td>
                        <td>{v.duree}j</td>
                        <td>⭐ {v.note}</td>
                        <td>{v.places_disponibles}</td>
                        <td className="admin-actions">
                          <button className="btn-edit icon-action" onClick={() => openEdit(v)} aria-label={t("edit")}>
                            <AppIcon name="edit" className="action-icon" />
                          </button>
                          <button className="btn-delete icon-action" onClick={() => setConfirmDelete(v.id)} aria-label={t("delete")}>
                            <AppIcon name="trash" className="action-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <div style={{ marginTop: "20px" }}>
            <div className="admin-section-header">
              <h2>{t("users")} ({users.length})</h2>
            </div>
            {loading ? <p className="admin-loading">Chargement...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>{t("fullName")}</th><th>{t("email")}</th><th>{t("phone")}</th>
                      <th>{t("role")}</th><th>{t("account")}</th><th>{t("registeredAt")}</th><th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone || "—"}</td>
                        <td>
                          <span className={`admin-badge ${u.is_admin ? "badge-admin" : "badge-user"}`}>
                            {u.is_admin ? t("adminRole") : t("userRole")}
                          </span>
                        </td>
                        <td>
                          {u.id === user?.id ? (
                            <span className="admin-badge badge-admin">{t("active")}</span>
                          ) : (
                            <button
                              className={u.is_active ? "btn-edit" : "btn-delete"}
                              onClick={() => handleToggleActive(u.id)}
                              title="Activer ou désactiver le compte"
                            >
                              {u.is_active ? t("active") : t("inactive")}
                            </button>
                          )}
                        </td>
                        <td>{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                        <td className="admin-actions">
                          <button className="btn-edit" onClick={() => openEditUser(u)}>{t("edit")}</button>
                          {u.id !== user?.id && (
                            <button className={u.is_admin ? "btn-delete" : "btn-edit"} onClick={() => handleToggleAdmin(u.id)}>
                              {u.is_admin ? t("removeAdmin") : t("makeAdmin")}
                            </button>
                          )}
                          {u.id !== user?.id && (
                            <button className="btn-delete" onClick={() => setConfirmDeleteUser(u.id)}>{t("delete")}</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── RESERVATIONS TAB ── */}
        {tab === "reservations" && (
          <div style={{ marginTop: "20px" }}>
            <div className="admin-section-header">
              <h2>{t("reservations")} ({reservations.length})</h2>
            </div>
            {loading ? <p className="admin-loading">Chargement...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>{t("client")}</th><th>{t("catTrips")}</th><th>{t("passengers")}</th>
                      <th>{t("departure")}</th><th>{t("total")}</th><th>{t("status")}</th><th>{t("actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>{t("noReservation")}</td></tr>
                    ) : reservations.map(r => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>
                          <strong>{r.user?.name || "—"}</strong>
                          <br /><small style={{ opacity: 0.7 }}>{r.user?.email}</small>
                        </td>
                        <td>
                          <strong>{r.voyage?.destination || "—"}</strong>
                          <br /><small style={{ opacity: 0.7 }}>{r.voyage?.pays}</small>
                        </td>
                        <td>{r.nombre_personnes}</td>
                        <td>{r.date_depart ? formatDate(r.date_depart) : "—"}</td>
                        <td>{formatMoney(Number(r.total))}</td>
                        <td>
                          <span className={`admin-badge ${statutColor[r.statut] || "badge-user"}`}>
                            {statutLabel[r.statut] || r.statut}
                          </span>
                        </td>
                        <td className="admin-actions">
                          {r.statut !== "annulée" && r.statut !== "annulee" && (
                            <button className="btn-edit icon-action" title={t("cancel")} onClick={() => setConfirmCancelRes(r.id)}>
                              <AppIcon name="cancel" className="action-icon" />
                            </button>
                          )}
                          <button className="btn-delete icon-action" title={t("delete")} onClick={() => setConfirmDeleteRes(r.id)}>
                            <AppIcon name="trash" className="action-icon" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PAIEMENTS TAB ── */}
        {tab === "paiements" && (
          <div style={{ marginTop: "20px" }}>
            <div className="admin-section-header">
              <h2>{t("payments")} ({paiements.length})</h2>
            </div>
            {loading ? <p className="admin-loading">Chargement...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>{t("invoice")}</th><th>{t("client")}</th><th>{t("catTrips")}</th><th>{t("method")}</th>
                      <th>{t("date")}</th><th>{t("status")}</th><th>{t("amount")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paiements.length === 0 ? (
                      <tr><td colSpan={7} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>{t("noPayments")}</td></tr>
                    ) : paiements.map(p => (
                      <tr key={p.id}>
                        <td><strong>{p.invoice_number}</strong></td>
                        <td>
                          <strong>{p.user?.name || "—"}</strong>
                          <br /><small style={{ opacity: 0.7 }}>{p.user?.email}</small>
                        </td>
                        <td>
                          <strong>{p.reservation?.voyage?.destination || "—"}</strong>
                          <br /><small style={{ opacity: 0.7 }}>{p.reservation?.voyage?.pays}</small>
                        </td>
                        <td>{p.method_label}</td>
                        <td>{formatDate(p.created_at)}</td>
                        <td>
                          <span className={`admin-badge ${p.status === "reussi" ? "badge-admin" : "badge-user"}`}>
                            {p.status === "reussi" ? t("paidStatus") : p.status}
                          </span>
                        </td>
                        <td>{formatMoney(Number(p.amount ?? p.montant))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MODAL Edit User ── */}
        {userModal && (
          <div className="modal" onClick={() => setUserModal(false)}>
            <div className="modal-box admin-modal-box" onClick={e => e.stopPropagation()}>
              <h3>{t("editUser")}</h3>
              {error && <p className="admin-form-error">{error}</p>}
              <div className="modal-grid">
                <div className="form-group">
                  <label>{t("fullName")}</label>
                  <input className="admin-input" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input className="admin-input" type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t("phone")}</label>
                  <input className="admin-input" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} />
                </div>
                <label className="admin-check-row">
                  <input
                    type="checkbox"
                    checked={userForm.is_active}
                    disabled={selectedUser?.id === user?.id}
                    onChange={e => setUserForm({...userForm, is_active: e.target.checked})}
                  />
                  {t("accountActive")}
                </label>
              </div>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setUserModal(false)}>{t("cancel")}</button>
                <button className="admin-btn-primary" onClick={handleUserSubmit}>{t("save")}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL Add/Edit Voyage ── */}
        {modal && (
          <div className="modal" onClick={() => setModal(null)}>
            <div className="modal-box admin-modal-box" onClick={e => e.stopPropagation()}>
              <h3>{modal === "add" ? t("addTrip") : t("editTrip")}</h3>
              {error && <p className="admin-form-error">{error}</p>}
              <div className="modal-grid">
                <div className="form-group">
                  <label>{t("offerType")}</label>
                  <select className="admin-input" value={form.type_offre} onChange={e => setForm({...form, type_offre: e.target.value as Voyage["type_offre"]})}>
                    <option value="voyage">{t("catTrips")}</option>
                    <option value="evenement">{t("catEvents")}</option>
                    <option value="hajj">{t("catHajj")}</option>
                    <option value="omra">{t("catOmra")}</option>
                    <option value="transport">{t("catTransport")}</option>
                  </select>
                </div>
                {(["destination","pays","image"] as const).map(field => (
                  <div key={field} className="form-group">
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input className="admin-input" value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} placeholder={field} />
                  </div>
                ))}
                {(["transport_type","lieu_depart","lieu_arrivee"] as const).map(field => (
                  <div key={field} className="form-group">
                    <label>{field.replace("_", " ")}</label>
                    <input className="admin-input" value={form[field] || ""} onChange={e => setForm({...form, [field]: e.target.value})} placeholder={field.replace("_", " ")} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Date événement</label>
                  <input className="admin-input" type="date" value={form.date_evenement || ""} onChange={e => setForm({...form, date_evenement: e.target.value})} />
                </div>
                <div className="form-group form-group-full">
                  <label>{t("photoGallery")}</label>
                  <textarea
                    className="admin-input"
                    rows={5}
                    value={(form.images || []).join("\n")}
                    onChange={e => setForm({...form, images: cleanImages(e.target.value.split("\n"))})}
                    placeholder={t("imageUrlPerLine")}
                  />
                  {(form.image || form.images.length > 0) && (
                    <div className="admin-gallery-preview">
                      {cleanImages([form.image, ...form.images]).slice(0, 6).map((img, index) => (
                        <img
                          key={`${img}-${index}`}
                          src={img}
                          alt=""
                          onError={(e) => { e.currentTarget.src = ADMIN_FALLBACK_IMAGE; }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group form-group-full">
                  <label>{t("description")}</label>
                  <textarea className="admin-input" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                {(["prix","duree","note","places_disponibles"] as const).map(field => (
                  <div key={field} className="form-group">
                    <label>{field.replace("_", " ")}</label>
                    <input className="admin-input" type="number" value={form[field]} onChange={e => setForm({...form, [field]: Number(e.target.value)})} />
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setModal(null)}>{t("cancel")}</button>
                <button className="admin-btn-primary" onClick={handleSubmit}>{modal === "add" ? t("create") : t("save")}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Delete Voyage ── */}
        {confirmDelete && (
          <div className="modal" onClick={() => setConfirmDelete(null)}>
            <div className="modal-box modal-small" onClick={e => e.stopPropagation()}>
              <h3>{t("confirmDelete")}</h3>
              <p>{t("deleteTripText")}</p>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setConfirmDelete(null)}>{t("cancel")}</button>
                <button className="btn-danger" onClick={() => handleDelete(confirmDelete)}>{t("delete")}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Delete User ── */}
        {confirmDeleteUser && (
          <div className="modal" onClick={() => setConfirmDeleteUser(null)}>
            <div className="modal-box modal-small" onClick={e => e.stopPropagation()}>
              <h3>{t("deleteUser")}</h3>
              <p>{t("deleteUserText")}</p>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setConfirmDeleteUser(null)}>{t("back")}</button>
                <button className="btn-danger" onClick={() => handleDeleteUser(confirmDeleteUser)}>{t("delete")}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Cancel Reservation ── */}
        {confirmCancelRes && (
          <div className="modal" onClick={() => setConfirmCancelRes(null)}>
            <div className="modal-box modal-small" onClick={e => e.stopPropagation()}>
              <h3>{t("cancelReservation")}</h3>
              <p>{t("cancelReservationConfirm")}</p>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setConfirmCancelRes(null)}>{t("back")}</button>
                <button className="btn-danger" onClick={() => handleCancelReservation(confirmCancelRes)}>{t("cancelReservation")}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Delete Reservation ── */}
        {confirmDeleteRes && (
          <div className="modal" onClick={() => setConfirmDeleteRes(null)}>
            <div className="modal-box modal-small" onClick={e => e.stopPropagation()}>
              <h3>{t("deleteReservation")}</h3>
              <p>{t("deleteReservationConfirm")}</p>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setConfirmDeleteRes(null)}>{t("back")}</button>
                <button className="btn-danger" onClick={() => handleDeleteReservation(confirmDeleteRes)}>{t("delete")}</button>
              </div>
            </div>
          </div>
        )}
        <AppFooter compact />
      </main>
    </div>
  );
}
