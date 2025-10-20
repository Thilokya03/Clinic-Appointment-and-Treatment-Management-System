const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');

//********************************ADD new appointment********************************* */
router.post('/', authenticate, async(req, res) =>{ 
    const {appointment_id, patient_id, doctor_id, status, appointment_date, start_time, end_time, notes, appointment_fee} = req.body;
    
    // Validation
    if (!appointment_id || !patient_id || !doctor_id || !appointment_date || !start_time || !end_time) {
        return res.status(400).json({error: 'Please provide all required fields'});
    }
    
    try{
        // Check if doctor exists
        const [doctor] = await db.execute(
            `SELECT * FROM doctor WHERE staff_id = ?`,
            [doctor_id]
        );
        
        if (doctor.length === 0) {
            return res.status(404).json({error: 'Doctor not found'});
        }
        
        // Check if patient exists
        const [patient] = await db.execute(
            `SELECT * FROM patient WHERE patient_id = ?`,
            [patient_id]
        );
        
        if (patient.length === 0) {
            return res.status(404).json({error: 'Patient not found'});
        }
        
        await db.execute(
            `INSERT INTO appointment (appointment_id, patient_id, doctor_id, status, appointment_date, start_time, end_time, notes, appointment_fee) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [appointment_id, patient_id, doctor_id, status || 'Scheduled', appointment_date, start_time, end_time, notes, appointment_fee || 0.00]
        );
        
        console.log('✅ Appointment created:', {
            appointment_id,
            patient_id,
            doctor_id,
            appointment_date,
            start_time
        });
        
        res.status(201).json({
            message: "Appointment added successfully",
            appointment_id
        });
    }catch(err){
        console.error('Error creating appointment:', err);
        res.status(500).json({error: 'Error creating appointment', details: err.message});
    }
});

//********************************GET all appontment of a patient ********************************* */

router.get('/patient/:id', authenticate, async(req, res) =>{ 
    if(req.user.id !== req.params.id && req.user.role !== 'staff'){
        return res.status(403).json({error:"access denied"});
    }
    const patient_id = req.params.id;
    console.log(req.user);
    try{
        const [rows] = await db.execute(`SELECT * FROM appointment WHERE patient_id = ?`, [patient_id]);
        res.json([rows])
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//********************************GET all appontment of a doctor ********************************* */

router.get('/doctor/:id',staffAuth(['Doctor', 'Admin']), async(req, res) =>{//TEST PASSSSSSSSSSSS
    const doctor_id = req.user.id;
    try{
        const [row] = await db.execute(`SELECT * FROM appointment WHERE doctor_id = ?`, [doctor_id]);
        res.json(row)
    }catch(err){
        res.status(500).json({error: "errer fetching appointments"});
    }
});

//*********************************GET an appointment************************************* */

router.get('/:id',patientAuth, async(req, res) =>{ // TEST PASSSSSSSS
    const appointment_id = req.params.id;
    try{
        const [row] = await db.execute(`SELECT * FROM appointment WHERE appointment_id = ?`, [appointment_id]);
        res.json(row)
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//*********************************UPDATE/RESCEDULE appointment******************************* */












//********************************* DELETE an appointment******************************************/

router.delete('/:id',staffAuth(['doctor', 'admin']), async(req, res) => {
    const appointment_id = req.params.id;
    try{
        await db.execute(`DELETE FROM appointment WHERE appointment_id = ?`, [appointment_id]);
        res.status(200).json({message: "appointment successfully deleted"});
    }catch(err){
        res.status(500).json({error:err})
    }
});


module.exports = router;

