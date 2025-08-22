import { useState, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { IconMenu2 } from "@tabler/icons-react";
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const route = useLocation();
  const navigate = useNavigate();
  const [isHidden, setHidden] = useState(true);

  const token = localStorage.getItem("token");

  // Get role from token if logged in
  const role = useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.role;
    } catch (e) {
      console.log(e);
      return null;
    }
  }, [token]);

  // Menu links based on role
  let menuLinks = [];

  if (!role) {
    menuLinks.push(
      { path: "/home", name: "Home" },
      { path: "/login", name: "Login" },
      { path: "/register", name: "Sign Up" }
    );
  } else if (role === "user") {
    menuLinks.push({ path: "/user/dashboard", name: "Dashboard" });
    menuLinks.push({ path: "/user/create-ticket", name: "Log Issue" });
  } else if (role === "agent") {
    menuLinks.push({ path: "/agent/dashboard", name: "Dashboard" });
    menuLinks.push({ path: "/admin/tickets", name: "Manage Tickets" });
  } else if (role === "admin") {
    menuLinks.push({ path: "/admin/dashboard", name: "Dashboard" });
    menuLinks.push({ path: "/admin/add-article", name: "Add Article" });
    menuLinks.push({ path: "/admin/articles", name: "Articles" });
    menuLinks.push({ path: "/admin/tickets", name: "Manage Tickets" });
    menuLinks.push({ path: "/admin/settings", name: "Settings" });
  }

  // Logout button
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMenu = () => setHidden(!isHidden);

  return (
    <header className="relative">
      {/* Mobile Toggle Button */}
      <div className="flex md:hidden text-yellow-300">
        <button
          onClick={toggleMenu}
          className="flex items-center px-3 py-2 font-normal bg-gray-600 rounded"
        >
          <IconMenu2 />
        </button>
      </div>

      {/* Mobile Menu */}
      {!isHidden && (
        <div className="absolute top-full left-0 mt-2 bg-opacity-75 w-full bg-gray-800">
          <ul className="space-y-1 my-2 mx-2 divide-y divide-solid font-semibold text-gray-200 flex flex-col">
            {menuLinks.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={`block px-4 py-2 transition-colors duration-200 ${
                    route.pathname === link.path
                      ? "bg-gray-600"
                      : "text-gray-200 hover:text-yellow-400"
                  }`}
                  onClick={toggleMenu}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            {role && (
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-500"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Desktop Menu */}
      <div className="px-8 hidden md:flex bg-gray-800 p-4">
        <ul className="flex justify-end space-x-4 font-semibold">
          {menuLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={`transition-colors duration-200 px-3 py-2 rounded ${
                  route.pathname === link.path
                    ? "bg-gray-600"
                    : "text-gray-200 hover:text-yellow-400"
                }`}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          {role && (
            <li>
              <NavLink
                to="#"
                onClick={handleLogout}
                className={`px-3 py-2 rounded ${
                  route.pathname === "/logout"
                    ? "bg-gray-600"
                    : "text-red-200 hover:text-red-400"
                }`}
              >
                Logout
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
