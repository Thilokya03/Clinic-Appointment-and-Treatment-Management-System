# 🔧 Admin Login Troubleshooting - SOLVED

## ✅ Admin Account Status
- **Username**: `admin`
- **Password**: `admin123`  
- **Status**: ✅ Created and verified in database
- **Password Hash**: ✅ Matches correctly

## 🎯 How to Login (Step by Step)

### Step 1: Restart Backend Server
The backend code has been updated with role mapping. You need to restart it:

**In PowerShell:**
```powershell
# Find the backend process
netstat -ano | findstr :3000

# Kill it (replace 8004 with your PID)
taskkill /PID 8004 /F

# Navigate to backend
cd backend

# Start server again
node server.js
```

### Step 2: Go to Login Page
Open browser: `http://localhost:5173/login`

### Step 3: **IMPORTANT - Select "Staff" Toggle**
⚠️ **This is the most common mistake!**

On the login page, you'll see two toggle buttons:
```
[ Patient ]  [ Staff ]
```

**You MUST click on "Staff"** - it should be highlighted/selected.

### Step 4: Enter Credentials
```
Username: admin
Password: admin123
```

### Step 5: Click "Sign In"

### Expected Result:
✅ You should be redirected to `/dashboard`  
✅ You should see the **AdminDashboard** with:
- Manage Branches
- Manage Branch Managers
- Generate Reports
- System Settings

---

## 🐛 Why You Got 401 Error

The 401 Unauthorized error happens because:

1. ❌ **Wrong Role Toggle**: If you selected "Patient" instead of "Staff"
   - Patient endpoint: `/api/patient/signin` (admin doesn't exist there)
   - Staff endpoint: `/api/staff/signin` ✅ (admin exists here)

2. ❌ **Backend Not Restarted**: Old code without role mapping
   - Need to restart backend after code changes

3. ❌ **Wrong Credentials**: Typo in username or password
   - ✅ Verified: Your credentials are correct

---

## 📋 Quick Checklist

Before trying to login:
- [ ] Backend server is running on port 3000
- [ ] Frontend is running on port 5173
- [ ] Selected **"Staff"** toggle (not Patient)
- [ ] Username is `admin` (lowercase, no spaces)
- [ ] Password is `admin123` (no spaces)
- [ ] Backend has been restarted after code changes

---

## 🔍 If Still Having Issues

### Check Backend Logs
When you try to login, the backend console should show:
```
🔐 Staff Login Attempt: { username: 'admin', timestamp: '...' }
📊 User lookup result: User found
👤 Staff found: { id: 'S0001', category: 'Admin' }
✅ Password verified
✅ Login successful: { username: 'admin', role: 'admin' }
```

If you don't see these logs, the backend needs to be restarted.

### Check Browser Console
Open browser DevTools (F12) and check:
- Network tab: Should show POST to `/api/staff/signin` (not `/api/patient/signin`)
- Response: Should show user object with `role: "admin"`

---

## 🎬 Video Instructions (Step by Step)

1. **Restart backend** → See server start message
2. **Open login page** → `http://localhost:5173/login`
3. **Click "Staff" toggle** → It should be highlighted
4. **Type username** → `admin`
5. **Type password** → `admin123`
6. **Click Sign In** → Redirects to dashboard
7. **See Admin Dashboard** → With admin features

---

## ✨ Success Indicators

After successful login, you should see:
1. URL changes to `/dashboard`
2. Badge in top-right shows "Administrator" or admin role
3. Four cards appear:
   - 📋 Manage Branches
   - 👥 Manage Branch Managers  
   - 📊 Generate Reports
   - ⚙️ System Settings
4. Statistics showing:
   - Total Branches
   - Branch Managers
   - Total Doctors
   - System Rating

---

## 🆘 Still Not Working?

Run these diagnostic commands:

```powershell
cd backend

# Test if admin exists
node test-login.js

# Check database connection
node -e "require('./db').execute('SELECT 1').then(() => console.log('DB OK'))"

# Check if server is running
netstat -ano | findstr :3000
```

All should return success! ✅
