const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const { message } = require("statuses");
const { route } = require("./patientRoutes");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');


// ******************************** GET All Branches ****************************
router.get('/', staffAuth(['Admin', 'Branch Manager', 'Super Admin']), async(req, res) =>{
    try{
        const [rows] = await db.execute(`
            SELECT b.*, s.name as manager_name, s.staff_id as manager_id
            FROM branch b
            LEFT JOIN staff s ON b.manager_id = s.staff_id
            ORDER BY b.branch_id
        `);
        console.log('✅ Fetched branches:', rows.length);
        res.json(rows);
    }catch(err){
        console.error('❌ Error fetching branches:', err);
        res.status(500).json({error: 'Error fetching branches', details: err.message});
    }
});

// ******************************** GET Branch Statistics ****************************
router.get('/stats', staffAuth(['Admin', 'Super Admin']), async(req, res) =>{
    try{
        // Get total branches
        const [branchCount] = await db.execute(`SELECT COUNT(*) as count FROM branch`);
        
        // Get total branch managers from staff table
        const [managerCount] = await db.execute(`
            SELECT COUNT(*) as count 
            FROM staff 
            WHERE category = 'Branch Manager'
        `);
        
        // Get total doctors from staff table
        const [doctorCount] = await db.execute(`
            SELECT COUNT(*) as count 
            FROM staff 
            WHERE category = 'Doctor'
        `);
        
        // Get total patients
        const [patientCount] = await db.execute(`SELECT COUNT(*) as count FROM patient`);
        
        console.log('📊 Stats:', {
            totalBranches: branchCount[0].count,
            branchManagers: managerCount[0].count,
            totalDoctors: doctorCount[0].count,
            totalPatients: patientCount[0].count
        });
        
        res.json({
            totalBranches: branchCount[0].count,
            branchManagers: managerCount[0].count,
            totalDoctors: doctorCount[0].count,
            totalPatients: patientCount[0].count
        });
    }catch(err){
        console.error('❌ Error fetching stats:', err);
        res.status(500).json({error: 'Error fetching statistics', details: err.message});
    }
});

// ******************************** ADD Branch ****************************
router.post('/', staffAuth(['Admin', 'Super Admin']), async(req, res) =>{ 
    const {name, address, phone_no, email} = req.body;
    
    if (!name || !address) {
        return res.status(400).json({error: 'Please provide name and address'});
    }
    
    try{
        // Auto-generate Branch ID
        const [branches] = await db.execute(`SELECT branch_id FROM branch ORDER BY branch_id DESC LIMIT 1`);
        
        let newBranchId;
        if (branches.length === 0) {
            newBranchId = 'B0001';
        } else {
            const lastId = branches[0].branch_id;
            const numericPart = parseInt(lastId.substring(1));
            newBranchId = `B${String(numericPart + 1).padStart(4, '0')}`;
        }
        
        // Insert new branch with auto-generated ID
        await db.execute(
            `INSERT INTO branch (branch_id, name, address, phone_no, email) VALUES (?, ?, ?, ?, ?)`, 
            [newBranchId, name, address, phone_no || null, email || null]
        );
        
        console.log('✅ Branch created:', { branch_id: newBranchId, name, phone_no, email });
        res.status(201).json({
            message: "Branch added successfully",
            branch_id: newBranchId
        });
    }catch(err){
        console.error('Error creating branch:', err);
        res.status(500).json({error: 'Error creating branch'});
    }
});

// router.get('/', async(req, res) =>{
//     try{
//         const rows = await db.execute(`SELECT * FROM branch`);
//         res.json(rows)
//     }catch(err){
//         res.status(500).json({error: err.message});
//     }
// });


// ******************************** get branch by id ****************************
router.get('/:id', staffAuth(['Admin', 'Branch Manager', 'Super Admin']), async(req, res) =>{ 
    const branch_id = req.params.id;
    try{
        const [row] = await db.execute(`
            SELECT b.*, s.name as manager_name, s.staff_id as manager_id, s.email as manager_email
            FROM branch b
            LEFT JOIN staff s ON b.manager_id = s.staff_id
            WHERE b.branch_id = ?
        `, [branch_id]);
        
        if(row.length === 0){
            return res.status(404).json({error: "Branch not found"});
        }
        res.json(row[0]);
    }catch(err){
        console.error('Error getting branch:', err);
        res.status(500).json({error: "Error getting branch"});
    }
});

