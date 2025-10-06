const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');

//********************************ADD new appointment********************************* */
router.post('/',patientAuth, async(req, res) =>{
    const {appointment_id, patient_id, doctor_id, status, appointment_date, start_time, end_time, notes, appointment_fee} = req.body;
    try{
        await db.execute(`INSERT INTO appointment (appointment_id, patient_id, doctor_id, status, appontment_date, start_time, end_time, notes, appointment_fee) VALUES (?, ?, ?,?, ?, ?,?, ?, ?)`, 
            [appointment_id, patient_id, doctor_id, status, appointment_date, start_time, end_time, notes, appointment_fee]);
        res.status(201).json({message:"appointment added Successfully"});
    }catch(err){
        res.status(500).json({error:err});
    }
});

//*********************************GET an appointment************************************* */

router.get('/:id', async(req, res) =>{
    const appointment_id = req.params.id;
    try{
        const row = await db.execute(`SELECT * FROM appointment WHERE appointment_id = ?`, [appointment_id]);
        res.json(row)
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//********************************GET all appontment of a patient ********************************* */

router.get('/patient',patientAuth, async(req, res) =>{
    const patient_id = req.user.id;
    try{
        const row = await db.execute(`SELECT * FROM appointment WHERE patient_id = ?`, [patient_id]);
        res.json(row)
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

//********************************GET all appontment of a doctor ********************************* */

router.get('/doctor',staffAuth(['Doctor', 'Admin']), async(req, res) =>{
    const doctor_id = req.user.id;
    try{
        const row = await db.execute(`SELECT * FROM appointment WHERE doctor_id = ?`, [doctor_id]);
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

