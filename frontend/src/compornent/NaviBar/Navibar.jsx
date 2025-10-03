// Navibar.jsx -- iconic gradient theme
import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { MdOutlineLightMode, MdNightlightRound } from "react-icons/md";
import { LuCircleUser } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import "./navibar.css";

export default function Navibar({ theme = "light", setTheme = () => {} }) {
  const [open, setOpen] = useState(false);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const closeOnResize = () => window.innerWidth > 1024 && setOpen(false);
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  return (
    <header className={`navibar ${theme === "dark" ? "navibar--dark" : ""}`}>
      {/* Brand */}
      <Link to="/" className="brand" onClick={closeMenu} aria-label="Go to home">
        <div className="brand__mark" aria-hidden>
          <span className="brand__glow" />
          <span className="brand__letter">C</span>
        </div>
        <span className="brand__text">CATMS</span>
      </Link>

      {/* Desktop links */}
      <nav className="links" aria-label="Primary">
        <NavLink to="/" end className={({ isActive }) => `link ${isActive ? "is-active" : ""}`}>
          Home
        </NavLink>
        <NavLink to="/doctors" className={({ isActive }) => `link ${isActive ? "is-active" : ""}`}>
          Doctors
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => `link ${isActive ? "is-active" : ""}`}>
          Register
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => `link ${isActive ? "is-active" : ""}`}>
          About
        </NavLink>
      </nav>

      {/* Actions */}
      <div className="actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <MdOutlineLightMode size={20} /> : <MdNightlightRound size={20} />}
        </button>
        <button className="avatar-btn" aria-label="Profile">
          <LuCircleUser size={20} />
        </button>
        <button
          className="hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="mobile-drawer"
        >
          <RxHamburgerMenu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div id="mobile-drawer" className={`mobile-drawer ${open ? "open" : ""}`}>
        <div className="mobile-drawer__inner">
          <NavLink to="/" end className="m-link" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/doctors" className="m-link" onClick={closeMenu}>
            Doctors
          </NavLink>
          <NavLink to="/register" className="m-link" onClick={closeMenu}>
            Register
          </NavLink>
          <NavLink to="/about" className="m-link" onClick={closeMenu}>
            About
          </NavLink>
          <div className="m-actions">
            <button className="m-btn" onClick={toggleTheme}>
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
            <button className="m-btn m-btn--ghost" onClick={closeMenu}>Close</button>
          </div>
        </div>
      </div>
    </header>
  );
}
