// src/layouts/BaseLayout.jsx
import Navibar from "../NaviBar/Navibar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function BaseLayout({ theme, setTheme }) {
  return (
    <div className="app-layout">
      <div className="main-area">
        <Navibar theme={theme} setTheme={setTheme} />
        <main className="main-content" role="main">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}