import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Voyages from "./pages/Voyages";
import ReservationPage from "./pages/Reservation";
import PaiementPage from "./pages/Paiement";
import Admin from "./pages/Admin";
import BilletsFactures from "./pages/BilletsFactures";
import SocialCallback from "./pages/SocialCallback";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p style={{ color: "#fff" }}>Chargement...</p></div>;
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

function ClientRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, user, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p style={{ color: "#fff" }}>Chargement...</p></div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  if (user?.is_admin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, user, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p style={{ color: "#fff" }}>Chargement...</p></div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  if (!user?.is_admin) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, user, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p style={{ color: "#fff" }}>Chargement...</p></div>;
  if (!isAuth) return <>{children}</>;
  return <Navigate to={user?.is_admin ? "/admin" : "/home"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/social-callback" element={<SocialCallback />} />
      <Route path="/home" element={<ClientRoute><Home /></ClientRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/voyages" element={<ClientRoute><Voyages /></ClientRoute>} />
      <Route path="/reservation" element={<ClientRoute><ReservationPage /></ClientRoute>} />
      <Route path="/paiement" element={<ClientRoute><PaiementPage /></ClientRoute>} />
      <Route path="/documents" element={<ClientRoute><BilletsFactures /></ClientRoute>} />
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <PreferencesProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </PreferencesProvider>
    </BrowserRouter>
  );
}
