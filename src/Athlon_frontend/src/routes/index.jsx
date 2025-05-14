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
import Community from "../pages/community/Community";
import CreateCommunity from "../pages/community/CreateCommunity";
import DetailCommunity from "../pages/community/DetailCommunity";
import Event from "../pages/event/Event";
import CreateEvent from "../pages/event/CreateEvent";
import EventDetail from "../pages/event/EventDetail";
import DetailTransaction from "../pages/customer/DetailTransaction";
import Logout from "../pages/Logout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/createprofile" element={<CreateProfile />} />
      <Route path="/logout" element={<Logout />} />

      <Route element={<ProtectedAuthRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/join-owner" element={<Owner />} />
        <Route path="/arena/:idArena" element={<CustomerArenaDetail />} />
        <Route path="/arena/payment" element={<DetailTransaction />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/create" element={<CreateCommunity />} />
        <Route path="/community/:idCommunity" element={<DetailCommunity />} />
        <Route path="/event" element={<Event />} />
        <Route path="/event/create" element={<CreateEvent />} />
        <Route path="/event/:idEvent" element={<EventDetail />} />
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
