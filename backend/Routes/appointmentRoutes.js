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
    
    console.log('📝 Received appointment data:', {
        appointment_id,
        patient_id,
        schedule_id,
        status,
        appointment_date,
        notes,
        appointment_fee,
        user: req.user
    });
    
    // Get patient_id - use from body if provided, otherwise from authenticated user
    const finalPatientId = patient_id || req.user.id;
    
    // Validation
    if (!appointment_id || !finalPatientId || !schedule_id || !appointment_date) {
        console.log('❌ Validation failed:', {
            appointment_id: !!appointment_id,
            finalPatientId: !!finalPatientId,
            schedule_id: !!schedule_id,
            appointment_date: !!appointment_date
        });
        return res.status(400).json({
            error: 'Please provide all required fields (appointment_id, patient_id, schedule_id, appointment_date)',
            received: { appointment_id, finalPatientId, schedule_id, appointment_date }
        });
    }
    
    try{
        // Check if schedule exists and is active
        const [schedule] = await db.execute(
            `SELECT ds.*, s.branch_id, 
             (SELECT COUNT(*) FROM appointment WHERE schedule_id = ds.schedule_id) as booked_patients
             FROM doctor_schedule ds
             INNER JOIN staff s ON ds.doctor_id = s.staff_id
             WHERE ds.schedule_id = ? AND ds.status = 'ACTIVE'`,
            [schedule_id]
        );
        
        if (schedule.length === 0) {
            return res.status(404).json({error: 'Schedule not found or inactive'});
        }
        
        // Check if schedule still has available slots
        if (schedule[0].booked_patients >= schedule[0].max_patients) {
            return res.status(400).json({error: 'No available slots for this schedule'});
        }
        
        // Check if patient exists
        const [patient] = await db.execute(
            `SELECT * FROM patient WHERE patient_id = ?`,
            [finalPatientId]
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
        
        // Insert appointment without start_time and end_time (they come from doctor_schedule)
        await db.execute(
            `INSERT INTO appointment (appointment_id, patient_id, schedule_id, status, appointment_date, notes, appointment_fee) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [appointment_id, finalPatientId, schedule_id, status || 'Scheduled', appointment_date, notes, appointment_fee || 0.00]
        );
        
        console.log('✅ Appointment created:', {
            appointment_id,
            patient_id: finalPatientId,
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
    console.log('🔍 Fetching appointments for doctor:', doctor_id);
    console.log('👤 User object:', req.user);
    
    try{
        const [row] = await db.execute(
            `SELECT 
                a.appointment_id,
                a.patient_id,
                a.status,
                a.appointment_date,
                a.start_time,
                a.end_time,
                a.notes,
                a.appointment_fee,
                a.schedule_id,
                p.name as patient_name,
                p.phone_no as patient_phone,
                p.nic as patient_nic,
                ds.doctor_id,
                ds.fee as schedule_fee
             FROM appointment a 
             INNER JOIN doctor_schedule ds ON a.schedule_id = ds.schedule_id
             LEFT JOIN patient p ON a.patient_id = p.patient_id 
             WHERE ds.doctor_id = ? 
             ORDER BY a.appointment_date DESC, a.start_time DESC`, 
            [doctor_id]
        );
        
        console.log('✅ Found appointments:', row.length);
        res.json(row);
    }catch(err){
        console.error('❌ Error fetching appointments:', err);
        res.status(500).json({error: "Error fetching appointments", details: err.message});
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

router.put('/:id', staffAuth(['Doctor', 'Admin']), async(req, res) => {
    const appointment_id = req.params.id;
    const { appointment_date, start_time, end_time, notes, status } = req.body;
    
    try {
        // Check if appointment exists
        const [existing] = await db.execute(
            `SELECT * FROM appointment WHERE appointment_id = ?`,
            [appointment_id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        // Build update query dynamically based on provided fields
        let updateFields = [];
        let values = [];
        
        if (appointment_date) {
            updateFields.push('appointment_date = ?');
            values.push(appointment_date);
        }
        if (start_time) {
            updateFields.push('start_time = ?');
            values.push(start_time);
        }
        if (end_time) {
            updateFields.push('end_time = ?');
            values.push(end_time);
        }
        if (notes !== undefined) {
            updateFields.push('notes = ?');
            values.push(notes);
        }
        if (status) {
            updateFields.push('status = ?');
            values.push(status);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        values.push(appointment_id);
        
        await db.execute(
            `UPDATE appointment SET ${updateFields.join(', ')} WHERE appointment_id = ?`,
            values
        );
        
        console.log('✅ Appointment updated:', { appointment_id, fields: updateFields });
        
        res.json({ message: 'Appointment updated successfully' });
    } catch (err) {
        console.error('Error updating appointment:', err);
        res.status(500).json({ error: 'Error updating appointment', details: err.message });
    }
});

//********************************* GET all appointments (for staff) ********************************* */

router.get('/', authenticate, async(req, res) => {
    try {
        const [rows] = await db.execute(`SELECT * FROM appointment ORDER BY appointment_date DESC, start_time DESC`);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching all appointments:', err);
        res.status(500).json({ error: 'Error fetching appointments' });
    }
});

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

