const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
const { authenticate, staffAuth } = require('../middlewares/auth');
// const { message } = require("statuses");


//********************************* GET staff by category ***********************************
router.get('/by-category/:category', staffAuth(['Admin', 'Branch Manager']), async (req, res) => {
  const category = req.params.category;

  try {
    const [rows] = await db.execute(
      `SELECT staff_id, username, name, category, phone_no, gender, nic, email, branch_id 
       FROM staff WHERE category = ?`,
      [category]
    );

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

router.post('/staff', staffAuth(['admin']), async (req, res) => { // NO NEEEEEEEEEEEEEEEEDDDDD
  const { staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute("INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) "
      , [staff_id, username, name, category, phone_no, gender, nic, email, hashedPassword, branch_id]);
    res.status(201).json({ message: "Staff added successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// **************************ADD DOCTOR **********************************************

router.post('/doctor', staffAuth(['Admin']), async (req, res) => { // TEST PASS
  const { staff_id, speciality, reference_no } = req.body;

  try {

    await db.execute("INSERT INTO doctor (staff_id,speciality, reference_no) VALUES (?, ?, ?) "
      , [staff_id, speciality, reference_no]);
    res.status(201).json({ message: "doctor added successfully" });
  } catch (err) {
    res.status(500).json({ error: "error adding doctor" });
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
    await db.execute(`INSERT `)
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

//**************************DELETE a staff******************************************

router.delete('/', staffAuth(['admin']), async (req, res) => {
  const staff_id = req.user.id;

  try {
    await db.execute(`DELETE FROM staff WHERE staff_id=?`, [staff_id]);
    res.status(200).json({ message: "Staff successfully deleted" });
  }
  catch (err) {
    res.status(500).json({ error: "error deleting staff" });
  }
});

module.exports = router;