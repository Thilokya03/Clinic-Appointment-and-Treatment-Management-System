const express = require("express");
const router = express.Router();
const db = require("../db");
const { message } = require("statuses");
const { route } = require("./patientRoutes");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');


// ******************************** ADD Branch ****************************
router.post('/',staffAuth(['Admin']), async(req, res) =>{ 
    const {branch_id, name, address} = req.body;
    try{
        await db.execute(`INSERT INTO branch (branch_id, name, address) VALUES (?, ?, ?)`, [branch_id, name, address]);
        res.status(201).json({message:"Branch added Successfully"});
    }catch(err){
        res.status(500).json({error:err});
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
router.get('/:id',staffAuth(['Admin']), async(req, res) =>{ // TEST PASSSSSSSSSSSZ
    const branch_id = req.params.id;
    try{
        const [row] = await db.execute(`SELECT * FROM branch WHERE branch_id = ?`, [branch_id]);
        if(row.length === 0){
            return res.status(404).json({error: "Branch not found"});
        }
        res.json(row)
    }catch(err){
        res.status(500).json({error: "error getting branch"});
    }
});

router.delete('/:id',staffAuth(['Admin']), async(req, res) => {
    const branch_id = req.params.id;
    try{
        await db.execute(`DELETE FROM branch WHERE branch_id = ?`, [branch_id]);
        res.status(200).json({message: "patient successfully deleted"});
    }catch(err){
        res.status(500).json({error:"error deleting branch"})
    }
});


module.exports = router;