// ******************************** UPDATE Branch ****************************
router.put('/:id', staffAuth(['Admin', 'Super Admin']), async(req, res) => {
    const branch_id = req.params.id;
    const {name, address, phone_no, email} = req.body;
    
    try{
        const [result] = await db.execute(
            `UPDATE branch SET name = ?, address = ?, phone_no = ?, email = ? WHERE branch_id = ?`,
            [name, address, phone_no, email, branch_id]
        );
        
        if(result.affectedRows === 0){
            return res.status(404).json({error: "Branch not found"});
        }
        
        console.log('✅ Branch updated:', branch_id);
        res.json({message: "Branch updated successfully"});
    }catch(err){
        console.error('Error updating branch:', err);
        res.status(500).json({error: "Error updating branch"});
    }
});

// ******************************** DELETE Branch ****************************
// Automatically deletes all associated data in the correct order
// Associated deletions include: Invoices, Payments, Treatments, Appointments, Doctors, Staff
router.delete('/:id', staffAuth(['Admin', 'Super Admin']), async(req, res) => {
    const branch_id = req.params.id;
    const connection = await db.getConnection();
    
    try{
        // Start transaction
        await connection.beginTransaction();
        
        // Check if branch exists
        const [branch] = await connection.execute(`SELECT * FROM branch WHERE branch_id = ?`, [branch_id]);
        
        if(branch.length === 0){
            await connection.rollback();
            return res.status(404).json({error: "Branch not found"});
        }
        
        // Get all staff in this branch
        const [staff] = await connection.execute(
            `SELECT staff_id FROM staff WHERE branch_id = ?`, 
            [branch_id]
        );
        
        // Get all doctors from this branch
        const [doctors] = await connection.execute(
            `SELECT d.staff_id FROM doctor d 
             INNER JOIN staff s ON d.staff_id = s.staff_id 
             WHERE s.branch_id = ?`, 
            [branch_id]
        );
        
        let deletedCounts = {
            invoices: 0,
            payments: 0,
            treatments: 0,
            appointments: 0,
            doctors: 0,
            staff: 0
        };
        
        // If there are doctors, delete their related data
        if(doctors.length > 0) {
            const doctorIds = doctors.map(d => d.staff_id);
            const placeholders = doctorIds.map(() => '?').join(',');
            
            // Get all appointments for these doctors
            const [appointments] = await connection.execute(
                `SELECT appointment_id FROM appointment WHERE doctor_id IN (${placeholders})`,
                doctorIds
            );
            
            if(appointments.length > 0) {
                const appointmentIds = appointments.map(a => a.appointment_id);
                const apptPlaceholders = appointmentIds.map(() => '?').join(',');
                
                // Get all payments for these appointments
                const [payments] = await connection.execute(
                    `SELECT payment_id FROM payment WHERE appointment_id IN (${apptPlaceholders})`,
                    appointmentIds
                );
                
                if(payments.length > 0) {
                    const paymentIds = payments.map(p => p.payment_id);
                    const paymentPlaceholders = paymentIds.map(() => '?').join(',');
                    
                    // Delete invoices first
                    const [invoiceResult] = await connection.execute(
                        `DELETE FROM invoice WHERE payment_id IN (${paymentPlaceholders})`,
                        paymentIds
                    );
                    deletedCounts.invoices = invoiceResult.affectedRows;
                }
                
                // Delete payments
                const [paymentResult] = await connection.execute(
                    `DELETE FROM payment WHERE appointment_id IN (${apptPlaceholders})`,
                    appointmentIds
                );
                deletedCounts.payments = paymentResult.affectedRows;
                
                // Delete treatments
                const [treatmentResult] = await connection.execute(
                    `DELETE FROM treatment WHERE appointment_id IN (${apptPlaceholders})`,
                    appointmentIds
                );
                deletedCounts.treatments = treatmentResult.affectedRows;
            }
            
            // Delete appointments
            const [appointmentResult] = await connection.execute(
                `DELETE FROM appointment WHERE doctor_id IN (${placeholders})`,
                doctorIds
            );
            deletedCounts.appointments = appointmentResult.affectedRows;
            
            // Delete from doctor table
            const [doctorResult] = await connection.execute(
                `DELETE FROM doctor WHERE staff_id IN (${placeholders})`,
                doctorIds
            );
            deletedCounts.doctors = doctorResult.affectedRows;
        }
        
        // Delete all staff from this branch
        const [staffResult] = await connection.execute(
            `DELETE FROM staff WHERE branch_id = ?`,
            [branch_id]
        );
        deletedCounts.staff = staffResult.affectedRows;
        
        // Finally, delete the branch itself
        const [branchResult] = await connection.execute(
            `DELETE FROM branch WHERE branch_id = ?`, 
            [branch_id]
        );
        
        // Commit transaction
        await connection.commit();
        
        console.log(`✅ Branch deleted: ${branch_id}`);
        console.log(`📊 Deleted counts:`, deletedCounts);
        
        res.status(200).json({
            message: "Branch and all associated data successfully deleted",
            branch_id: branch_id,
            deleted: deletedCounts
        });
        
    }catch(err){
        // Rollback on error
        await connection.rollback();
        console.error('Error deleting branch:', err);
        res.status(500).json({
            error: "Error deleting branch", 
            details: err.message
        });
    } finally {
        connection.release();
    }
});

