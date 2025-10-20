const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
const { authenticate, staffAuth } = require('../middlewares/auth');
// const { message } = require("statuses");


//********************************* GET staff by category ***********************************
// Allow all authenticated users (including patients) to view staff by category
router.get('/by-category/:category', authenticate, async (req, res) => {
  const category = req.params.category;

  try {
    // If requesting doctors, join with doctor table to get speciality
    let query;
    if (category === 'Doctor') {
      query = `SELECT s.staff_id, s.username, s.name, s.category, s.phone_no, s.gender, s.nic, s.email, s.branch_id, d.speciality
               FROM staff s
               LEFT JOIN doctor d ON s.staff_id = d.staff_id
               WHERE s.category = ?`;
    } else {
      query = `SELECT staff_id, username, name, category, phone_no, gender, nic, email, branch_id 
               FROM staff WHERE category = ?`;
    }
    
    const [rows] = await db.execute(query, [category]);
    
    console.log(`📋 Fetched ${rows.length} staff members with category: ${category}`);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching staff by category:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//********************************* GET all staff ***********************************
router.get('/all', staffAuth(['Admin', 'Branch Manager']), async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT staff_id, username, name, category, phone_no, gender, nic, email, branch_id 
       FROM staff ORDER BY name`
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching all staff:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

//********************************* GET staff ***********************************
router.get('/', staffAuth(['Doctor']), async (req, res) => { //TEST PASS
  const staff_id = req.user.id;

  try {
    const [rows] = await db.execute(
      'SELECT staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id FROM staff WHERE staff_id = ?',
      [staff_id]
    );
    console.log("rows", rows);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'staff not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// **************************ADD staff **********************************************

router.post('/staff', staffAuth(['Admin', 'Super Admin', 'Branch Manager']), async (req, res) => {
  const { username, name, category, phone_no, gender, nic, email, password, branch_id } = req.body;

  // Validation
  if (!username || !password || !name || !email || !category || !branch_id) {
    return res.status(400).json({
      error: 'Please provide username, password, name, email, category, and branch_id'
    });
  }

  // Validate phone number (required)
  if (!phone_no) {
    return res.status(400).json({
      error: 'Please provide phone number'
    });
  }

  // Validate phone number format (10 digits)
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone_no)) {
    return res.status(400).json({
      error: 'Phone number must be exactly 10 digits'
    });
  }

  // Validate category
  const validCategories = ['Admin', 'Branch Manager', 'Nurse', 'Doctor', 'Other'];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: 'Invalid category. Must be one of: Admin, Branch Manager, Nurse, Doctor, Other'
    });
  }

  // Validate gender if provided
  if (gender && !['Male', 'Female'].includes(gender)) {
    return res.status(400).json({
      error: 'Gender must be either Male or Female'
    });
  }

  try {
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

    // Check if NIC already exists (if provided)
    if (nic) {
      const [existingNIC] = await db.execute(
        `SELECT * FROM staff WHERE nic = ?`,
        [nic]
      );

      if (existingNIC.length > 0) {
        return res.status(400).json({
          error: 'NIC already in use'
        });
      }
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

    // Insert new staff
    await db.execute(
      `INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newStaffId, username, name, category, phone_no, gender || null, nic || null, email, hashedPassword, branch_id]
    );

    // If category is Branch Manager, update the branch table with manager_id
    if (category === 'Branch Manager') {
      await db.execute(
        `UPDATE branch SET manager_id = ? WHERE branch_id = ?`,
        [newStaffId, branch_id]
      );
      console.log('✅ Branch updated with manager_id:', { branch_id, manager_id: newStaffId });
    }

    console.log('✅ Staff member created:', {
      staff_id: newStaffId,
      username,
      name,
      category,
      email,
      phone_no,
      gender: gender || 'Not specified',
      nic: nic || 'Not specified',
      branch_id
    });

    res.status(201).json({
      message: "Staff added successfully",
      staff_id: newStaffId
    });
  } catch (err) {
    console.error('❌ Error creating staff:', err);
    res.status(500).json({ 
      error: 'Error creating staff member',
      details: err.message 
    });
  }
});

// **************************ADD DOCTOR **********************************************

