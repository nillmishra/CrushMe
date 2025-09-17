import React from "react";

const STORAGE_KEY = "cm-theme";
const THEME_OPTIONS = [
  { value: "light", label: "☀️" },
  { value: "dark", label: "🌙" },
];


const Navbar = () => {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "light";
  });

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);
  return(
<div className="navbar bg-base-100 shadow">
        <div className="flex-1 ml-14">
          <img src="/Crushme.svg" alt="CrushMe" className="h-9 w-auto" />
        </div>
        <div className="flex-none gap-2 mr-6">
          <label className="sr-only" htmlFor="theme-select">
            Select theme
          </label>
          <select
            id="theme-select"
            className="select select-bordered"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            aria-label="Select theme"
          >
            {THEME_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar mr-14 ml-6"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

  )
 }

export default Navbar;