// ******************************** Assign Manager to Branch ****************************
router.post('/:id/assign-manager', staffAuth(['Admin', 'Super Admin']), async(req, res) => {
    const branch_id = req.params.id;
    const { manager_id } = req.body;
    
    if (!manager_id) {
        return res.status(400).json({error: 'Manager ID is required'});
    }
    
    try{
        // Check if manager exists and is a Branch Manager
        const [manager] = await db.execute(
            `SELECT * FROM staff WHERE staff_id = ? AND category = 'Branch Manager'`,
            [manager_id]
        );
        
        if (manager.length === 0) {
            return res.status(404).json({error: 'Branch Manager not found'});
        }
        
        // Update branch with manager
        const [result] = await db.execute(
            `UPDATE branch SET manager_id = ? WHERE branch_id = ?`,
            [manager_id, branch_id]
        );
        
        if(result.affectedRows === 0){
            return res.status(404).json({error: "Branch not found"});
        }
        
        console.log('✅ Manager assigned:', { branch_id, manager_id });
        res.json({message: "Manager assigned successfully"});
    }catch(err){
        console.error('Error assigning manager:', err);
        res.status(500).json({error: "Error assigning manager"});
    }
});

// ******************************** GET Branch Managers ****************************
router.get('/managers/list', staffAuth(['Admin', 'Super Admin']), async(req, res) => {
    try{
        const [managers] = await db.execute(`
            SELECT s.staff_id, s.username, s.name, s.email, s.phone_no, s.branch_id, 
                   b.name as branch_name
            FROM staff s
            LEFT JOIN branch b ON s.branch_id = b.branch_id
            WHERE s.category = 'Branch Manager'
            ORDER BY s.name
        `);
        res.json(managers);
    }catch(err){
        console.error('Error fetching branch managers:', err);
        res.status(500).json({error: 'Error fetching branch managers'});
    }
});

// ******************************** ADD Branch Manager ****************************
router.post('/managers', staffAuth(['Admin', 'Super Admin']), async(req, res) => {
    const { username, password, name, email, phone, gender, branch_id } = req.body;
    
    // Validation
    if (!username || !password || !name || !email || !branch_id) {
        return res.status(400).json({
            error: 'Please provide username, password, name, email, and branch_id'
        });
    }
    
    // Validate gender if provided
    if (gender && !['Male', 'Female'].includes(gender)) {
        return res.status(400).json({
            error: 'Gender must be either Male or Female'
        });
    }
    
    try{
        // Check if username or email already exists
        const [existingUser] = await db.execute(
            `SELECT * FROM staff WHERE username = ? OR email = ?`,
            [username, email]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({
                error: 'Username or email already in use'
            });
        }
        
        // Check if branch exists
        const [branch] = await db.execute(
            `SELECT * FROM branch WHERE branch_id = ?`,
            [branch_id]
        );
        
        if (branch.length === 0) {
            return res.status(404).json({
                error: 'Branch not found'
            });
        }
        
        // Auto-generate Staff ID
        const [staff] = await db.execute(
            `SELECT staff_id FROM staff ORDER BY staff_id DESC LIMIT 1`
        );
        
        let newStaffId;
        if (staff.length === 0) {
            newStaffId = 'S0001';
        } else {
            const lastId = staff[0].staff_id;
            const numericPart = parseInt(lastId.substring(1));
            newStaffId = `S${String(numericPart + 1).padStart(4, '0')}`;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new branch manager
        await db.execute(
            `INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id) 
             VALUES (?, ?, ?, 'Branch Manager', ?, ?, NULL, ?, ?, ?)`,
            [newStaffId, username, name, phone || null, gender || null, email, hashedPassword, branch_id]
        );
        
        console.log('✅ Branch Manager created:', {
            staff_id: newStaffId,
            username,
            name,
            email,
            gender: gender || 'Not specified',
            branch_id
        });
        
        res.status(201).json({
            message: 'Branch manager added successfully',
            staff_id: newStaffId
        });
    }catch(err){
        console.error('Error creating branch manager:', err);
        res.status(500).json({
            error: 'Error creating branch manager',
            details: err.message
        });
    }
});


module.exports = router;