const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');

//***************************ADD payment for an appointment****************** */
router.post('/',patientAuth, async(req, res) =>{
    if (req.user.id !== patient_id) {
        return res.status(403).json({error: 'Not authorized to add payment to this account'});
    }
    const {payment_id, insurnce_paid_amount, patient_paid_amount, discount_amount, status, appointment_id, patient_id, claim_id} = req.body;
    try{
        await db.execute(`INSERT INTO payment (payment_id, insurnce_paid_amount, patient_paid_amount, discount_amount, status, appointment_id, patient_id, claim_id) VALUES (?,?,?,?,?,?,?,?)`,
            [payment_id, insurnce_paid_amount, patient_paid_amount, discount_amount, status, appointment_id, patient_id, claim_id]);
        res.status(201).json({message:"treatment added Successfully"});
    }catch(err){
        res.status(500).json({error:err});
    }
})

// //**************************GET payment************************* */

// router.get('/:id', async(req, res) =>{
//     const payment_id = req.params.id;
//     try{
//         const row = await db.execute(`SELECT * FROM payment WHERE payment_id = ?`, [payment_id]);
//         res.json(row);
//     }catch(err){
//         res.status(500).json({error:err});
//     }
// });

//**************************GET pateint payment***************************************** */

router.get('/payment/', async(req, res) =>{
    const patient_id = req.user.id;
    try{
        const row = await db.execute(`SELECT * FROM payment WHERE patient_id = ?`, [patient_id]);
        res.json(row);
    }catch(err){
        res.status(500).json({error:err});
    }
});


module.exports = router;