// src/layouts/DashboardLayout.jsx
import Sidebar from "../LeftSlideBar/LeftslideBar";
import Navibar from "../NaviBar/Navibar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ theme, setTheme }) {
  return (
    <div className="app-layout">
      <Sidebar theme={theme} />
      <div className="main-area">
        <Navibar theme={theme} setTheme={setTheme} />
        <main className="main-content main-content--dashboard" role="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}