const express = require("express");
const router = express.Router();
const db = require("../db");
const { staffAuth, authenticate } = require('../middlewares/auth');

// Generate next schedule_id like DS0001, DS0002, ...
const generateScheduleId = async () => {
    const [rows] = await db.execute(
        `SELECT MAX(CAST(SUBSTRING(schedule_id, 3) AS UNSIGNED)) AS maxId FROM doctor_schedule`
    );
    const max = rows && rows[0] && rows[0].maxId ? Number(rows[0].maxId) : 0;
    const next = max + 1;
    return 'DS' + String(next).padStart(4, '0');
}

// Helper to map frontend field names to database column names
const mapFrontendToDb = (data) => {
    return {
        doctor_id: data.staff_id || data.doctor_id,
        date: data.schedule_date || data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        max_patients: data.max_patients || 10,
        fee: data.fee || 0.00
    };
}

//*************************** GET all doctor schedules ******************
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT 
                ds.schedule_id,
                ds.doctor_id as staff_id,
                s.name as doctor_name,
                ds.speciality,
                s.branch_id,
                b.name as branch_name,
                ds.date as schedule_date,
                ds.start_time,
                ds.end_time,
                ds.status,
                ds.max_patients,
                ds.fee,
                (SELECT COUNT(*) FROM appointment WHERE schedule_id = ds.schedule_id) as booked_patients
             FROM doctor_schedule ds
             INNER JOIN staff s ON ds.doctor_id = s.staff_id
             LEFT JOIN branch b ON s.branch_id = b.branch_id
             ORDER BY ds.date DESC, ds.start_time ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error('❌ Error fetching doctor schedules:', err);
        console.error('Error details:', err.message);
        res.status(500).json({ error: 'Error fetching doctor schedules', details: err.message });
    }
});

//*************************** GET schedules by doctor ******************
// Allow all authenticated users (including patients) to view doctor schedules for appointment booking
router.get('/doctor/:staff_id', authenticate, async (req, res) => {
    const { staff_id } = req.params;
    try {
        const [rows] = await db.execute(
            `SELECT 
                ds.schedule_id,
                ds.doctor_id as staff_id,
                s.name as doctor_name,
                ds.speciality,
                s.branch_id,
                b.name as branch_name,
                ds.date as schedule_date,
                ds.start_time,
                ds.end_time,
                ds.status,
                ds.max_patients,
                ds.fee,
                (SELECT COUNT(*) FROM appointment WHERE schedule_id = ds.schedule_id) as booked_patients
             FROM doctor_schedule ds
             INNER JOIN staff s ON ds.doctor_id = s.staff_id
             LEFT JOIN branch b ON s.branch_id = b.branch_id
             WHERE ds.doctor_id = ?
             ORDER BY ds.date DESC, ds.start_time ASC`,
            [staff_id]
        );
        res.json(rows);
    } catch (err) {
        console.error('❌ Error fetching doctor schedules:', err);
        res.status(500).json({ error: 'Error fetching doctor schedules' });
    }
});

//*************************** GET available schedules (for patients) ******************
router.get('/available', async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT 
                ds.schedule_id,
                ds.doctor_id as staff_id,
                s.name as doctor_name,
                ds.speciality,
                s.branch_id,
                b.name as branch_name,
                ds.date as schedule_date,
                ds.start_time,
                ds.end_time,
                ds.status,
                ds.max_patients,
                ds.fee,
                (SELECT COUNT(*) FROM appointment WHERE schedule_id = ds.schedule_id) as booked_patients
             FROM doctor_schedule ds
             INNER JOIN staff s ON ds.doctor_id = s.staff_id
             LEFT JOIN branch b ON s.branch_id = b.branch_id
             WHERE ds.status = 'ACTIVE' 
             AND ds.date >= CURDATE()
             AND (SELECT COUNT(*) FROM appointment WHERE schedule_id = ds.schedule_id) < ds.max_patients
             ORDER BY ds.date ASC, ds.start_time ASC`
        );
        res.json(rows);
    } catch (err) {
        console.error('❌ Error fetching available schedules:', err);
        res.status(500).json({ error: 'Error fetching available schedules' });
    }
});

//*************************** GET schedule by ID ******************
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            `SELECT 
                ds.schedule_id,
                ds.doctor_id as staff_id,
                s.name as doctor_name,
                ds.speciality,
                s.branch_id,
                b.name as branch_name,
                ds.date as schedule_date,
                ds.start_time,
                ds.end_time,
                ds.status,
                ds.max_patients,
                ds.fee,
                (SELECT COUNT(*) FROM appointment WHERE schedule_id = ds.schedule_id) as booked_patients
             FROM doctor_schedule ds
             INNER JOIN staff s ON ds.doctor_id = s.staff_id
             LEFT JOIN branch b ON s.branch_id = b.branch_id
             WHERE ds.schedule_id = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('❌ Error fetching schedule:', err);
        res.status(500).json({ error: 'Error fetching schedule' });
    }
});

