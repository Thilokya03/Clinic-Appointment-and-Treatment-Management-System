import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { MdOutlineLightMode, MdNightlightRound } from "react-icons/md";
import { LuCircleUser } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import "./navibar.css";

function Navibar({ theme, setTheme }) {
  const [open, setOpen] = useState(false);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const closeOnResize = () => window.innerWidth > 1024 && setOpen(false);
    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  return (
    <header className={`navibar ${theme === "dark" ? "navibar-dark" : ""}`}>
      <Link to="/" className="brand" onClick={closeMenu} aria-label="Go to home">
        <div className="brand-mark">C</div>
        <span className="brand-text">CATMS</span>
      </Link>

      <nav className="links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "link active" : "link")}>
          Home
        </NavLink>
        <NavLink to="/doctor" className={({ isActive }) => (isActive ? "link active" : "link")}>
          Doctors
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => (isActive ? "link active" : "link")}>
          Login
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => (isActive ? "link active" : "link")}>
          Register
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? "link active" : "link")}>
          About
        </NavLink>
      </nav>

      <div className="actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <MdOutlineLightMode size={22} /> : <MdNightlightRound size={22} />}
        </button>
        <button className="avatar-btn" aria-label="Profile">
          <LuCircleUser size={22} />
        </button>
        <button
          className="hamburger"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open navigation menu"
          aria-expanded={open}
        >
          <RxHamburgerMenu size={22} />
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
        <NavLink to="/register" className="m-link" onClick={closeMenu}>
          Register
        </NavLink>
        <NavLink to="/about" className="m-link" onClick={closeMenu}>
          About
        </NavLink>
      </div>
    </header>
  );
}

export default Navibar;
