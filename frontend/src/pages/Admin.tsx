import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import { adminApi, VoyageForm, AdminUser, AdminReservation } from "../api/admin";

interface Voyage {
  id: number;
  destination: string;
  pays: string;
  description: string;
  prix: number;
  duree: number;
  image: string;
  note: number;
  places_disponibles: number;
}

const emptyForm: VoyageForm = {
  destination: "",
  pays: "",
  description: "",
  prix: 0,
  duree: 1,
  image: "",
  note: 4.5,
  places_disponibles: 20,
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
  const navigate = useNavigate();
  const [tab, setTab] = useState<"voyages" | "users" | "reservations">("voyages");
  const [voyages, setVoyages] = useState<Voyage[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reservations, setReservations] = useState<AdminReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Voyage | null>(null);
  const [form, setForm] = useState<VoyageForm>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
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

  const openAdd = () => { setForm(emptyForm); setSelected(null); setModal("add"); setError(""); };
  const openEdit = (v: Voyage) => {
    setForm({ destination: v.destination, pays: v.pays, description: v.description, prix: v.prix, duree: v.duree, image: v.image, note: v.note, places_disponibles: v.places_disponibles });
    setSelected(v); setModal("edit"); setError("");
  };

  const handleSubmit = async () => {
    setError("");
    try {
      if (modal === "add") { await adminApi.createVoyage(form); flash("Voyage ajouté !"); }
      else if (modal === "edit" && selected) { await adminApi.updateVoyage(selected.id, form); flash("Voyage mis à jour !"); }
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
            <h2>🛡️ Administration</h2>
            <p>Gestion du contenu SafarGo</p>
          </div>
        </div>

        {msg && <div className="admin-success">{msg}</div>}
        {error && <div className="admin-error">{error}</div>}

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab${tab === "voyages" ? " active" : ""}`} onClick={() => setTab("voyages")}>✈️ Voyages</button>
          <button className={`admin-tab${tab === "users" ? " active" : ""}`} onClick={() => setTab("users")}>👥 Utilisateurs</button>
          <button className={`admin-tab${tab === "reservations" ? " active" : ""}`} onClick={() => setTab("reservations")}>📋 Réservations</button>
        </div>

        {/* ── VOYAGES TAB ── */}
        {tab === "voyages" && (
          <div style={{ marginTop: "20px" }}>
            <div className="admin-section-header">
              <h2>Destinations ({voyages.length})</h2>
              <button className="admin-btn-primary" onClick={openAdd}>+ Ajouter un voyage</button>
            </div>
            {loading ? <p className="admin-loading">Chargement...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Destination</th><th>Pays</th><th>Prix</th>
                      <th>Durée</th><th>Note</th><th>Places</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {voyages.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>Aucun voyage</td></tr>
                    ) : voyages.map(v => (
                      <tr key={v.id}>
                        <td>{v.id}</td>
                        <td><strong>{v.destination}</strong></td>
                        <td>{v.pays}</td>
                        <td>{Number(v.prix).toLocaleString()} €</td>
                        <td>{v.duree}j</td>
                        <td>⭐ {v.note}</td>
                        <td>{v.places_disponibles}</td>
                        <td className="admin-actions">
                          <button className="btn-edit" onClick={() => openEdit(v)}>✏️</button>
                          <button className="btn-delete" onClick={() => setConfirmDelete(v.id)}>🗑️</button>
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
              <h2>Utilisateurs ({users.length})</h2>
            </div>
            {loading ? <p className="admin-loading">Chargement...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Nom</th><th>Email</th><th>Téléphone</th>
                      <th>Rôle</th><th>Inscrit le</th><th>Action</th>
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
                            {u.is_admin ? "Admin" : "Utilisateur"}
                          </span>
                        </td>
                        <td>{new Date(u.created_at).toLocaleDateString("fr-FR")}</td>
                        <td>
                          {u.id !== user?.id && (
                            <button className={u.is_admin ? "btn-delete" : "btn-edit"} onClick={() => handleToggleAdmin(u.id)}>
                              {u.is_admin ? "Retirer admin" : "Rendre admin"}
                            </button>
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
              <h2>Réservations ({reservations.length})</h2>
            </div>
            {loading ? <p className="admin-loading">Chargement...</p> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th><th>Client</th><th>Voyage</th><th>Personnes</th>
                      <th>Départ</th><th>Total</th><th>Statut</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.length === 0 ? (
                      <tr><td colSpan={8} style={{ textAlign: "center", padding: "2rem", opacity: 0.6 }}>Aucune réservation</td></tr>
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
                        <td>{r.date_depart ? new Date(r.date_depart).toLocaleDateString("fr-FR") : "—"}</td>
                        <td>{Number(r.total).toLocaleString()} €</td>
                        <td>
                          <span className={`admin-badge ${statutColor[r.statut] || "badge-user"}`}>
                            {statutLabel[r.statut] || r.statut}
                          </span>
                        </td>
                        <td className="admin-actions">
                          {r.statut !== "annulée" && r.statut !== "annulee" && (
                            <button className="btn-edit" title="Annuler" onClick={() => setConfirmCancelRes(r.id)}>🚫</button>
                          )}
                          <button className="btn-delete" title="Supprimer" onClick={() => setConfirmDeleteRes(r.id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MODAL Add/Edit Voyage ── */}
        {modal && (
          <div className="modal" onClick={() => setModal(null)}>
            <div className="modal-box admin-modal-box" onClick={e => e.stopPropagation()}>
              <h3>{modal === "add" ? "Ajouter un voyage" : "Modifier le voyage"}</h3>
              {error && <p className="admin-form-error">{error}</p>}
              <div className="modal-grid">
                {(["destination","pays","image"] as const).map(field => (
                  <div key={field} className="form-group">
                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input className="admin-input" value={form[field]} onChange={e => setForm({...form, [field]: e.target.value})} placeholder={field} />
                  </div>
                ))}
                <div className="form-group form-group-full">
                  <label>Description</label>
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
                <button className="admin-btn-secondary" onClick={() => setModal(null)}>Annuler</button>
                <button className="admin-btn-primary" onClick={handleSubmit}>{modal === "add" ? "Créer" : "Enregistrer"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Delete Voyage ── */}
        {confirmDelete && (
          <div className="modal" onClick={() => setConfirmDelete(null)}>
            <div className="modal-box modal-small" onClick={e => e.stopPropagation()}>
              <h3>Confirmer la suppression</h3>
              <p>Voulez-vous vraiment supprimer ce voyage ? Cette action est irréversible.</p>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setConfirmDelete(null)}>Annuler</button>
                <button className="btn-danger" onClick={() => handleDelete(confirmDelete)}>Supprimer</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Cancel Reservation ── */}
        {confirmCancelRes && (
          <div className="modal" onClick={() => setConfirmCancelRes(null)}>
            <div className="modal-box modal-small" onClick={e => e.stopPropagation()}>
              <h3>Annuler la réservation</h3>
              <p>Voulez-vous vraiment annuler cette réservation ?</p>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setConfirmCancelRes(null)}>Retour</button>
                <button className="btn-danger" onClick={() => handleCancelReservation(confirmCancelRes)}>Annuler la réservation</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Confirm Delete Reservation ── */}
        {confirmDeleteRes && (
          <div className="modal" onClick={() => setConfirmDeleteRes(null)}>
            <div className="modal-box modal-small" onClick={e => e.stopPropagation()}>
              <h3>Supprimer la réservation</h3>
              <p>Voulez-vous vraiment supprimer définitivement cette réservation ?</p>
              <div className="modal-footer">
                <button className="admin-btn-secondary" onClick={() => setConfirmDeleteRes(null)}>Retour</button>
                <button className="btn-danger" onClick={() => handleDeleteReservation(confirmDeleteRes)}>Supprimer</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
