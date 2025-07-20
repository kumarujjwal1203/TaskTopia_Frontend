import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
  SIDEBAR_CLASSES,
  PRODUCTIVITY_CARD,
  menuItems,
  LINK_CLASSES,
  TIP_CARD,
} from "../assets/dummy";
import { Lightbulb, Sparkles, Menu, X } from "lucide-react";

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalTasks = tasks?.length || 0;
  const completedTasks =
    tasks?.filter((t) => t.completed === true || t.completed === "Yes")
      ?.length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "User";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink
            to={path}
            className={({ isActive }) =>
              [
                LINK_CLASSES.base,
                isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
                isMobile ? "justify-start" : "lg:justify-start",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>{icon}</span>
            <span
              className={`${isMobile ? "block" : "hidden lg:block"} ${
                LINK_CLASSES.text
              }`}
            >
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={SIDEBAR_CLASSES.desktop}>
        <div className="p-5 border-b border-indigo-100 lg:block hidden">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-indigo-400 to-teal-400
                flex items-center justify-center text-white font-bold shadow-md"
            >
              {initial}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Hey, {username}
              </h2>
              <p className="text-sm text-indigo-500 t font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Let's crush some tasks!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>PRODUCTIVITY</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div
                className={PRODUCTIVITY_CARD.barFg}
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>
          {renderMenuItems()}

          <div className="mt-auto pt-6 lg:block hidden">
            <div className={TIP_CARD.container}>
              <div className="flex items-center gap-2">
                <div className={TIP_CARD.iconWrapper}>
                  <Lightbulb className="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h3 className={TIP_CARD.title}>Made By</h3>
                  <p className={TIP_CARD.text}>
                    Ujjwal Kumar — passionate MERN stack developer.
                  </p>

                  <div className="mt-2 space-y-1">
                    <a
                      href="https://github.com/kumarujjwal1203"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-indigo-500 hover:underline"
                    >
                      Visit My GitHub
                    </a>
                    <a
                      href="https://www.linkedin.com/in/ujjwal-kumar-672530252"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-indigo-500 hover:underline"
                    >
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className={SIDEBAR_CLASSES.mobileButton}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={SIDEBAR_CLASSES.mobileDrawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-indigo-600">Menu </h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-violet-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 via-indigo-400 to-teal-400
                flex items-center justify-center text-white font-bold shadow-md"
              >
                {initial}
              </div>
              <div>
                <h2 className="text-lg font-bold mt-10 text-gray-800">
                  Hey, {username}
                </h2>
                <p className="text-sm text-indigo-500 t font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Let's crush some tasks!
                </p>
              </div>
            </div>
            {renderMenuItems(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
