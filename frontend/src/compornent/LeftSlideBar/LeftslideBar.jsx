import { useState } from "react";
import "./leftsidebar.css";
import { RxDashboard } from "react-icons/rx";



export default function CATMSSidebar({
    navItems = [
        { label: "Dashboard", href: "#" },
        { label: "Patients", href: "#" },
        { label: "Appointments", href: "#" },
    ],
    user = { name: "User", email: "user@example.com" },
    notificationsCount = 0,
    onLogout = () => { },
}) {
    const [open, setOpen] = useState(true);


    return (
        <aside className={`sidebar ${open ? "open" : "collapsed"}`}>
            {/* Brand */}
            <div className="sidebar-header">
                <button
                    className="sidebar-toggle"
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Toggle sidebar"
                >
                    <RxDashboard size={24} />
                    {/* {open ? "←" : "→"} */}
                </button>
            </div>


            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <a key={item.label} href={item.href} className="sidebar-link">
                        {item.label}
                    </a>
                ))}
            </nav>


            {/* Footer Actions */}
            <div className="sidebar-footer">
                <div className="notifications" title="Notifications">
                    🔔<span className="badge">{notificationsCount}</span>
                </div>
                <div className="user-profile">
                    <div className="avatar">{user?.name?.[0] || "U"}</div>
                    {open && (
                        <div className="user-info">
                            <p className="user-name">{user.name}</p>
                            <p className="user-email">{user.email}</p>
                            <button onClick={onLogout} className="logout-btn">
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}