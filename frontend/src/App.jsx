import { useState , useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from './pages/Login/Login'
import Home from './pages/Home/Home'
import Navibar from './compornent/NaviBar/Navibar'

function App() {

  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
      localStorage.setItem("theam", theme);
      console.log(theme);
  }, [theme])

  return (
    <>
      
      <Router>
        <Navibar theme={theme} setTheme={setTheme}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>

    </>
  )
}

export default App
