import React from 'react'
import './doctors.css'
import DoctorCard from '../../compornent/DoctorCard/DoctorCard'

const Doctors = () => {
  return (
    <div className='doctores-container'>
        <DoctorCard img='https://www.imgworldstickets.com/img-worlds-plan-your-visit/' name= 'Dr. Aisha Fernando' specialty= 'Cardiology' url ='/'/>

    </div>
  )
}

export default Doctors