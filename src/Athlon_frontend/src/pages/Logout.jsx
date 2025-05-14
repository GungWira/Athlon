import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Logout() {
  const { logout } = useAuth();
  return (
    <button
      onClick={logout}
      className="border font-bold hover:bg-indigo-600 hover:text-white ease-in-out delay-150 transition cursor-pointer border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}
