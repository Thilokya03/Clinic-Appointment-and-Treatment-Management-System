const express = require("express");
const router = express.Router();
const db = require("../db");
const { staffAuth } = require('../middlewares/auth');

// Generate next catalog_id like C0001, C0002, ...
const generateCatalogId = async () => {
    const [rows] = await db.execute(
        `SELECT MAX(CAST(SUBSTRING(catalog_id, 2) AS UNSIGNED)) AS maxId FROM treatment_catalog`
    );
    const max = rows && rows[0] && rows[0].maxId ? Number(rows[0].maxId) : 0;
    const next = max + 1;
    return 'C' + String(next).padStart(4, '0');
}

//*************************** GET all treatments from catalog ******************
router.get('/', staffAuth(['Admin', 'Branch Manager', 'Doctor', 'Nurse', 'Other']), async (req, res) => {
    try {
        const [rows] = await db.execute(
            `SELECT catalog_id, treatment_name, treatment_fee FROM treatment_catalog ORDER BY treatment_name`
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching treatment catalog:', err);
        res.status(500).json({ error: 'Error fetching treatment catalog' });
    }
});

//*************************** GET treatment by ID ******************
router.get('/:id', staffAuth(['Admin', 'Branch Manager', 'Doctor', 'Nurse', 'Other']), async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute(
            `SELECT * FROM treatment_catalog WHERE catalog_id = ?`,
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Treatment not found in catalog' });
        }
        
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching treatment:', err);
        res.status(500).json({ error: 'Error fetching treatment' });
    }
});

//*************************** ADD treatment to catalog ******************
router.post('/', staffAuth(['Admin', 'Branch Manager', 'Doctor', 'Nurse', 'Other']), async (req, res) => {
    const { treatment_name, treatment_fee } = req.body;

    if (!treatment_name) {
        return res.status(400).json({ error: 'Please provide treatment name' });
    }

    try {
        // Check if treatment already exists
        const [existing] = await db.execute(
            `SELECT * FROM treatment_catalog WHERE treatment_name = ?`,
            [treatment_name]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Treatment already exists in catalog' });
        }

        // Generate new catalog ID
        const newCatalogId = await generateCatalogId();

        // Insert new treatment
        await db.execute(
            `INSERT INTO treatment_catalog (catalog_id, treatment_name, treatment_fee) VALUES (?, ?, ?)`,
            [newCatalogId, treatment_name, treatment_fee || 0.00]
        );

        console.log('✅ Treatment added to catalog:', { catalog_id: newCatalogId, treatment_name });
        res.status(201).json({ 
            message: 'Treatment added to catalog successfully',
            catalog_id: newCatalogId
        });
    } catch (err) {
        console.error('❌ Error adding treatment to catalog:', err);
        res.status(500).json({ error: 'Error adding treatment to catalog' });
    }
});

//*************************** UPDATE treatment in catalog ******************
router.put('/:id', staffAuth(['Admin', 'Branch Manager', 'Doctor']), async (req, res) => {
    const { id } = req.params;
    const { treatment_name, treatment_fee } = req.body;

    if (!treatment_name) {
        return res.status(400).json({ error: 'Please provide treatment name' });
    }

    try {
        // Check if treatment exists
        const [existing] = await db.execute(
            `SELECT * FROM treatment_catalog WHERE catalog_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Treatment not found in catalog' });
        }

        // Update treatment
        await db.execute(
            `UPDATE treatment_catalog SET treatment_name = ?, treatment_fee = ? WHERE catalog_id = ?`,
            [treatment_name, treatment_fee || 0.00, id]
        );

        console.log('✅ Treatment updated in catalog:', { catalog_id: id, treatment_name });
        res.json({ message: 'Treatment updated successfully' });
    } catch (err) {
        console.error('❌ Error updating treatment:', err);
        res.status(500).json({ error: 'Error updating treatment' });
    }
});

//*************************** DELETE treatment from catalog ******************
router.delete('/:id', staffAuth(['Admin']), async (req, res) => {
    const { id } = req.params;

    try {
        // Check if treatment exists
        const [existing] = await db.execute(
            `SELECT * FROM treatment_catalog WHERE catalog_id = ?`,
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Treatment not found in catalog' });
        }

        // Delete treatment
        await db.execute(
            `DELETE FROM treatment_catalog WHERE catalog_id = ?`,
            [id]
        );

        console.log('✅ Treatment deleted from catalog:', { catalog_id: id });
        res.json({ message: 'Treatment deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting treatment:', err);
        res.status(500).json({ error: 'Error deleting treatment' });
    }
});

module.exports = router;
