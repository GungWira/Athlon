import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import MainLayout from "../layouts/MainLayout";

export default function ProtectedAuthRoute() {
  const { isAuthenticated, loading, userData } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !userData) {
    return <Navigate to="/createprofile" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
