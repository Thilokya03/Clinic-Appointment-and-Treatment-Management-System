// CATMS Sidebar
// Import alongside leftsidebar.css for the complete experience.

import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./leftsidebar.css";
import { RxDashboard, RxCalendar, RxPerson, RxGear, RxBell } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";

const defaultNavItems = [
  { label: "Dashboard", href: "/dashboard", icon: <RxDashboard />, end: true },
  { label: "Set Appointment", href: "/dashboard/appointments", icon: <RxCalendar /> },
  { label: "Patients", href: "/dashboard/patients", icon: <RxPerson /> },
  { label: "Settings", href: "/dashboard/settings", icon: <RxGear /> },
];

export default function Leftsidebar({
  navItems = defaultNavItems,
  user = { name: "User", email: "user@example.com" },
  notificationsCount = 0,
  onLogout = () => {},
  theme = "light",
}) {
  const [open, setOpen] = useState(true);
  const tone = theme === "dark" ? "dark" : "light";

  const toggleSidebar = () => setOpen((o) => !o);

  return (
    <aside
      className={`sidebar ${open ? "open" : "collapsed"} sidebar--${tone}`}
      data-theme={tone}
      aria-label="Main sidebar"
    >
      {/* Brand / Toggle */}
      <div className="sidebar__header">
        <button
          type="button"
          className="sidebar__toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={open}
        >
          <span className="toggle__bar" />
          <span className="toggle__bar" />
          <span className="toggle__bar" />
        </button>
      </div>

      {/* Quick status */}
      <div className="sidebar__status">
        <button className="status__bell" title="Notifications" aria-label="Notifications">
          <RxBell />
          {notificationsCount > 0 && (
            <span className="badge" aria-label={`${notificationsCount} notifications`}>
              {notificationsCount > 99 ? "99+" : notificationsCount}
            </span>
          )}
        </button>
        {open && <div className="status__hint">All systems normal</div>}
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.href || item.label}
            to={item.href}
            end={item.end}
            className={({ isActive }) => `nav__link ${isActive ? "is-active" : ""}`}
            data-tooltip={!open ? item.label : undefined}
          >
            <span className="nav__icon" aria-hidden>
              {item.icon ?? <RxDashboard />}
            </span>
            {open && <span className="nav__label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="sidebar__footer">
        <div className="user">
          <div className="avatar" aria-hidden>
            {(user?.name?.[0] || "U").toUpperCase()}
          </div>
          {open && (
            <div className="user__meta">
              <div className="user__name">{user?.name}</div>
              <div className="user__email">{user?.email}</div>
              <button type="button" className="btn btn--ghost" onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
        {!open && (
          <button
            type="button"
            className="btn btn--primary btn--floating"
            title="Logout"
            aria-label="Logout"
            onClick={onLogout}
          >
            <LuLogOut size={20} />
          </button>
        )}
      </div>
    </aside>
  );
}
