import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-8 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
