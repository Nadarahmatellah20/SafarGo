import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Voyages from "./pages/Voyages";
import ReservationPage from "./pages/Reservation";
import PaiementPage from "./pages/Paiement";
import Admin from "./pages/Admin";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p style={{ color: "#fff" }}>Chargement...</p></div>;
  return isAuth ? <>{children}</> : <Navigate to="/" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, user, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p style={{ color: "#fff" }}>Chargement...</p></div>;
  if (!isAuth) return <Navigate to="/" replace />;
  if (!user?.is_admin) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuth, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p style={{ color: "#fff" }}>Chargement...</p></div>;
  return !isAuth ? <>{children}</> : <Navigate to="/home" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Auth /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/voyages" element={<PrivateRoute><Voyages /></PrivateRoute>} />
      <Route path="/reservation" element={<PrivateRoute><ReservationPage /></PrivateRoute>} />
      <Route path="/paiement" element={<PrivateRoute><PaiementPage /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