router.post('/doctor', staffAuth(['Admin', 'Branch Manager', 'Super Admin']), async (req, res) => { // TEST PASS
  const { staff_id, speciality } = req.body;

  if (!staff_id || !speciality) {
    return res.status(400).json({ error: "Please provide staff_id and speciality" });
  }

  try {
    await db.execute("INSERT INTO doctor (staff_id, speciality) VALUES (?, ?) "
      , [staff_id, speciality]);
    res.status(201).json({ message: "doctor added successfully" });
  } catch (err) {
    console.error('Error adding doctor:', err);
    res.status(500).json({ error: "error adding doctor" });
  }
});

//********************************* GET all doctors with staff info ***********************************
router.get('/doctors', async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT 
        d.staff_id,
        s.name,
        s.username,
        s.email,
        s.phone_no,
        s.gender,
        s.nic,
        s.branch_id,
        b.name as branch_name,
        d.speciality
       FROM doctor d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN branch b ON s.branch_id = b.branch_id
       ORDER BY s.name`
    );

    res.json(rows);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ error: 'Server error fetching doctors' });
  }
});

//********************************* GET doctor by staff_id ***********************************
router.get('/doctors/:staff_id', async (req, res) => {
  const { staff_id } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT 
        d.staff_id,
        s.name,
        s.username,
        s.email,
        s.phone_no,
        s.gender,
        s.nic,
        s.branch_id,
        b.name as branch_name,
        b.address as branch_address,
        d.speciality
       FROM doctor d
       INNER JOIN staff s ON d.staff_id = s.staff_id
       LEFT JOIN branch b ON s.branch_id = b.branch_id
       WHERE d.staff_id = ?`,
      [staff_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching doctor:', err);
    res.status(500).json({ error: 'Server error fetching doctor' });
  }
});

//**********************************SIGNUP********************************************* */

