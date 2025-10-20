# Unified Dashboard Guide - Administrator & Branch Manager Backend Integration

## Overview
This guide explains how the Administrator and Branch Manager dashboards are connected to the backend API.

## Database Schema Updates

### Branch Table - Updated
The `branch` table now includes a `manager_id` field to link branch managers:

```sql
ALTER TABLE branch ADD COLUMN manager_id VARCHAR(5) NULL;
ALTER TABLE branch ADD CONSTRAINT fk_branch_manager 
  FOREIGN KEY (manager_id) REFERENCES staff(staff_id) 
  ON DELETE SET NULL ON UPDATE CASCADE;
```

### Staff Table - Category Update
Updated the staff category enum to include 'Branch Manager':

```sql
ALTER TABLE staff MODIFY COLUMN category 
  ENUM('Admin', 'Branch Manager', 'Nurse', 'Doctor', 'Other') NOT NULL;
```

## Backend API Endpoints

### Branch Routes (`/api/branch`)

#### 1. Get All Branches
```
GET /api/branch
Authorization: Bearer <token>
Allowed Roles: Admin, Branch Manager
```

**Response:**
```json
[
  {
    "branch_id": "B0001",
    "name": "Main Branch - Colombo",
    "address": "123 Galle Road, Colombo 03",
    "manager_id": "S0002",
    "manager_name": "John Silva"
  }
]
```

#### 2. Get Branch Statistics (Admin Only)
```
GET /api/branch/stats
Authorization: Bearer <token>
Allowed Roles: Admin
```

**Response:**
```json
{
  "totalBranches": 12,
  "branchManagers": 8,
  "totalDoctors": 45,
  "totalPatients": 1247
}
```

#### 3. Get Branch by ID
```
GET /api/branch/:id
Authorization: Bearer <token>
Allowed Roles: Admin, Branch Manager
```

**Response:**
```json
{
  "branch_id": "B0001",
  "name": "Main Branch - Colombo",
  "address": "123 Galle Road, Colombo 03",
  "manager_id": "S0002",
  "manager_name": "John Silva",
  "manager_email": "john.silva@catms.com"
}
```

#### 4. Create Branch (Admin Only)
```
POST /api/branch
Authorization: Bearer <token>
Allowed Roles: Admin
```

**Request Body:**
```json
{
  "branch_id": "B0013",
  "name": "Kandy Branch",
  "address": "45 Peradeniya Road, Kandy",
  "manager_id": "S0010" // Optional
}
```

**Response:**
```json
{
  "message": "Branch added successfully"
}
```

#### 5. Update Branch (Admin Only)
```
PUT /api/branch/:id
Authorization: Bearer <token>
Allowed Roles: Admin
```

**Request Body:**
```json
{
  "name": "Kandy Central Branch",
  "address": "45 Peradeniya Road, Kandy",
  "manager_id": "S0010"
}
```

#### 6. Delete Branch (Admin Only)
```
DELETE /api/branch/:id
Authorization: Bearer <token>
Allowed Roles: Admin
```

#### 7. Assign Manager to Branch (Admin Only)
```
POST /api/branch/:id/assign-manager
Authorization: Bearer <token>
Allowed Roles: Admin
```

**Request Body:**
```json
{
  "manager_id": "S0010"
}
```

#### 8. Get All Branch Managers (Admin Only)
```
GET /api/branch/managers/list
Authorization: Bearer <token>
Allowed Roles: Admin
```

**Response:**
```json
[
  {
    "staff_id": "S0002",
    "username": "john.silva",
    "name": "John Silva",
    "email": "john.silva@catms.com",
    "phone_no": "0771234567",
    "branch_id": "B0001",
    "branch_name": "Main Branch - Colombo"
  }
]
```

### Staff Routes (`/api/staff`)

#### 1. Get All Staff
```
GET /api/staff/all
Authorization: Bearer <token>
Allowed Roles: Admin, Branch Manager
```

**Response:**
```json
[
  {
    "staff_id": "S0001",
    "username": "admin",
    "name": "System Administrator",
    "category": "Admin",
    "phone_no": "0771234567",
    "gender": "Male",
    "nic": "199012345678",
    "email": "admin@catms.com",
    "branch_id": "B0001"
  }
]
```

#### 2. Get Staff by Category
```
GET /api/staff/by-category/:category
Authorization: Bearer <token>
Allowed Roles: Admin, Branch Manager
```

**Example:** `GET /api/staff/by-category/Doctor`

**Response:**
```json
[
  {
    "staff_id": "S0005",
    "username": "dr.silva",
    "name": "Dr. Amal Silva",
    "category": "Doctor",
    "phone_no": "0771234568",
    "gender": "Male",
    "nic": "198512345678",
    "email": "dr.silva@catms.com",
    "branch_id": "B0001"
  }
]
```

## Frontend Integration

### AdminDashboard Component

The AdminDashboard fetches real-time statistics from the backend:

```javascript
useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    const token = localStorage.getItem('catms_token');
    const response = await axios.get('/api/branch/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setStats(response.data);
  } catch (err) {
    console.error('Error fetching stats:', err);
  }
};
```

**Stats Displayed:**
- Total Branches (from database)
- Branch Managers (from database)
- Total Doctors (from database)
- Total Patients (from database)

