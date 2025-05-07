import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ProtectedAuthRoute from "./protectedAuthRoute";
import CreateProfile from "../pages/CreateProfile";
import ProtectedOwnerRoute from "./protectedOwnerRoute";
import DashboardOwner from "../pages/owner/DashboardOwner";
import CreateArena from "../pages/owner/CreateArena";
import OwnerArenaDetail from "../pages/owner/OwnerArenaDetail";
import CreateField from "../pages/owner/CreateField";
import SearchPage from "../pages/customer/SearchPage";
import Owner from "../pages/Owner";
import CustomerArenaDetail from "../pages/customer/CustomerArenaDetail";
import Testing from "../pages/Testing";
import DashboardCustomer from "../pages/customer/DashboardCustomer";
import ProtectedCustomerRoute from "./protectedCustomerRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/createprofile" element={<CreateProfile />} />

      <Route element={<ProtectedAuthRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/owner" element={<Owner />} />
        <Route path="/arena/:idArena" element={<CustomerArenaDetail />} />
        <Route path="/testing" element={<Testing />} />
      </Route>
      {/* CUSTOMER ROUTES */}
      <Route element={<ProtectedCustomerRoute />}>
        <Route path="/dashboard" element={<DashboardCustomer />} />
      </Route>
      {/* OWNER ROUTES */}
      <Route element={<ProtectedOwnerRoute />}>
        <Route path="/owner" element={<DashboardOwner />} />
        <Route path="/owner/create-arena" element={<CreateArena />} />
        <Route path="/owner/arena/:idArena" element={<OwnerArenaDetail />} />
        <Route path="/owner/arena/add-field" element={<CreateField />} />
      </Route>
    </Routes>
  );
}
