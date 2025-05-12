import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";
import MainLayout from "../layouts/MainLayout";

export default function ProtectedCustomerRoute() {
  const { isAuthenticated, loading, userData } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated || !userData || userData.userType != "customer") {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
