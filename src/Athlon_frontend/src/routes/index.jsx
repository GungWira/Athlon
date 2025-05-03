import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import MainLayout from "../layouts/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout/>}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>

    </Routes>
  );
}
