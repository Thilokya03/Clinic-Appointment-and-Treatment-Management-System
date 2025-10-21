// CATMS Sidebar - Role-Based Navigation
// Import alongside leftsidebar.css for the complete experience.

import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./leftsidebar.css";
import { 
  RxDashboard, 
  RxCalendar, 
  RxPerson, 
  RxBell 
} from "react-icons/rx";
import { 
  LuLogOut, 
  LuBuilding2, 
  LuUserPlus, 
  LuUsers, 
  LuStethoscope,
  LuClipboardList,
  LuUserCog,
  LuWallet,
  LuSearch,
  LuFileText
} from "react-icons/lu";
import { FaHospital, FaUserTie } from "react-icons/fa";

// Role-based navigation items
const navigationByRole = {
  // Super Admin / Admin
  admin: [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <RxDashboard />, 
      end: true 
    },
    { 
      label: "Manage Branches", 
      href: "/dashboard/managebranch", 
      icon: <LuBuilding2 /> 
    },
    { 
      label: "Branch Managers", 
      href: "/dashboard/branchmanagers", 
      icon: <LuUserCog /> 
    },
    { 
      label: "Staff Management", 
      href: "/dashboard/staff", 
      icon: <LuUsers /> 
    },
    { 
      label: "Manage Payments", 
      href: "/dashboard/managepayment", 
      icon: <LuWallet /> 
    },
    { 
      label: "Book Appointment", 
      href: "/dashboard/patient-search-appointment", 
      icon: <RxCalendar /> 
    },
    { 
      label: "Patient Balance", 
      href: "/dashboard/patient-balance", 
      icon: <LuSearch /> 
    },
    { 
      label: "Insurance Claims", 
      href: "/dashboard/insurance-claims", 
      icon: <LuFileText /> 
    },
    { 
      label: "Reports", 
      href: "/dashboard/reports", 
      icon: <LuClipboardList /> 
    },
  ],

  // Branch Manager
  branch_manager: [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <RxDashboard />, 
      end: true 
    },
    { 
      label: "Manage Branch", 
      href: "/dashboard/manage", 
      icon: <LuBuilding2 /> 
    },
    { 
      label: "Add Doctor", 
      href: "/dashboard/adddoctor", 
      icon: <LuStethoscope /> 
    },
    { 
      label: "Add Staff", 
      href: "/dashboard/addstaff", 
      icon: <LuUserPlus /> 
    },
    { 
      label: "Manage Payments", 
      href: "/dashboard/managepayment", 
      icon: <LuWallet /> 
    },
    { 
      label: "Book Appointment", 
      href: "/dashboard/patient-search-appointment", 
      icon: <RxCalendar /> 
    },
    { 
      label: "Patient Balance", 
      href: "/dashboard/patient-balance", 
      icon: <LuSearch /> 
    },
    { 
      label: "Insurance Claims", 
      href: "/dashboard/insurance-claims", 
      icon: <LuFileText /> 
    },
    { 
      label: "Branch Reports", 
      href: "/dashboard/branch-reports", 
      icon: <LuClipboardList /> 
    },
  ],

  // Doctor
  doctor: [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <RxDashboard />, 
      end: true 
    },
    { 
      label: "Manage Schedule", 
      href: "/dashboard/doctorchange", 
      icon: <RxCalendar /> 
    },
  ],

  // Staff (Nurse, Other)
  staff: [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <RxDashboard />, 
      end: true 
    },
    { 
      label: "Staff Management", 
      href: "/dashboard/staff", 
      icon: <LuUsers /> 
    },
    { 
      label: "Manage Payments", 
      href: "/dashboard/managepayment", 
      icon: <LuWallet /> 
    },
    { 
      label: "Book Appointment", 
      href: "/dashboard/patient-search-appointment", 
      icon: <RxCalendar /> 
    },
    { 
      label: "Patient Balance", 
      href: "/dashboard/patient-balance", 
      icon: <LuSearch /> 
    },
    { 
      label: "Insurance Claims", 
      href: "/dashboard/insurance-claims", 
      icon: <LuFileText /> 
    },
  ],

  // Nurse (specific role)
  nurse: [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <RxDashboard />, 
      end: true 
    },
    { 
      label: "Staff Management", 
      href: "/dashboard/staff", 
      icon: <LuUsers /> 
    },
    { 
      label: "Manage Payments", 
      href: "/dashboard/managepayment", 
      icon: <LuWallet /> 
    },
    { 
      label: "Book Appointment", 
      href: "/dashboard/patient-search-appointment", 
      icon: <RxCalendar /> 
    },
    { 
      label: "Patient Balance", 
      href: "/dashboard/patient-balance", 
      icon: <LuSearch /> 
    },
    { 
      label: "Insurance Claims", 
      href: "/dashboard/insurance-claims", 
      icon: <LuFileText /> 
    },
  ],

  // Patient
  patient: [
    { 
      label: "Dashboard", 
      href: "/dashboard", 
      icon: <RxDashboard />, 
      end: true 
    },
    { 
      label: "Book Appointment", 
      href: "/dashboard/book-appointment", 
      icon: <RxCalendar /> 
    },
    { 
      label: "Payment History", 
      href: "/dashboard/my-payments", 
      icon: <LuWallet /> 
    },
  ],
};

export default function Leftsidebar({
  notificationsCount = 0,
  theme = "light",
}) {
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState({ name: "User", email: "user@example.com", role: "staff" });
  const [navItems, setNavItems] = useState([]);
  const navigate = useNavigate();
  const tone = theme === "dark" ? "dark" : "light";

  // Get user data from localStorage and set navigation items
  useEffect(() => {
    const userData = localStorage.getItem('catms_user');
    const userRole = localStorage.getItem('catms_role');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser({
          name: parsedUser.name || parsedUser.username || "User",
          email: parsedUser.email || "user@example.com",
          role: userRole || parsedUser.role || "staff"
        });
        
        // Set navigation items based on role
        const role = userRole || parsedUser.role || "staff";
        setNavItems(navigationByRole[role] || navigationByRole.staff);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setNavItems(navigationByRole.staff);
      }
    } else {
      setNavItems(navigationByRole.staff);
    }
  }, []);

  const toggleSidebar = () => setOpen((o) => !o);

  const handleLogout = () => {
    localStorage.removeItem('catms_token');
    localStorage.removeItem('catms_user');
    localStorage.removeItem('catms_role');
    navigate('/login');
  };

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
              <div className="user__role" style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                {user?.role?.replace('_', ' ').toUpperCase()}
              </div>
              <button type="button" className="btn btn--ghost" onClick={handleLogout}>
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
            onClick={handleLogout}
          >
            <LuLogOut size={20} />
          </button>
        )}
      </div>
    </aside>
  );
}
