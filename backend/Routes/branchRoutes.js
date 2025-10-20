const express = require("express");
const router = express.Router();
const db = require("../db");
const { message } = require("statuses");
const { route } = require("./patientRoutes");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');


// ******************************** GET All Branches ****************************
router.get('/', staffAuth(['Admin', 'Branch Manager']), async(req, res) =>{
    try{
        const [rows] = await db.execute(`
            SELECT b.*, s.name as manager_name, s.staff_id as manager_id
            FROM branch b
            LEFT JOIN staff s ON b.manager_id = s.staff_id
            ORDER BY b.branch_id
        `);
        res.json(rows);
    }catch(err){
        console.error('Error fetching branches:', err);
        res.status(500).json({error: 'Error fetching branches'});
    }
});

// ******************************** GET Branch Statistics ****************************
router.get('/stats', staffAuth(['Admin']), async(req, res) =>{
    try{
        // Get total branches
        const [branchCount] = await db.execute(`SELECT COUNT(*) as count FROM branch`);
        
        // Get total branch managers
        const [managerCount] = await db.execute(`
            SELECT COUNT(DISTINCT manager_id) as count 
            FROM branch 
            WHERE manager_id IS NOT NULL
        `);
        
        // Get total doctors
        const [doctorCount] = await db.execute(`SELECT COUNT(*) as count FROM doctor`);
        
        // Get total patients
        const [patientCount] = await db.execute(`SELECT COUNT(*) as count FROM patient`);
        
        res.json({
            totalBranches: branchCount[0].count,
            branchManagers: managerCount[0].count,
            totalDoctors: doctorCount[0].count,
            totalPatients: patientCount[0].count
        });
    }catch(err){
        console.error('Error fetching stats:', err);
        res.status(500).json({error: 'Error fetching statistics'});
    }
});

// ******************************** ADD Branch ****************************
router.post('/', staffAuth(['Admin']), async(req, res) =>{ 
    const {branch_id, name, address, manager_id} = req.body;
    
    if (!branch_id || !name || !address) {
        return res.status(400).json({error: 'Please provide branch_id, name, and address'});
    }
    
    try{
        await db.execute(
            `INSERT INTO branch (branch_id, name, address, manager_id) VALUES (?, ?, ?, ?)`, 
            [branch_id, name, address, manager_id || null]
        );
        
        console.log('✅ Branch created:', { branch_id, name });
        res.status(201).json({message: "Branch added successfully"});
    }catch(err){
        console.error('Error creating branch:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({error: 'Branch ID already exists'});
        }
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
router.get('/:id', staffAuth(['Admin', 'Branch Manager']), async(req, res) =>{ 
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
router.put('/:id', staffAuth(['Admin']), async(req, res) => {
    const branch_id = req.params.id;
    const {name, address, manager_id} = req.body;
    
    try{
        const [result] = await db.execute(
            `UPDATE branch SET name = ?, address = ?, manager_id = ? WHERE branch_id = ?`,
            [name, address, manager_id || null, branch_id]
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
router.delete('/:id', staffAuth(['Admin']), async(req, res) => {
    const branch_id = req.params.id;
    try{
        const [result] = await db.execute(`DELETE FROM branch WHERE branch_id = ?`, [branch_id]);
        
        if(result.affectedRows === 0){
            return res.status(404).json({error: "Branch not found"});
        }
        
        console.log('✅ Branch deleted:', branch_id);
        res.status(200).json({message: "Branch successfully deleted"});
    }catch(err){
        console.error('Error deleting branch:', err);
        res.status(500).json({error: "Error deleting branch"});
    }
});

// ******************************** Assign Manager to Branch ****************************
router.post('/:id/assign-manager', staffAuth(['Admin']), async(req, res) => {
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
router.get('/managers/list', staffAuth(['Admin']), async(req, res) => {
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


module.exports = router;