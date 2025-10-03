import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register';
import Navibar from './compornent/NaviBar/Navibar'
import Sidebar from "./compornent/LeftSlideBar/LeftslideBar";
import  Doctors  from "./pages/Doctor/Doctors";
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
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<Doctors />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
