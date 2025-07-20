import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpenCheck, Settings, LogOut, ChevronDown } from "lucide-react";

/**
 *@param {{ user?: {name:string; email?:string; avatar?:string}, onLogout?: ()=>void }}
 */
const Navbar = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // fallback if no user prop is supplied
  const currentUser = user ?? {
    name: "Ujjwal",
    email: "ujjwal@example.com",
    avatar: "", // put a real URL here to see the picture
  };

  const handleMenuToggle = () => setMenuOpen((open) => !open);

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout?.(); // call only if the parent supplied it
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* ─── Logo ─────────────────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-400 to-teal-400 shadow-lg group-hover:shadow-lime-300/50 group-hover:scale-125 transition-all duration-300">
            <BookOpenCheck className="w-6 h-6 text-white" />
          </div>

          <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-500 via-indigo-400 to-teal-400 bg-clip-text text-transparent tracking-wide animate-pulse ">
            TaskTopia
          </span>
        </div>

        {/* ─── Right side: profile + settings ──────────────────────────────── */}
        <div className="flex items-center gap-4 cursor-pointer group">
          {/* quick‑link to profile settings page */}
          <button
            onClick={() => navigate("/profile")}
            className="p-2 rounded-full bg-gradient-to-br from-violet-500 via-indigo-400 to-teal-400 text-white transition-transform group-hover:shadow-lime-300/50 duration-300 shadow-md hover:scale-125"
          >
            <Settings className="w-7 h-7" />
          </button>

          {/* user avatar + dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-indigo-50 transition-colors duration-300 border border-transparent hover:border-blue-200"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Avatar"
                  className="w-9 h-9 rounded-full shadow-sm "
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-400 to-teal-400 text-white font-semibold shadow-md">
                  {currentUser.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}

              {/* name + email (hide on very small screens) */}
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">
                  {currentUser.name}
                </p>
                {currentUser.email && (
                  <p className="text-xs text-gray-500 font-normal">
                    {currentUser.email}
                  </p>
                )}
              </div>

              {/* drop‑arrow */}
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* ─── Dropdown menu ─────────────────────────────────────────── */}
            {menuOpen && (
              <ul className="absolute top-14 right-0 w-56 bg-white rounded-2xl shadow-xl border border-indigo-100 z-50 overflow-hidden animate-fadeIn">
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 transition-colors flex items-center gap-2 group"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-gray-700" />
                    Profile Setting
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-50 text-red-500"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
