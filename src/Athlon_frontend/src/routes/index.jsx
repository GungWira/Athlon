import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import AuthLayout from "../layouts/AuthLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout/>}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}
