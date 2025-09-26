import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../utils/constants";
import { clearUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { clearConnections } from "../utils/connectionSlice";
import { clearRequests } from "../utils/requestSlice";

const STORAGE_KEY = "cm-theme";

const Navbar = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "light"
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const user = useSelector((state) => state.user.user);
  const requests = useSelector((state) => state.requests);
  const requestCount = requests?.length || 0;
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearUser());
      dispatch(removeFeed());
      dispatch(clearConnections());
      dispatch(clearRequests());
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="navbar bg-base-100 shadow">
      <Link to="/feed" className="flex-1 ml-2 md:ml-14">
        <img src="/Crushme.svg" alt="CrushMe" className="h-9 w-auto" />
      </Link>
      <div className="flex gap-2 mr-0 md:mr-14">
        <div className="form-control mt-1.5 mr-2">
          Welcome, {user?.firstName || "Guest"}
        </div>
        <div className="dropdown dropdown-end">
          <button 
            className="btn btn-ghost btn-circle avatar mr-4 relative"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-10 rounded-full">
              <img
                alt="User avatar"
                src={
                  user?.photoUrl ||
                  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                }
              />
            </div>
            {requestCount > 0 && !dropdownOpen && (
              <div className="absolute -top-1 -right-1 bg-error text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {requestCount > 9 ? '9+' : requestCount}
              </div>
            )}
          </button>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-56 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
              <Link to="/connections" className="justify-between">
                Connections
              </Link>
              <Link to="/requests" className="justify-between relative">
                <span>Requests</span>
                {requestCount > 0 && (
                  <div className="badge badge-error badge-sm text-white">
                    {requestCount > 99 ? '99+' : requestCount}
                  </div>
                )}
              </Link>
            </li>

            <li className="menu-title mt-2">Appearance</li>
            <li>
              <label className="flex items-center justify-between px-2 py-2">
                <span>Dark mode</span>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={theme === "dark"}
                  onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle dark mode"
                />
              </label>
            </li>

            <li>
              <button type="button" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;