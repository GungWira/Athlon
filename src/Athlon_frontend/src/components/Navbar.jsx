import React from "react";
import { Link } from "react-router-dom";
import Announcement from "../components/home/Announcement";
import ProfileAvatar from "./navbar/ProfileAvatar";
import { useAuth } from "../contexts/AuthContext";
export default function Navbar() {
  const { login, isAuthenticated, userData, logout } = useAuth();
  return (
    <div>
      <Announcement />
      <div className="w-full px-12">
        <header className="w-full max-w-7xl border-b border-indigo-600/15 mx-auto px-4 py-4 flex items-center justify-between">
          <Link to={"/"} className="flex items-center">
            <h1 className="text-2xl font-bold">
              Athl<span className="text-indigo-600">on.</span>
            </h1>
          </Link>

          {userData && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link to={"/"} className="text-indigo-600">
                Home
              </Link>

              {/* dropdown pake menu  */}
              <div className="relative group">
                <span className="cursor-pointer flex items-center text-gray-600 group-hover:text-indigo-600">
                  Sports{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1">
                    <Link
                      to={"/search?sport=Badminton"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Badminton
                    </Link>
                    <Link
                      to={"/search?sport=Tennis"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Tennis
                    </Link>
                    <Link
                      to={"/search?sport=Sepak Bola"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Sepak Bola
                    </Link>
                    <Link
                      to={"/search?sport=Basket"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Basket
                    </Link>
                    <Link
                      to={"/search?sport=Bulutangkis"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Bulutangkis
                    </Link>
                  </div>
                </div>
              </div>

              {/* dropdown pake menu  */}
              <div className="relative group">
                <span className="cursor-pointer flex items-center text-gray-600 group-hover:text-indigo-600">
                  Features{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="lucide lucide-chevron-down-icon lucide-chevron-down"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-1">
                    <Link
                      to={"/community"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Community
                    </Link>
                    <Link
                      to={"/event"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Event
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                to="/join-owner"
                className="text-gray-600 hover:text-indigo-600"
              >
                Join as Owner
              </Link>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {isAuthenticated && userData ? (
              <>
                <ProfileAvatar />
              </>
            ) : isAuthenticated && !userData ? (
              <>
                <button
                  onClick={logout}
                  className="border font-bold hover:bg-indigo-600 hover:text-white ease-in-out delay-150 transition cursor-pointer border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={login}
                  className="border font-bold hover:bg-indigo-600 hover:text-white ease-in-out delay-150 transition cursor-pointer border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg"
                >
                  Sign In
                </button>
                <button className="bg-indigo-600 font-bold text-white px-4 py-2 rounded-lg">
                  Get Started
                </button>
              </>
            )}
          </div>
        </header>
      </div>
    </div>
  );
}
