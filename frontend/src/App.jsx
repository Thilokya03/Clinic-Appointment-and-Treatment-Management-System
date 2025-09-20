import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navibar from "./compornent/NaviBar/Navibar"
import Sidebar from "./compornent/LeftSlideBar/LeftslideBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />
        <div className="main-area">
          <Navibar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