router.post('/signup', async (req, res) => { // TEST PASS
  const { staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ errro: "Please provide username, email and password" });
  }
  try {
    const [existingUser] = await db.execute(
      `SELECT * FROM staff WHERE username = ? OR email = ?`, [username, email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(`INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [staff_id, username, name, category, phone_no, gender, nic, email, hashedPassword, branch_id]);
    res.status(201).json({ message: "staff added successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});



//**************************SIGN IN*********************************************** */
router.post('/signin', async (req, res) => { // TEST PASS
  const { username, password } = req.body;

  console.log('🔐 Staff Login Attempt:', { username, timestamp: new Date().toISOString() });

  if (!username || !password) {
    console.log('❌ Missing credentials');
    return res.status(400).json({ error: "please provide username or password" });
  }

  try {
    // 🔑 CHECK FOR SUPER ADMIN (HARDCODED) FIRST
    const SUPER_ADMIN_USERNAME = process.env.Admin_username || "admin";
    const SUPER_ADMIN_PASSWORD = process.env.Admin_password || "admin123";

    if (username === SUPER_ADMIN_USERNAME && password === SUPER_ADMIN_PASSWORD) {
      console.log('👑 Super Admin Login - Hardcoded Credentials');
      
      const payload = {
        user: {
          id: 'SUPER_ADMIN',
          username: SUPER_ADMIN_USERNAME,
          category: 'Super Admin',
          role: 'admin'
        }
      };

      jwt.sign(
        payload,
        SECRET_KEY,
        { expiresIn: '6h' },
        (err, token) => {
          if (err) throw err;
          console.log('✅ Super Admin Login successful');
          return res.json({
            message: "Super Admin Login Successful",
            token,
            user: {
              id: 'SUPER_ADMIN',
              username: SUPER_ADMIN_USERNAME,
              name: 'Super Administrator',
              email: 'superadmin@clinic.com',
              category: 'Super Admin',
              role: 'admin'
            }
          });
        }
      );
      return; // Exit early for super admin
    }

    // Regular database staff lookup
    const [rows] = await db.execute(`SELECT * FROM staff WHERE username = ?`, [username]);
    console.log('📊 User lookup result:', rows.length > 0 ? 'User found' : 'User not found');

    if (rows.length === 0) {
      console.log('❌ Invalid username');
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const staff = rows[0];
    console.log('👤 Staff found:', { id: staff.staff_id, category: staff.category });

    // Verify password
    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) {
      console.log('❌ Invalid password');
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log('✅ Password verified');

    // Map category to role for frontend dashboard
    let userRole = "staff"; // default for Nurse, Other, etc.
    if (staff.category === "Admin") {
      userRole = "admin";
    } else if (staff.category === "Branch Manager") {
      userRole = "branch_manager";
    } else if (staff.category === "Doctor") {
      userRole = "doctor";
    }

    //create payload
    const payload = {
      user: {
        id: staff.staff_id,
        username: staff.username,
        category: staff.category,
        role: userRole
      }
    };

    //Generate token
    jwt.sign(
      payload,
      SECRET_KEY,
      { expiresIn: '6h' },
      (err, token) => {
        if (err) throw err;
        console.log('✅ Login successful:', { username: staff.username, role: userRole });
        res.json({
          message: "Login Successfull",
          token,
          user: {
            id: staff.staff_id,
            username: staff.username,
            name: staff.name,
            email: staff.email,
            category: staff.category,
            role: userRole
          }
        });
      }
    )

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }

});

//**************************DELETE staff by ID (Admin only)******************************************
router.delete('/:id', staffAuth(['Admin', 'Super Admin']), async (req, res) => {
  const staff_id = req.params.id;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check if staff exists
    const [staff] = await connection.execute(`SELECT * FROM staff WHERE staff_id = ?`, [staff_id]);
    
    if(staff.length === 0){
      await connection.rollback();
      return res.status(404).json({error: "Staff member not found"});
    }

    const staffCategory = staff[0].category;
    let deletedCounts = {
      invoices: 0,
      payments: 0,
      treatments: 0,
      appointments: 0,
      doctors: 0
    };

    // If staff is a doctor, delete all related data first
    if(staffCategory === 'Doctor') {
      // Check if this staff is in the doctor table
      const [doctor] = await connection.execute(`SELECT * FROM doctor WHERE staff_id = ?`, [staff_id]);
      
      if(doctor.length > 0) {
        // Get all appointments for this doctor
        const [appointments] = await connection.execute(
          `SELECT appointment_id FROM appointment WHERE doctor_id = ?`,
          [staff_id]
        );

        if(appointments.length > 0) {
          const appointmentIds = appointments.map(a => a.appointment_id);
          const placeholders = appointmentIds.map(() => '?').join(',');

          // Get all payments for these appointments
          const [payments] = await connection.execute(
            `SELECT payment_id FROM payment WHERE appointment_id IN (${placeholders})`,
            appointmentIds
          );

          if(payments.length > 0) {
            const paymentIds = payments.map(p => p.payment_id);
            const paymentPlaceholders = paymentIds.map(() => '?').join(',');

            // Delete invoices
            const [invoiceResult] = await connection.execute(
              `DELETE FROM invoice WHERE payment_id IN (${paymentPlaceholders})`,
              paymentIds
            );
            deletedCounts.invoices = invoiceResult.affectedRows;
          }

          // Delete payments
          const [paymentResult] = await connection.execute(
            `DELETE FROM payment WHERE appointment_id IN (${placeholders})`,
            appointmentIds
          );
          deletedCounts.payments = paymentResult.affectedRows;

          // Delete treatments
          const [treatmentResult] = await connection.execute(
            `DELETE FROM treatment WHERE appointment_id IN (${placeholders})`,
            appointmentIds
          );
          deletedCounts.treatments = treatmentResult.affectedRows;
        }

        // Delete appointments
        const [appointmentResult] = await connection.execute(
          `DELETE FROM appointment WHERE doctor_id = ?`,
          [staff_id]
        );
        deletedCounts.appointments = appointmentResult.affectedRows;

        // Delete from doctor table
        const [doctorResult] = await connection.execute(
          `DELETE FROM doctor WHERE staff_id = ?`,
          [staff_id]
        );
        deletedCounts.doctors = doctorResult.affectedRows;
      }
    }

    // Delete the staff member
    const [result] = await connection.execute(`DELETE FROM staff WHERE staff_id = ?`, [staff_id]);

    await connection.commit();

    console.log(`✅ Staff deleted: ${staff_id} (${staffCategory})`);
    console.log(`📊 Deleted counts:`, deletedCounts);

    res.status(200).json({ 
      message: "Staff member and all associated data successfully deleted",
      staff_id: staff_id,
      category: staffCategory,
      deleted: deletedCounts
    });
  }
  catch (err) {
    await connection.rollback();
    console.error('Error deleting staff:', err);
    res.status(500).json({ error: "Error deleting staff", details: err.message });
  } finally {
    connection.release();
  }
});

module.exports = router;