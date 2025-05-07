import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-slate-800 text-white shadow-lg border-b border-slate-700 z-50">
      <div className="py-4 flex justify-center items-center">
        <div className="flex space-x-10">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-blue-400 transition-colors duration-200 ${
                isActive ? "text-blue-400 font-semibold" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/pastes"
            className={({ isActive }) =>
              `hover:text-blue-400 transition-colors duration-200 ${
                isActive ? "text-blue-400 font-semibold" : ""
              }`
            }
          >
            Paste
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
