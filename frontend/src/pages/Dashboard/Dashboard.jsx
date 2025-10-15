import React from 'react'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
  const navigate = useNavigate();
  return (
    
    <div>
      Dashboard
      <button onClick={() => navigate('./appointmentsbook')}>
        Book Appointment
      </button>
      <br />
      <button onClick={() => navigate('./appointments')}>
        Set Appointment
      </button>
    </div>
  )
}

export default Dashboard