//*************************** ADD doctor schedule ******************
router.post('/', staffAuth(['Admin', 'Branch Manager', 'Doctor', 'Nurse', 'Other']), async (req, res) => {
    const { staff_id, branch_id, schedule_date, start_time, end_time, max_patients, notes, fee } = req.body;

    if (!staff_id || !schedule_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'Please provide staff_id (doctor_id), schedule_date (date), start_time, and end_time' });
    }

    try {
        // Verify doctor exists and get speciality
        const [doctor] = await db.execute(
            `SELECT s.staff_id, s.name, s.branch_id, d.speciality 
             FROM staff s
             INNER JOIN doctor d ON s.staff_id = d.staff_id
             WHERE s.staff_id = ? AND s.category = "Doctor"`,
            [staff_id]
        );

        if (doctor.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const doctorInfo = doctor[0];
        const speciality = doctorInfo.speciality;
        const actualBranchId = doctorInfo.branch_id;

        // Check for overlapping schedules
        const [overlap] = await db.execute(
            `SELECT * FROM doctor_schedule 
             WHERE doctor_id = ? 
             AND date = ? 
             AND status = 'ACTIVE'
             AND (
                 (start_time <= ? AND end_time > ?) OR
                 (start_time < ? AND end_time >= ?) OR
                 (start_time >= ? AND end_time <= ?)
             )`,
            [staff_id, schedule_date, start_time, start_time, end_time, end_time, start_time, end_time]
        );

        if (overlap.length > 0) {
            return res.status(400).json({ error: 'Doctor already has a schedule during this time' });
        }

        // Generate new schedule ID
        const newScheduleId = await generateScheduleId();

        // Convert fee to number and ensure it's a valid decimal
        const feeValue = fee ? parseFloat(fee) : 0.00;
        const maxPatientsValue = max_patients ? parseInt(max_patients) : 10;

        console.log('📋 Inserting schedule with values:', {
            newScheduleId,
            staff_id,
            speciality,
            schedule_date,
            start_time,
            end_time,
            feeValue,
            maxPatientsValue
        });

        // Insert new schedule with actual database columns
        await db.execute(
            `INSERT INTO doctor_schedule (schedule_id, doctor_id, speciality, date, start_time, end_time, fee, status, max_patients) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)`,
            [newScheduleId, staff_id, speciality, schedule_date, start_time, end_time, feeValue, maxPatientsValue]
        );

        console.log('✅ Doctor schedule added:', { schedule_id: newScheduleId, doctor_id: staff_id, date: schedule_date, start_time, speciality, fee });
        res.status(201).json({ 
            message: 'Doctor schedule added successfully',
            schedule_id: newScheduleId,
            data: {
                schedule_id: newScheduleId,
                staff_id,
                branch_id: actualBranchId,
                schedule_date,
                start_time,
                end_time,
                fee: fee || 0.00,
                max_patients: max_patients || 10,
                speciality,
                status: 'Available'
            }
        });
    } catch (err) {
        console.error('❌ Error adding doctor schedule:', err);
        console.error('Error details:', {
            message: err.message,
            code: err.code,
            sqlMessage: err.sqlMessage,
            sql: err.sql
        });
        res.status(500).json({ 
            error: 'Error adding doctor schedule',
            details: err.sqlMessage || err.message
        });
    }
});

