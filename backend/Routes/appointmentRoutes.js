const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, staffAuth, patientAuth, appointmentAccess } = require('../middlewares/auth');

//******************************** GET Appointments ********************************* */
router.get('/', appointmentAccess, async (req, res) => {
    try {
        let query;
        let params = [];

        if (req.user.role === 'patient') {
            // If patient, only show their appointments
            query = `
                SELECT 
                    a.*,
                    s.name as doctor_name,
                    b.name as branch_name,
                    ds.doctor_id as staff_id,
                    ds.start_time,
                    ds.end_time
                FROM appointment a
                LEFT JOIN doctor_schedule ds ON a.schedule_id = ds.schedule_id
                LEFT JOIN staff s ON ds.doctor_id = s.staff_id
                LEFT JOIN branch b ON s.branch_id = b.branch_id
                WHERE a.patient_id = ?
                ORDER BY a.appointment_date DESC
            `;
            params = [req.user.id];
        } else {
            // If staff, show all appointments they have access to
            query = `
                SELECT 
                    a.*,
                    s.name as doctor_name,
                    b.name as branch_name,
                    p.name as patient_name,
                    ds.doctor_id as staff_id,
                    ds.start_time,
                    ds.end_time
                FROM appointment a
                LEFT JOIN doctor_schedule ds ON a.schedule_id = ds.schedule_id
                LEFT JOIN staff s ON ds.doctor_id = s.staff_id
                LEFT JOIN branch b ON s.branch_id = b.branch_id
                LEFT JOIN patient p ON a.patient_id = p.patient_id
                ORDER BY a.appointment_date DESC
            `;
        }

        const [rows] = await db.execute(query, params);
        console.log('✅ Fetched appointments:', rows.length);
        res.json(rows);
    } catch (err) {
        console.error('❌ Error fetching appointments:', err);
        res.status(500).json({ error: 'Error fetching appointments', details: err.message });
    }
});

//******************************** GET Available Time Slots ********************************* */
router.get('/available-slots', authenticate, async (req, res) => {
    try {
        const { doctorId, date } = req.query;
        
        if (!doctorId || !date) {
            return res.status(400).json({ error: 'Please provide doctorId and date' });
        }

        // Parse the date to get just the date part (YYYY-MM-DD)
        const appointmentDate = new Date(date).toISOString().split('T')[0];
        
        console.log('🔍 Finding available slots for doctor:', doctorId, 'on date:', appointmentDate);

        // Get the doctor's schedule for the specified date
        const [schedules] = await db.execute(
            `SELECT schedule_id, start_time, end_time, max_patients, date, doctor_id
             FROM doctor_schedule
             WHERE doctor_id = ? AND date = ?`,
            [doctorId, appointmentDate]
        );

        console.log('🔍 Query params - doctorId:', doctorId, 'appointmentDate:', appointmentDate);
        console.log('🔍 Schedules found:', schedules.length, schedules);

        if (schedules.length === 0) {
            // Let's check what schedules exist for this doctor
            const [allSchedules] = await db.execute(
                `SELECT schedule_id, doctor_id, date, start_time, end_time 
                 FROM doctor_schedule 
                 WHERE doctor_id = ?`,
                [doctorId]
            );
            console.log('🔍 All schedules for this doctor:', allSchedules);
            return res.json({ slots: [], message: 'No schedule found for this doctor on this date' });
        }

        const schedule = schedules[0];
        
        // Get existing appointments for this schedule
        const [appointments] = await db.execute(
            `SELECT COUNT(*) as count FROM appointment WHERE schedule_id = ?`,
            [schedule.schedule_id]
        );

        const bookedCount = appointments[0].count;
        
        // Check if slots are available
        if (bookedCount >= schedule.max_patients) {
            return res.json({ slots: [], message: 'All slots are booked for this date' });
        }

        // Generate available time slots (simplified - returning start time)
        const slots = [schedule.start_time];
        
        res.json({ 
            slots,
            schedule_id: schedule.schedule_id,
            available: schedule.max_patients - bookedCount,
            total: schedule.max_patients
        });
        
    } catch (err) {
        console.error('❌ Error getting available slots:', err);
        res.status(500).json({ error: 'Error getting available slots', details: err.message });
    }
});

//********************************ADD new appointment********************************* */
router.post('/', authenticate, async(req, res) =>{ 
    const {appointment_id, patient_id, schedule_id, status, appointment_date, notes, appointment_fee} = req.body;
    
    // Validation
    if (!appointment_id || !patient_id || !schedule_id || !appointment_date) {
        return res.status(400).json({error: 'Please provide all required fields (appointment_id, patient_id, schedule_id, appointment_date)'});
    }
    
    try{
        // Check if schedule exists
        const [schedule] = await db.execute(
            `SELECT ds.*, s.name as doctor_name 
             FROM doctor_schedule ds
             JOIN staff s ON ds.doctor_id = s.staff_id
             WHERE ds.schedule_id = ?`,
            [schedule_id]
        );
        
        if (schedule.length === 0) {
            return res.status(404).json({error: 'Schedule not found'});
        }
        
        // Check if patient exists
        const [patient] = await db.execute(
            `SELECT * FROM patient WHERE patient_id = ?`,
            [patient_id]
        );
        
        if (patient.length === 0) {
            return res.status(404).json({error: 'Patient not found'});
        }

        // Check if schedule has available slots
        const [appointmentCount] = await db.execute(
            `SELECT COUNT(*) as count FROM appointment WHERE schedule_id = ?`,
            [schedule_id]
        );

        if (appointmentCount[0].count >= schedule[0].max_patients) {
            return res.status(400).json({error: 'No available slots for this schedule'});
        }
        
        await db.execute(
            `INSERT INTO appointment (appointment_id, patient_id, schedule_id, status, appointment_date, notes, appointment_fee) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [appointment_id, patient_id, schedule_id, status || 'Scheduled', appointment_date, notes, appointment_fee || 300.00]
        );
        
        console.log('✅ Appointment created:', {
            appointment_id,
            patient_id,
            schedule_id,
            appointment_date
        });
        
        res.status(201).json({
            message: "Appointment added successfully",
            appointment_id
        });
    }catch(err){
        console.error('❌ Error creating appointment:', err);
        console.error('SQL Error:', err.sqlMessage);
        res.status(500).json({error: 'Error creating appointment', details: err.message, sqlError: err.sqlMessage});
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

