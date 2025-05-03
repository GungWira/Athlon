import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import MainLayout from "../layouts/MainLayout";
import ProtectedAuthRoute from "./protectedAuthRoute";
import CreateProfile from "../pages/CreateProfile";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/createprofile" element={<CreateProfile />} />

      <Route element={<ProtectedAuthRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  );
}