//*************************** UPDATE schedule status ******************
router.put('/:id/status', staffAuth(['Admin', 'Branch Manager', 'Doctor', 'Nurse', 'Other']), async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Available', 'Cancelled', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be Available, Cancelled, or Completed' });
    }

    try {
        // Check if schedule exists
        const [existing] = await db.execute(
            `SELECT * FROM doctor_schedule WHERE schedule_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // Map frontend status to database ENUM
        const statusMap = {
            'Available': 'ACTIVE',
            'Cancelled': 'INACTIVE',
            'Completed': 'INACTIVE'
        };
        const dbStatus = statusMap[status];

        // If cancelling, also update related appointments
        if (status === 'Cancelled') {
            await db.execute(
                `UPDATE appointment SET status = 'Cancelled' WHERE schedule_id = ? AND status = 'Scheduled'`,
                [id]
            );
        }

        // Update schedule status with database ENUM value
        await db.execute(
            `UPDATE doctor_schedule SET status = ? WHERE schedule_id = ?`,
            [dbStatus, id]
        );

        console.log('✅ Schedule status updated:', { schedule_id: id, frontend_status: status, db_status: dbStatus });
        res.json({ message: 'Schedule status updated successfully' });
    } catch (err) {
        console.error('❌ Error updating schedule status:', err);
        res.status(500).json({ error: 'Error updating schedule status' });
    }
});

//*************************** RESCHEDULE ******************
router.put('/:id/reschedule', staffAuth(['Admin', 'Branch Manager', 'Doctor']), async (req, res) => {
    const { id } = req.params;
    const { schedule_date, start_time, end_time } = req.body;

    if (!schedule_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'Please provide schedule_date (date), start_time, and end_time' });
    }

    try {
        // Check if schedule exists
        const [existing] = await db.execute(
            `SELECT * FROM doctor_schedule WHERE schedule_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const schedule = existing[0];

        // Check for overlapping schedules (excluding current schedule)
        const [overlap] = await db.execute(
            `SELECT * FROM doctor_schedule 
             WHERE doctor_id = ? 
             AND date = ? 
             AND schedule_id != ?
             AND status = 'ACTIVE'
             AND (
                 (start_time <= ? AND end_time > ?) OR
                 (start_time < ? AND end_time >= ?) OR
                 (start_time >= ? AND end_time <= ?)
             )`,
            [schedule.doctor_id, schedule_date, id, start_time, start_time, end_time, end_time, start_time, end_time]
        );

        if (overlap.length > 0) {
            return res.status(400).json({ error: 'Doctor already has a schedule during this time' });
        }

        // Update schedule with actual column name 'date'
        await db.execute(
            `UPDATE doctor_schedule 
             SET date = ?, start_time = ?, end_time = ? 
             WHERE schedule_id = ?`,
            [schedule_date, start_time, end_time, id]
        );

        console.log('✅ Schedule rescheduled:', { schedule_id: id, date: schedule_date, start_time });
        res.json({ message: 'Schedule rescheduled successfully' });
    } catch (err) {
        console.error('❌ Error rescheduling:', err);
        res.status(500).json({ error: 'Error rescheduling' });
    }
});

//*************************** DELETE schedule ******************
router.delete('/:id', staffAuth(['Admin', 'Branch Manager', 'Doctor']), async (req, res) => {
    const { id } = req.params;

    try {
        // Check if schedule exists
        const [existing] = await db.execute(
            `SELECT * FROM doctor_schedule WHERE schedule_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        // If user is a doctor, verify they own this schedule
        if (req.user.role === 'doctor' && existing[0].doctor_id !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own schedules' });
        }

        // Check if there are appointments
        const [appointments] = await db.execute(
            `SELECT COUNT(*) as count FROM appointment WHERE schedule_id = ?`,
            [id]
        );

        if (appointments[0].count > 0) {
            return res.status(400).json({ 
                error: 'Cannot delete schedule with existing appointments. Please cancel it instead.' 
            });
        }

        // Delete schedule
        await db.execute(
            `DELETE FROM doctor_schedule WHERE schedule_id = ?`,
            [id]
        );

        console.log('✅ Schedule deleted:', { schedule_id: id });
        res.json({ message: 'Schedule deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting schedule:', err);
        res.status(500).json({ error: 'Error deleting schedule' });
    }
});

module.exports = router;