### BranchManagerDashboard Component

The BranchManagerDashboard fetches staff statistics:

```javascript
const fetchStats = async () => {
  const token = localStorage.getItem('catms_token');
  
  // Fetch doctors
  const doctorsRes = await axios.get('/api/staff/by-category/Doctor', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  // Fetch all staff
  const staffRes = await axios.get('/api/staff/all', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  setStats({
    totalDoctors: doctorsRes.data.length,
    totalStaff: staffRes.data.filter(s => 
      s.category !== 'Doctor' && s.category !== 'Admin'
    ).length
  });
};
```

## Authentication & Authorization

### Role Mapping
The backend automatically maps staff categories to frontend roles:

```javascript
// In staffRoutes.js signin endpoint
let userRole = "staff"; // default
if (staff.category === "Admin") {
  userRole = "admin";
} else if (staff.category === "Branch Manager") {
  userRole = "branch_manager";
} else if (staff.category === "Doctor") {
  userRole = "doctor";
}
```

### Protected Routes
Routes are protected based on roles:

```javascript
// In App.jsx
<Route path="branchmanagers" element={
  <ProtectedRoute allowedRoles={['admin']}>
    <BranchManagers />
  </ProtectedRoute>
} />

<Route path="staff" element={
  <ProtectedRoute allowedRoles={['admin', 'branch_manager']}>
    <Staff />
  </ProtectedRoute>
} />
```

## Creating Test Data

### 1. Create Branches
```sql
INSERT INTO branch (branch_id, name, address) VALUES
('B0001', 'Main Branch - Colombo', '123 Galle Road, Colombo 03'),
('B0002', 'Kandy Branch', '45 Peradeniya Road, Kandy'),
('B0003', 'Galle Branch', '78 Matara Road, Galle');
```

### 2. Create Branch Manager
```javascript
// Run in backend directory
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createBranchManager() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'catms'
  });

  const password = 'manager123';
  const hashedPassword = await bcrypt.hash(password, 10);

  await connection.execute(
    `INSERT INTO staff (staff_id, username, name, category, phone_no, gender, nic, email, password, branch_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'S0002',
      'manager1',
      'John Silva',
      'Branch Manager',
      '0771234568',
      'Male',
      '198512345678',
      'manager@catms.com',
      hashedPassword,
      'B0001'
    ]
  );

  console.log('✅ Branch Manager created!');
  console.log('Username: manager1');
  console.log('Password: manager123');
  
  await connection.end();
}

createBranchManager();
```

### 3. Assign Manager to Branch
```sql
UPDATE branch SET manager_id = 'S0002' WHERE branch_id = 'B0001';
```

## Testing the Integration

### Test Admin Dashboard:
1. Login as admin (username: `admin`, password: `admin123`)
2. Select "Staff" on login page
3. Dashboard should show:
   - Real branch count from database
   - Real branch manager count
   - Real doctor count
   - Real patient count

### Test Branch Manager Dashboard:
1. Create a branch manager account (see script above)
2. Login as branch manager (username: `manager1`, password: `manager123`)
3. Select "Staff" on login page
4. Dashboard should show:
   - Real doctor count
   - Real staff count
   - Appointments (to be implemented)
   - Branch rating

### Test API Endpoints:
```bash
# Get all branches (as admin)
curl -X GET http://localhost:3000/api/branch \
  -H "Authorization: Bearer <admin_token>"

# Get branch statistics (as admin)
curl -X GET http://localhost:3000/api/branch/stats \
  -H "Authorization: Bearer <admin_token>"

# Create branch (as admin)
curl -X POST http://localhost:3000/api/branch \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"branch_id":"B0004","name":"Test Branch","address":"Test Address"}'

# Get all branch managers
curl -X GET http://localhost:3000/api/branch/managers/list \
  -H "Authorization: Bearer <admin_token>"
```

## Error Handling

### Common Errors:

#### 401 Unauthorized
- **Cause**: Invalid or missing token
- **Solution**: Ensure user is logged in and token is in localStorage

#### 403 Forbidden
- **Cause**: User role not allowed to access endpoint
- **Solution**: Check allowedRoles in ProtectedRoute

#### 404 Not Found
- **Cause**: Branch or staff member doesn't exist
- **Solution**: Verify IDs exist in database

#### 500 Server Error
- **Cause**: Database error or server issue
- **Solution**: Check backend logs and database connection

## Next Steps

### To Fully Integrate:
1. ✅ Backend routes created for branches and stats
2. ✅ AdminDashboard connected to backend
3. ✅ BranchManagerDashboard connected to backend
4. 🔄 Create pages for:
   - Manage Branches (CRUD operations)
   - Manage Branch Managers (assign/remove)
   - View Reports
5. 🔄 Add real-time appointment statistics
6. 🔄 Add activity logs from database

## Summary

✅ **Completed:**
- Backend API routes for branch management
- Backend API routes for staff management
- Role-based authentication and authorization
- AdminDashboard with real-time stats
- BranchManagerDashboard with real-time stats
- Database schema updates for branch managers

🔄 **Pending:**
- Full CRUD UI for branches
- Branch manager assignment UI
- Reports generation system
- Real-time appointment statistics
- Activity logging system

The dashboards are now fully connected to the backend and display real data from the database!
