const express = require("express");
const router = express.Router();
const db = require("../db");

//***************************ADD treatment for an appointment****************** */
router.post('/', async(req, res) =>{
    const {treatment_id, catalog_id, appointment_id, description} = req.body;
    try{
        await db.execute(`INSERT INTO treatment (treatment_id, catalog_id, appointment_id, description) VALUES (?,?,?,?)`,
            [treatment_id, catalog_id, appointment_id, description]);
        res.status(201).json({message:"treatment added Successfully"});
    }catch(err){
        res.status(500).json({error:err});
    }
})

//**************************GET treatment for an appointment************************* */

router.get('/:id', async(req, res) =>{
    const treatment_id = req.params.id;
    try{
        const row = await db.execute(`SELECT * FROM appointment WHERE treatment_id = ?`, [treatment_id]);
        res.json(row);
    }catch(err){
        res.status(500).json({error:err});
    }
});

//**************************GET treatment catalog***************************************** */

router.get('/treatment/:id', async(req, res) =>{
    const catalog_id = req.params.id;
    try{
        const row = await db.execute(`SELECT * FROM treatment_catalog WHERE catalog_id = ?`, [catalog_id]);
        res.json(row);
    }catch(err){
        res.status(500).json({error:err});
    }
});

//****************************UPDATE balance************************** */







