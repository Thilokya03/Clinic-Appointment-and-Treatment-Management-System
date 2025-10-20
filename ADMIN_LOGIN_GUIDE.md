# Administrator Login Guide

## Overview
To login as an Administrator in CATMS, you need to create an admin staff account in the database first, then use the staff login with the appropriate credentials.

## Understanding the System

### Staff Categories
The `staff` table has a `category` field with the following values:
- `Admin` - System administrators
- `Doctor` - Medical doctors
- `Nurse` - Nursing staff
- `Other` - Other staff members

### Login Flow
1. Administrators login through the **Staff** login option (not Patient)
2. The system checks the `category` field to determine the role
3. Based on the category, users are mapped to dashboard roles:
   - `Admin` → `admin` role → AdminDashboard
   - `Doctor` → `doctor` role → DoctorDashboard
   - `Nurse`/`Other` → `staff` role → StaffDashboard

## Step 1: Create an Admin Account in Database

You need to insert an admin user into the `staff` table. Here's how:

### Option A: Using SQL Directly

1. Open your MySQL client or phpMyAdmin
2. Connect to the `catms` database
3. Run the following SQL command:

```sql
-- First, make sure you have a branch (check existing branches)
SELECT * FROM branch;

-- If no branches exist, create one first
INSERT INTO branch (branch_id, location, phone_no, manager_id)
VALUES ('B0001', 'Main Branch - Colombo', '0112345678', NULL);

-- Now create an admin user
INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id)
VALUES (
  'S0001',                                                          -- staff_id
  'admin',                                                          -- username
  'System Administrator',                                           -- name
  'Admin',                                                          -- category (must be 'Admin')
  '0771234567',                                                     -- phone_no
  'Male',                                                           -- gender
  '199012345678',                                                   -- nic
  'admin@catms.com',                                                -- email
  '$2b$10$YourHashedPasswordHere',                                 -- password (hashed)
  'B0001'                                                           -- branch_id
);
```

### Option B: Using a Script to Hash Password

Create a file `create-admin.js` in your backend folder:

```javascript
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'catms'
  });

  try {
    // Hash the password
    const password = 'admin123'; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if branch exists
    const [branches] = await connection.execute('SELECT * FROM branch LIMIT 1');
    
    let branchId;
    if (branches.length === 0) {
      // Create a branch first
      branchId = 'B0001';
      await connection.execute(
        'INSERT INTO branch (branch_id, location, phone_no) VALUES (?, ?, ?)',
        [branchId, 'Main Branch - Colombo', '0112345678']
      );
      console.log('✅ Branch created:', branchId);
    } else {
      branchId = branches[0].branch_id;
      console.log('✅ Using existing branch:', branchId);
    }

    // Create admin user
    await connection.execute(
      `INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'S0001',
        'admin',
        'System Administrator',
        'Admin',
        '0771234567',
        'Male',
        '199012345678',
        'admin@catms.com',
        hashedPassword,
        branchId
      ]
    );

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Role: Staff (select Staff on login page)');

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('⚠️  Admin user already exists!');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await connection.end();
  }
}

createAdmin();
```

Run the script:
```powershell
cd backend
node create-admin.js
```

## Step 2: Update Backend to Map Admin Role

The current staff signin returns `role: "staff"` for all staff. We need to map the category to the appropriate role:

Update `backend/Routes/staffRoutes.js` signin endpoint around line 118:

**Current code:**
```javascript
const payload = {
  user:{
    id:staff.staff_id,
    username:staff.username,
    category:staff.category,
    role:"staff"
  }
};
```

**Should be changed to:**
```javascript
// Map category to role for frontend
let userRole = "staff"; // default
if (staff.category === "Admin") {
  userRole = "admin";
} else if (staff.category === "Doctor") {
  userRole = "doctor";
} else {
  userRole = "staff"; // Nurse, Other, etc.
}

const payload = {
  user:{
    id:staff.staff_id,
    username:staff.username,
    category:staff.category,
    role: userRole
  }
};
```

And in the response:
```javascript
res.json({
  message: "Login Successfull",
  token,
  user: {
    id:staff.staff_id,
    username: staff.username,
    name: staff.name,
    email:staff.email,
    category:staff.category,
    role: userRole  // Add this
  }
});
```

## Step 3: Update Login.jsx to Handle Role from Backend

Update `frontend/src/pages/Login/Login.jsx` to use the role from backend response:

**Current code:**
```javascript
const { data } = await axios.post(endpoint, { username, password });
login(data.user, data.token, role);
```

**Should be changed to:**
```javascript
const { data } = await axios.post(endpoint, { username, password });
// Use the role from backend response if available, otherwise use selected role
const userRole = data.user?.role || role;
login(data.user, data.token, userRole);
```

## Step 4: Login as Administrator

1. **Open the application**: Navigate to `http://localhost:5173/login`

2. **Select Role**: Click on the **Staff** toggle button (not Patient)

3. **Enter Credentials**:
   - Username: `admin`
   - Password: `admin123` (or whatever you set)

4. **Click Sign In**

5. **You will be redirected to**: `/dashboard` which will show the **AdminDashboard** with:
   - Manage Branches
   - Manage Branch Managers
   - Generate Reports
   - System Settings

## Alternative: Quick Test Admin Credentials

If you want to test quickly without setting up the database properly, you can temporarily modify the signin endpoint to accept a test admin account:

Add this to `backend/Routes/staffRoutes.js` at the beginning of the signin route:

```javascript
router.post('/signin', async(req, res) => {
  const {username, password} = req.body;

  // TEST ADMIN - Remove this in production!
  if (username === 'testadmin' && password === 'admin123') {
    const token = jwt.sign(
      { user: { id: 'S0001', username: 'testadmin', category: 'Admin', role: 'admin' } },
      SECRET_KEY,
      { expiresIn: '6h' }
    );
    return res.json({
      message: "Login Successful",
      token,
      user: {
        id: 'S0001',
        username: 'testadmin',
        name: 'Test Administrator',
        email: 'admin@test.com',
        category: 'Admin',
        role: 'admin'
      }
    });
  }

  // ... rest of the code
```

Then login with:
- Username: `testadmin`
- Password: `admin123`
- Role: **Staff**

## Summary

**Login Steps:**
1. ✅ Create admin account in database with `category = 'Admin'`
2. ✅ Update backend to map `Admin` category to `admin` role
3. ✅ Go to login page
4. ✅ Select **Staff** (not Patient)
5. ✅ Enter admin username and password
6. ✅ Click Sign In
7. ✅ You'll see the AdminDashboard!

## Troubleshooting

### Issue: "Invalid credentials"
- Check that the admin account exists in the database
- Verify the password is correctly hashed
- Check the username is exact (case-sensitive)

### Issue: Shows Staff dashboard instead of Admin dashboard
- Verify the `category` field in database is `'Admin'` (capital A)
- Check that backend mapping is updated to return `role: "admin"`
- Clear browser localStorage and login again

### Issue: "Cannot POST /api/staff/signin"
- Ensure backend server is running
- Check that staffRoutes is properly mounted in server.js
- Verify CORS is configured correctly

## Default Test Credentials (After Setup)

| Role | Username | Password | Select on Login Page |
|------|----------|----------|---------------------|
| Administrator | `admin` | `admin123` | **Staff** |
| Doctor | (create in DB) | (set password) | **Staff** |
| Staff | (create in DB) | (set password) | **Staff** |
| Patient | (register) | (set password) | **Patient** |

**Important**: Always select **Staff** on the login page toggle for Admin, Doctor, and Staff roles!
