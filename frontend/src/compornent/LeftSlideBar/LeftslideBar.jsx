// CATMS Sidebar
// Import alongside leftsidebar.css for the complete experience.

import { useState } from "react";
import "./leftsidebar.css";
import { RxDashboard, RxCalendar, RxPerson, RxGear, RxBell } from "react-icons/rx";
import { LuLogOut } from "react-icons/lu";

export default function Leftsidebar({
  navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <RxDashboard /> },
    { label: "Patients", href: "/patients", icon: <RxPerson /> },
    { label: "Appointments", href: "/appointments", icon: <RxCalendar /> },
    { label: "Settings", href: "/settings", icon: <RxGear /> },
  ],
  activeHref = "/dashboard",

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
        {navItems.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <a
              key={item.href || item.label}
              href={item.href}
              className={`nav__link ${isActive ? "is-active" : ""}`}
              data-tooltip={!open ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="nav__icon" aria-hidden>
                {item.icon ?? <RxDashboard />}
              </span>
              {open && <span className="nav__label">{item.label}</span>}
            </a>
          );
        })}
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