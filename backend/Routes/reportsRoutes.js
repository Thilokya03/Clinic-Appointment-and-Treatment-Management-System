const express = require("express");
const router = express.Router();
const db = require("../db");
const { staffAuth } = require('../middlewares/auth');

// Report 1: Branch-wise appointment summary per day
router.get('/branch-appointments', staffAuth(['Admin']), async (req, res) => {
    const { date } = req.query;
    
    if (!date) {
        return res.status(400).json({ error: 'Date parameter is required' });
    }

    try {
        const [rows] = await db.execute(
            `SELECT 
                b.branch_id,
                b.name as branch_name,
                SUM(CASE WHEN a.status = 'Scheduled' THEN 1 ELSE 0 END) as scheduled_count,
                SUM(CASE WHEN a.status = 'Completed' THEN 1 ELSE 0 END) as completed_count,
                SUM(CASE WHEN a.status = 'Cancelled' THEN 1 ELSE 0 END) as cancelled_count
             FROM branch b
             LEFT JOIN staff s ON s.branch_id = b.branch_id
             LEFT JOIN doctor_schedule ds ON ds.doctor_id = s.staff_id
             LEFT JOIN appointment a ON a.schedule_id = ds.schedule_id AND a.appointment_date = ?
             WHERE s.category = 'Doctor' OR s.staff_id IS NULL
             GROUP BY b.branch_id, b.name
             ORDER BY b.name`,
            [date]
        );

        console.log('✅ Branch appointments report generated for date:', date);
        res.json(rows);
    } catch (err) {
        console.error('❌ Error generating branch appointments report:', err);
        res.status(500).json({ 
            error: 'Error generating branch appointments report',
            details: err.message 
        });
    }
});

// Report 2: Doctor-wise revenue report
router.get('/doctor-revenue', staffAuth(['Admin']), async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT 
                s.staff_id as doctor_id,
                s.name as doctor_name,
                COALESCE(SUM(p.patient_paid_amount + p.insurance_paid_amount), 0) as total_revenue
             FROM staff s
             INNER JOIN doctor d ON s.staff_id = d.staff_id
             LEFT JOIN doctor_schedule ds ON ds.doctor_id = s.staff_id
             LEFT JOIN appointment a ON a.schedule_id = ds.schedule_id
             LEFT JOIN payment p ON p.appointment_id = a.appointment_id
             WHERE s.category = 'Doctor'
             GROUP BY s.staff_id, s.name
             ORDER BY total_revenue DESC`
        );

        console.log('✅ Doctor revenue report generated');
        res.json(rows);
    } catch (err) {
        console.error('❌ Error generating doctor revenue report:', err);
        res.status(500).json({ 
            error: 'Error generating doctor revenue report',
            details: err.message 
        });
    }
});

// Report 3: List of patients with outstanding balances
router.get('/outstanding-balances', staffAuth(['Admin']), async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT 
                pt.patient_id,
                pt.name,
                pt.phone_no,
                pt.email,
                SUM(p.total_amount) as total_amount,
                SUM(p.patient_paid_amount) as patient_paid_amount,
                SUM(p.insurance_paid_amount) as insurance_paid_amount,
                SUM(p.Due_payment) as Due_payment
             FROM patient pt
             INNER JOIN payment p ON p.patient_id = pt.patient_id
             WHERE p.Due_payment > 0
             GROUP BY pt.patient_id, pt.name, pt.phone_no, pt.email
             ORDER BY Due_payment DESC`
        );

        console.log('✅ Outstanding balances report generated');
        res.json(rows);
    } catch (err) {
        console.error('❌ Error generating outstanding balances report:', err);
        res.status(500).json({ 
            error: 'Error generating outstanding balances report',
            details: err.message 
        });
    }
});

