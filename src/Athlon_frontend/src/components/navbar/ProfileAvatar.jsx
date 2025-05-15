import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileAvatar() {
  const { logout, userData } = useAuth();
  return (
    <div className="relative group">
      <div className="flex justify-center items-center gap-4 -space-x-2 overflow-hidden">
        <img
          className="inline-block size-10 rounded-full ring-2 ring-white"
          src={
            userData.imageProfile == "" ? "default.webp" : userData.imageProfile
          }
          alt=""
        />
        {userData ? userData.username : "Guest"}
      </div>
      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="py-1">
          <Link
            to={userData.userType == "owner" ? "/owner" : "/dashboard"}
            className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Dashboard
          </Link>
          {userData && userData.userType == "owner" && (
            <>
              <Link
                to="/premium"
                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Jadi Premium
              </Link>

              <Link
                to="/owner/create-arena"
                className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Tambah Lapangan
              </Link>
            </>
          )}

          <span
            onClick={logout}
            className="block cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}
