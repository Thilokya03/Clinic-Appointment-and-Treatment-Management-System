const express = require("express");
const router = express.Router();
const db = require("../db");
const { staffAuth } = require('../middlewares/auth');

// Generate next insurance_id like I0001, I0002, ...
const generateInsuranceId = async () => {
    const [rows] = await db.execute(
        `SELECT MAX(CAST(SUBSTRING(insurance_id, 2) AS UNSIGNED)) AS maxId FROM insurance`
    );
    const max = rows && rows[0] && rows[0].maxId ? Number(rows[0].maxId) : 0;
    const next = max + 1;
    return 'I' + String(next).padStart(4, '0');
}

//*************************** GET all insurance companies ******************
router.get('/', staffAuth(['Admin', 'Branch Manager', 'Nurse', 'Other']), async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT insurance_id, name, coverage_type, phone_no FROM insurance ORDER BY name`
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching insurance companies:', err);
        res.status(500).json({ error: 'Error fetching insurance companies' });
    }
});

//*************************** GET insurance by ID ******************
router.get('/:id', staffAuth(['Admin', 'Branch Manager', 'Nurse', 'Other']), async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            `SELECT * FROM insurance WHERE insurance_id = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Insurance company not found' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching insurance:', err);
        res.status(500).json({ error: 'Error fetching insurance company' });
    }
});

//*************************** ADD insurance company ******************
router.post('/', staffAuth(['Admin', 'Branch Manager', 'Nurse', 'Other']), async (req, res) => {
    const { name, coverage_type, phone_no } = req.body;

    if (!name || !coverage_type) {
        return res.status(400).json({ error: 'Please provide company name and coverage type' });
    }

    try {
        // Check if insurance company already exists
        const [existing] = await db.execute(
            `SELECT * FROM insurance WHERE name = ?`,
            [name]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Insurance company already exists' });
        }

        // Generate new insurance ID
        const newInsuranceId = await generateInsuranceId();

        // Insert new insurance company
        await db.execute(
            `INSERT INTO insurance (insurance_id, name, coverage_type, phone_no) VALUES (?, ?, ?, ?)`,
            [newInsuranceId, name, coverage_type, phone_no || null]
        );

        console.log('✅ Insurance company added:', { insurance_id: newInsuranceId, name });
        res.status(201).json({ 
            message: 'Insurance company added successfully',
            insurance_id: newInsuranceId
        });
    } catch (err) {
        console.error('❌ Error adding insurance company:', err);
        res.status(500).json({ error: 'Error adding insurance company' });
    }
});

//*************************** UPDATE insurance company ******************
router.put('/:id', staffAuth(['Admin', 'Branch Manager']), async (req, res) => {
    const { id } = req.params;
    const { name, coverage_type, phone_no } = req.body;

    if (!name || !coverage_type) {
        return res.status(400).json({ error: 'Please provide company name and coverage type' });
    }

    try {
        // Check if insurance exists
        const [existing] = await db.execute(
            `SELECT * FROM insurance WHERE insurance_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Insurance company not found' });
        }

        // Update insurance company
        await db.execute(
            `UPDATE insurance SET name = ?, coverage_type = ?, phone_no = ? WHERE insurance_id = ?`,
            [name, coverage_type, phone_no || null, id]
        );

        console.log('✅ Insurance company updated:', { insurance_id: id, name });
        res.json({ message: 'Insurance company updated successfully' });
    } catch (err) {
        console.error('❌ Error updating insurance company:', err);
        res.status(500).json({ error: 'Error updating insurance company' });
    }
});

//*************************** DELETE insurance company ******************
router.delete('/:id', staffAuth(['Admin']), async (req, res) => {
    const { id } = req.params;

    try {
        // Check if insurance exists
        const [existing] = await db.execute(
            `SELECT * FROM insurance WHERE insurance_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Insurance company not found' });
        }

        // Delete insurance company
        await db.execute(
            `DELETE FROM insurance WHERE insurance_id = ?`,
            [id]
        );

        console.log('✅ Insurance company deleted:', { insurance_id: id });
        res.json({ message: 'Insurance company deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting insurance company:', err);
        res.status(500).json({ error: 'Error deleting insurance company' });
    }
});

module.exports = router;