// Report 4: Number of treatments per category over a given period
router.get('/treatment-stats', staffAuth(['Admin']), async (req, res) => {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
        return res.status(400).json({ 
            error: 'Both start_date and end_date parameters are required' 
        });
    }

    try {
        const [rows] = await db.execute(
            `SELECT 
                tc.treatment_name,
                COUNT(t.treatment_id) as treatment_count
             FROM treatment_catalog tc
             LEFT JOIN treatment t ON t.catalog_id = tc.catalog_id
             LEFT JOIN appointment a ON a.appointment_id = t.appointment_id
             WHERE a.appointment_date BETWEEN ? AND ? OR a.appointment_date IS NULL
             GROUP BY tc.catalog_id, tc.treatment_name
             HAVING treatment_count > 0
             ORDER BY treatment_count DESC`,
            [start_date, end_date]
        );

        console.log('✅ Treatment statistics report generated:', { start_date, end_date });
        res.json(rows);
    } catch (err) {
        console.error('❌ Error generating treatment statistics:', err);
        res.status(500).json({ 
            error: 'Error generating treatment statistics',
            details: err.message 
        });
    }
});

// Report 5: Insurance coverage vs. out-of-pocket payments
router.get('/insurance-comparison', staffAuth(['Admin']), async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT 
                i.name as insurance_name,
                COALESCE(SUM(p.insurance_paid_amount), 0) as total_insurance_paid,
                COALESCE(SUM(p.patient_paid_amount), 0) as total_patient_paid
             FROM insurance i
             LEFT JOIN insurance_claim ic ON ic.insurance_id = i.insurance_id
             LEFT JOIN payment p ON p.payment_id = ic.payment_id
             GROUP BY i.insurance_id, i.name
             
             UNION ALL
             
             SELECT 
                'No Insurance' as insurance_name,
                0 as total_insurance_paid,
                COALESCE(SUM(p.patient_paid_amount), 0) as total_patient_paid
             FROM payment p
             LEFT JOIN insurance_claim ic ON ic.payment_id = p.payment_id
             WHERE ic.claim_id IS NULL
             
             ORDER BY total_insurance_paid DESC`
        );

        console.log('✅ Insurance comparison report generated');
        res.json(rows);
    } catch (err) {
        console.error('❌ Error generating insurance comparison report:', err);
        res.status(500).json({ 
            error: 'Error generating insurance comparison report',
            details: err.message 
        });
    }
});

// Summary dashboard - All key metrics at once
router.get('/summary', staffAuth(['Admin']), async (req, res) => {
    try {
        // Get total appointments
        const [appointments] = await db.execute(
            `SELECT COUNT(*) as total FROM appointment`
        );

        // Get total revenue
        const [revenue] = await db.execute(
            `SELECT COALESCE(SUM(patient_paid_amount + insurance_paid_amount), 0) as total 
             FROM payment`
        );

        // Get outstanding balance
        const [outstanding] = await db.execute(
            `SELECT COALESCE(SUM(Due_payment), 0) as total 
             FROM payment 
             WHERE Due_payment > 0`
        );

        // Get total patients
        const [patients] = await db.execute(
            `SELECT COUNT(*) as total FROM patient`
        );

        // Get total doctors
        const [doctors] = await db.execute(
            `SELECT COUNT(*) as total FROM doctor`
        );

        // Get total branches
        const [branches] = await db.execute(
            `SELECT COUNT(*) as total FROM branch`
        );

        const summary = {
            total_appointments: appointments[0].total,
            total_revenue: parseFloat(revenue[0].total),
            outstanding_balance: parseFloat(outstanding[0].total),
            total_patients: patients[0].total,
            total_doctors: doctors[0].total,
            total_branches: branches[0].total
        };

        console.log('✅ Summary report generated');
        res.json(summary);
    } catch (err) {
        console.error('❌ Error generating summary report:', err);
        res.status(500).json({ 
            error: 'Error generating summary report',
            details: err.message 
        });
    }
});

module.exports = router;
