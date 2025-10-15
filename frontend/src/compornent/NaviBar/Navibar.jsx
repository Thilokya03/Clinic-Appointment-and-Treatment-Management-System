// Navibar.jsx -- iconic gradient theme
import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { MdOutlineLightMode, MdNightlightRound } from "react-icons/md";
import { LuCircleUser } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import LogoLight from "../../assert/logo-light.png";
import LogoDark from "../../assert/logo-dark.png";
import "./navibar.css";

export default function Navibar({ theme = "light", setTheme = () => { } }) {
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

          <img src={theme === 'light' ? LogoLight : LogoDark} alt="Logo" className="brand__logo" />
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
        {/* New Links */}
        <NavLink to="/admin" className={({ isActive }) => (isActive ? "link active" : "link")}>
          Admin
        </NavLink>
        <NavLink to="/branch-manager" className={({ isActive }) => (isActive ? "link active" : "link")}>
          Manager
        </NavLink>
        <NavLink to="/staff" className={({ isActive }) => (isActive ? "link active" : "link")}>
          Staff
        </NavLink>
        <NavLink to="/patient" className={({ isActive }) => (isActive ? "link active" : "link")}>
          Patient
        </NavLink>
      </nav>

      {/* Actions */}
      <div className="actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <MdOutlineLightMode size={20} /> : <MdNightlightRound size={20} />}
        </button>
        <Link to={"/login"}>
          <button className="avatar-btn" aria-label="Profile" >
            <LuCircleUser size={20} />
          </button>
        </Link>
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

      <div className={`mobile-drawer ${open ? "open" : ""}`}>
        <NavLink to="/" end className="m-link" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/doctor" className="m-link" onClick={closeMenu}>
          Doctors
        </NavLink>
        <NavLink to="/login" className="m-link" onClick={closeMenu}>
          Login
        </NavLink>
        <NavLink to="/about" className="m-link" onClick={closeMenu}>
          About
        </NavLink>
        {/* New Links */}
        <NavLink to="/admin" className="m-link" onClick={closeMenu}>
          Admin
        </NavLink>
        <NavLink to="/branch-manager" className="m-link" onClick={closeMenu}>
          Manager
        </NavLink>
        <NavLink to="/staff" className="m-link" onClick={closeMenu}>
          Staff
        </NavLink>
        <NavLink to="/patient" className="m-link" onClick={closeMenu}>
          Patient
        </NavLink>
      </div>
    </header>
  );
}
