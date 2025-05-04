import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import MainLayout from "../layouts/MainLayout";
import ProtectedAuthRoute from "./protectedAuthRoute";
import CreateProfile from "../pages/CreateProfile";
import ProtectedOwnerRoute from "./protectedOwnerRoute";
import DashboardOwner from "../pages/owner/DashboardOwner";
import CreateArena from "../pages/owner/CreateArena";
import OwnerArenaDetail from "../pages/owner/OwnerArenaDetail";
import CreateField from "../pages/owner/CreateField";
import SearchPage from "../pages/customer/SearchPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/createprofile" element={<CreateProfile />} />

      <Route element={<ProtectedAuthRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<About />} />
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
