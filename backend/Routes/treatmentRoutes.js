const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');

//***************************ADD treatment for an appointment****************** */
// Allow medical staff (Doctor, Nurse, Admin) to add treatments
router.post('/',staffAuth(['Doctor','Admin','Nurse','Super Admin','Branch Manager']), async(req, res) =>{ //TEST PASSSSS
    const {treatment_id, catalog_id, appointment_id, description} = req.body;
    
    console.log('📝 Adding treatment:', {treatment_id, catalog_id, appointment_id, description});
    
    try{
        await db.execute(`INSERT INTO treatment (treatment_id, catalog_id, appointment_id, description) VALUES (?,?,?,?)`,
            [treatment_id, catalog_id, appointment_id, description]);
        
        console.log('✅ Treatment added successfully:', treatment_id);
        res.status(201).json({message:"treatment added Successfully"});
    }catch(err){
        console.error('❌ Error adding treatment:', err);
        res.status(500).json({
            error: 'Error adding treatment', 
            message: err.message || 'Database error',
            details: err.sqlMessage || err.message
        });
    }
})

//**************************GET treatment for an appointment************************* */

router.get('/:id', authenticate, async(req, res) => { //TEST PASSSSS
    const appointment_id = req.params.id;
    
    console.log('🔍 Fetching treatments for appointment:', appointment_id);
    console.log('👤 User:', { id: req.user.id, role: req.user.role, category: req.user.category });
    
    try {
        // Get the appointment details to check if user has access
        const [appointments] = await db.execute(
            `SELECT * FROM appointment WHERE appointment_id = ?`, 
            [appointment_id]
        );
        
        if (appointments.length === 0) {
            console.log('❌ Appointment not found:', appointment_id);
            return res.status(404).json({ error: "Appointment not found" });
        }
        
        const appointment = appointments[0];
        
        // Allow access if:
        // 1. User is staff (doctor, nurse, admin, etc.)
        // 2. User is the patient who owns this appointment
        const isStaff = req.user.role === 'staff' || req.user.role === 'admin' || req.user.role === 'doctor';
        const isPatient = req.user.role === 'patient' && req.user.id === appointment.patient_id;
        
        if (!isStaff && !isPatient) {
            console.log('❌ Access denied for user:', req.user.id);
            return res.status(403).json({ error: "Access denied. You don't have permission to view this appointment's treatments." });
        }
        
        // Fetch treatments
        const [treatments] = await db.execute(
            `SELECT t.*, tc.treatment_name, tc.treatment_fee 
             FROM treatment t 
             LEFT JOIN treatment_catalog tc ON t.catalog_id = tc.catalog_id 
             WHERE t.appointment_id = ?`, 
            [appointment_id]
        );
        
        console.log(`✅ Found ${treatments.length} treatments for appointment ${appointment_id}`);
        res.json(treatments);
        
    } catch (err) {
        console.error('❌ Error fetching treatments:', err);
        res.status(500).json({ 
            error: 'Error fetching treatments',
            message: err.message 
        });
    }
});

//**************************GET treatment catalog***************************************** */

router.get('/catelog/:id',patientAuth,  async(req, res) =>{ 
    const catalog_id = req.params.id;
    try{
        const row = await db.execute(`SELECT * FROM treatment_catalog WHERE catalog_id = ?`, [catalog_id]);
        res.json(row);
    }catch(err){
        res.status(500).json({error:err});
    }
});

//****************************UPDATE balance************************** */







module.exports = router;