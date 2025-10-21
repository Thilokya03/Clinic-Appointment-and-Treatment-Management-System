const express = require("express");
const router = express.Router();
const db = require("../db");
const { staffAuth, patientAuth } = require('../middlewares/auth');

//*************************** ADD Insurance Claim ****************** */
router.post('/', staffAuth(['Admin', 'Branch Manager', 'Nurse', 'Other']), async(req, res) => {
    const { claim_id, insurance_id, percentage, payment_id } = req.body;

    console.log('📝 Add claim request:', { claim_id, insurance_id, percentage, payment_id });

    if(!claim_id || !insurance_id || !payment_id){
        return res.status(400).json({error: "Missing required fields"});
    }

    try{
        // Check if payment exists
        const [paymentRows] = await db.execute(
            "SELECT * FROM payment WHERE payment_id = ?", [payment_id]
        );

        if(paymentRows.length === 0){
            return res.status(404).json({error: "Payment not found"});
        }

        const payment = paymentRows[0];
        const totalAmount = parseFloat(payment.total_amount);

        // Calculate insurance claim amount based on percentage
        const claimPercentage = parseFloat(percentage) || 0;
        const claimAmount = (totalAmount * claimPercentage) / 100;

        // Insert claim record
        await db.execute(
            `INSERT INTO insurance_claim (claim_id, insurance_id, percentage, payment_id) 
             VALUES (?, ?, ?, ?)`,
            [claim_id, insurance_id, claimPercentage, payment_id]
        );

        // Update payment with insurance amount
        await db.execute(
            `UPDATE payment 
             SET insurance_paid_amount = insurance_paid_amount + ?
             WHERE payment_id = ?`,
            [claimAmount, payment_id]
        );
        
        console.log('✅ Claim added successfully:', claim_id);
        res.status(201).json({
            message: "Insurance claim added successfully",
            claim_id: claim_id,
            claim_amount: claimAmount,
            percentage: claimPercentage
        });
    }catch(err){
        console.error('❌ Error adding claim:', err);
        res.status(500).json({error: err.message || "Error adding claim"});
    }
});

//*************************** GET All Claims (for staff) ****************** */
router.get('/all', staffAuth(['Admin', 'Branch Manager', 'Nurse', 'Doctor', 'Other']), async(req, res) => {
    try{
        const [rows] = await db.execute(`
            SELECT 
                ic.claim_id,
                ic.insurance_id,
                i.name as company_name,
                ic.percentage,
                ic.payment_id,
                p.total_amount,
                (p.total_amount * ic.percentage / 100) as claim_amount,
                p.patient_id,
                pt.name as patient_name
            FROM insurance_claim ic
            JOIN insurance i ON ic.insurance_id = i.insurance_id
            JOIN payment p ON ic.payment_id = p.payment_id
            JOIN patient pt ON p.patient_id = pt.patient_id
            ORDER BY ic.claim_id DESC
        `);
        res.json(rows);
    }catch(err){
        console.error('Error fetching claims:', err);
        res.status(500).json({error: err.message || "Error retrieving claims"});
    }
});

//*************************** GET Claims by Payment ID ****************** */
router.get('/payment/:payment_id', staffAuth(['Admin', 'Branch Manager', 'Nurse', 'Doctor', 'Other']), async(req, res) => {
    const { payment_id } = req.params;
    try{
        const [rows] = await db.execute(`
            SELECT 
                ic.claim_id,
                ic.insurance_id,
                i.name as company_name,
                ic.percentage,
                (p.total_amount * ic.percentage / 100) as claim_amount
            FROM insurance_claim ic
            JOIN insurance i ON ic.insurance_id = i.insurance_id
            JOIN payment p ON ic.payment_id = p.payment_id
            WHERE ic.payment_id = ?
        `, [payment_id]);
        res.json(rows);
    }catch(err){
        console.error('Error fetching claims:', err);
        res.status(500).json({error: err.message || "Error retrieving claims"});
    }
});

//*************************** UPDATE Insurance Claim ****************** */
router.put('/:claim_id', staffAuth(['Admin', 'Branch Manager']), async(req, res) => {
    const { claim_id } = req.params;
    const { percentage } = req.body;

    try{
        // Get existing claim
        const [existingClaim] = await db.execute(
            `SELECT ic.*, p.total_amount 
             FROM insurance_claim ic
             JOIN payment p ON ic.payment_id = p.payment_id
             WHERE ic.claim_id = ?`, 
            [claim_id]
        );

        if(existingClaim.length === 0){
            return res.status(404).json({error: "Claim not found"});
        }

        const claim = existingClaim[0];
        const oldPercentage = parseFloat(claim.percentage);
        const newPercentage = parseFloat(percentage);
        const totalAmount = parseFloat(claim.total_amount);

        // Calculate old and new claim amounts
        const oldClaimAmount = (totalAmount * oldPercentage) / 100;
        const newClaimAmount = (totalAmount * newPercentage) / 100;
        const difference = newClaimAmount - oldClaimAmount;

        // Update claim record
        await db.execute(
            `UPDATE insurance_claim SET percentage = ? WHERE claim_id = ?`,
            [newPercentage, claim_id]
        );

        // Update payment insurance amount
        await db.execute(
            `UPDATE payment 
             SET insurance_paid_amount = insurance_paid_amount + ?
             WHERE payment_id = ?`,
            [difference, claim.payment_id]
        );
        
        res.status(200).json({
            message: "Claim updated successfully",
            old_amount: oldClaimAmount,
            new_amount: newClaimAmount,
            difference: difference
        });
    }catch(err){
        console.error('Error updating claim:', err);
        res.status(500).json({error: err.message});
    }
});

//*************************** DELETE Insurance Claim ****************** */
router.delete('/:claim_id', staffAuth(['Admin', 'Branch Manager']), async(req, res) => {
    const { claim_id } = req.params;

    try{
        // Get claim details before deletion
        const [claim] = await db.execute(
            `SELECT ic.*, p.total_amount 
             FROM insurance_claim ic
             JOIN payment p ON ic.payment_id = p.payment_id
             WHERE ic.claim_id = ?`, 
            [claim_id]
        );

        if(claim.length === 0){
            return res.status(404).json({error: "Claim not found"});
        }

        const claimData = claim[0];
        const claimAmount = (parseFloat(claimData.total_amount) * parseFloat(claimData.percentage)) / 100;

        // Delete claim
        await db.execute(`DELETE FROM insurance_claim WHERE claim_id = ?`, [claim_id]);

        // Reduce insurance amount from payment
        await db.execute(
            `UPDATE payment 
             SET insurance_paid_amount = insurance_paid_amount - ?
             WHERE payment_id = ?`,
            [claimAmount, claimData.payment_id]
        );
        
        res.status(200).json({
            message: "Claim deleted successfully",
            refunded_amount: claimAmount
        });
    }catch(err){
        console.error('Error deleting claim:', err);
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
