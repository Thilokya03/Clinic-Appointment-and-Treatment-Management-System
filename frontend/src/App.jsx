import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import './App.css'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Register from './pages/Register/Register';
import Navibar from './compornent/NaviBar/Navibar'
=======
import Navibar from "./compornent/NaviBar/Navibar"
import Sidebar from "./compornent/LeftSlideBar/LeftslideBar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import "./App.css";
>>>>>>> b0202a85e2db274e555d59e946aacf197c12b0a5

function App() {
  return (
<<<<<<< HEAD
    <>
      
      <Router>
        <Navibar theme={theme} setTheme={setTheme}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>

    </>
  )
=======
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
>>>>>>> b0202a85e2db274e555d59e946aacf197c12b0a5
}

export default App;
