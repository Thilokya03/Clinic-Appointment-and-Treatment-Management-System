const express = require("express");
const router = express.Router();
const db = require("../db");
const { authenticate, staffAuth, patientAuth } = require('../middlewares/auth');

//***************************ADD payment for an appointment****************** */
router.post('/', staffAuth(['Admin', 'Doctor']), async(req, res) =>{ // TEST PASSSSS
    const {payment_id, insurance_paid_amount, patient_paid_amount, discount_amount, status, appointment_id, patient_id} = req.body;

    if(!payment_id || !appointment_id){
        return res.status(400).json({error: "Missing required fields"});
    }

    try{
        const [appointmentRows] = await db.execute(
            "SELECT * FROM appointment WHERE appointment_id = ?",[appointment_id]
        );
        console.log("appointment", appointmentRows);

        if(appointmentRows.length === 0){
            return res.status(404).json({error:"appointment not found"});
        }
        if(appointmentRows[0].patient_id !== patient_id){
            return res.status(403).json({error: "Not authorized to add payment to this appointment"});
        }

        await db.execute(`INSERT INTO payment (payment_id, insurance_paid_amount, patient_paid_amount, discount_amount, status, appointment_id, patient_id) VALUES (?,?,?,?,?,?, ?)`,
            [payment_id, insurance_paid_amount, patient_paid_amount, discount_amount, status, appointment_id, patient_id]);
        
        res.status(201).json({message: "Payment added successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({error: err.message});
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

//**************************GET all payments (for staff)***************************************** */

router.get('/all', staffAuth(['Admin', 'Doctor', 'Nurse', 'Branch Manager', 'Super Admin']), async(req, res) =>{
    try{
        const [rows] = await db.execute(`SELECT * FROM payment ORDER BY payment_id DESC`);
        res.json(rows);
    }catch(err){
        console.error('Error fetching all payments:', err);
        res.status(500).json({error:"Error retrieving payment information"});
    }
});

//**************************GET patient payment***************************************** */

router.get('/',patientAuth, async(req, res) =>{ // TEST PASSSSSSSSS
    const patient_id = req.user.id;
    console.log("USER", req.user);
    try{
        const [row] = await db.execute(`SELECT * FROM payment WHERE patient_id = ?`, [patient_id]);
        res.json(row);
    }catch(err){
        console.error('Error fetching patient payments:', err);
        res.status(500).json({error:"Error retrieving payment information"});
    }
});

//**************************UPDATE payment (for staff)***************************************** */

router.put('/:payment_id', staffAuth(['Admin', 'Doctor', 'Nurse', 'Branch Manager', 'Super Admin']), async(req, res) =>{
    const { payment_id } = req.params;
    const { insurance_paid_amount, patient_paid_amount, discount_amount, status, Due_payment } = req.body;

    try{
        await db.execute(
            `UPDATE payment 
             SET insurance_paid_amount = ?, 
                 patient_paid_amount = ?, 
                 discount_amount = ?,
                 status = ?,
                 Due_payment = ?
             WHERE payment_id = ?`,
            [insurance_paid_amount, patient_paid_amount, discount_amount, status, Due_payment, payment_id]
        );
        
        res.status(200).json({message: "Payment updated successfully"});
    }catch(err){
        console.error('Error updating payment:', err);
        res.status(500).json({error: err.message});
    }
});


module.exports = router;