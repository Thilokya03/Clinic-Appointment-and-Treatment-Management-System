# 🚀 Quick Start Guide - Automated Billing System

## ✅ Everything is Ready!

All backend and frontend features have been implemented and connected. Here's how to start using the system:

---

## 🎯 Start the Application

### Step 1: Start Backend
```bash
cd "E:\Projects\Clinic Appointment and Treatment Management System\backend"
npm start
```

**Expected output:**
```
server running at http://localhost:3000
✓ paymentRoutes loaded
✓ claimRoutes loaded
```

### Step 2: Start Frontend
```bash
cd "E:\Projects\Clinic Appointment and Treatment Management System\frontend"
npm run dev
```

**Expected output:**
```
  ➜  Local:   http://localhost:5173/
```

### Step 3: Login
- Open browser: http://localhost:5173
- Go to Login page
- Use admin/staff credentials

---

## 🎨 New Features Available

### 1. Patient Balance Search
**Navigate:** Dashboard → Patient Balance

**Try it:**
1. Search for patient: "P0001"
2. Click "View Details"
3. See complete payment history
4. Check outstanding balance

---

### 2. Insurance Claim Management
**Navigate:** Dashboard → Insurance Claims

**Try it:**
1. Click "Submit New Claim"
2. Select a payment
3. Select insurance company
4. Enter percentage (e.g., 30)
5. Submit
6. Watch invoice auto-create!

---

## 🧪 Test the Complete Flow

### Quick Test Scenario

**1. Go to Patient Balance**
- Search: "P0001"
- Note the outstanding amount

**2. Go to Insurance Claims**
- Click "Submit New Claim"
- Select payment PM001
- Select any insurance company
- Enter 30% coverage
- Click "Submit Claim"
- ✅ Success! Claim created

**3. Return to Patient Balance**
- Search: "P0001" again
- Outstanding should be LOWER now
- Insurance amount added to "Total Paid"

---

## 📋 Menu Navigation

### Admin Users See:
- Dashboard
- Manage Branches
- Manage Branch Managers
- **Manage Payments** ← NEW
- **Patient Balance** ← NEW
- **Insurance Claims** ← NEW

### Branch Manager Users See:
- Dashboard
- Manage Branch
- **Manage Payments** ← NEW
- **Patient Balance** ← NEW
- **Insurance Claims** ← NEW

### Staff/Nurse Users See:
- Dashboard
- Staff Management
- **Manage Payments** ← NEW
- **Patient Balance** ← NEW
- **Insurance Claims** ← NEW (Nurse only)

---

## 🎯 Key Features

### Patient Balance Page
✅ Search patients by ID, name, phone, NIC
✅ See outstanding balance at a glance
✅ View detailed payment history
✅ Color-coded: Green = Paid, Red = Outstanding
✅ Shows invoices linked to payments

### Insurance Claim Page
✅ Submit new claims with percentage
✅ Auto-calculate claim amounts
✅ View all claims in table
✅ Edit claim percentages
✅ Delete claims (with refund)
✅ See patient and insurance info

### Automated Features
✅ Appointment → Payment created
✅ Treatment → Payment updated
✅ Claim → Payment updated → Invoice created
✅ Patient pays → Invoice updated
✅ All calculations automatic

---

## 🔍 What to Look For

### In Patient Balance:
- Total Billed = Sum of all payment totals
- Total Paid = Insurance + Patient payments
- Outstanding = Total - Insurance - Patient - Discount

### In Insurance Claims:
- Claim Amount = Total × Percentage / 100
- When submitted:
  - ✅ Claim saved to database
  - ✅ Payment.insurance_paid_amount updated
  - ✅ Invoice created/updated automatically

---

## 📊 Example Calculations

### Payment: LKR 3,500
**Insurance Claim (30%):**
- Claim Amount = 3,500 × 30% = **1,050**
- Outstanding = 3,500 - 1,050 = **2,450**

**Patient Pays (2,250) + Discount (200):**
- Total Paid = 1,050 + 2,250 = **3,300**
- Outstanding = 3,500 - 3,300 = **200**
- After Discount = 200 - 200 = **0** ✅ PAID!

---

## 🎉 You're All Set!

The system is now fully operational with:

✅ **3 Database Triggers:**
1. after_appointment_insert
2. after_treatment_insert
3. after_payment_update

✅ **8 New API Endpoints:**
1. POST /api/claim
2. GET /api/claim/all
3. GET /api/claim/payment/:id
4. PUT /api/claim/:id
5. DELETE /api/claim/:id
6. GET /api/patient/search
7. GET /api/patient/balance/:id
8. (Existing) PUT /api/payment/:id

✅ **2 New Frontend Pages:**
1. Patient Balance Search
2. Insurance Claim Management

✅ **Updated Navigation:**
- Sidebar menu items
- Routes configured
- Role-based access

---

## 📚 Documentation

Read these files for more details:
- **SUCCESS_SUMMARY.md** - Complete system overview
- **COMPLETE_BILLING_SYSTEM.md** - Technical documentation
- **API_QUICK_REFERENCE.md** - API examples
- **FRONTEND_INTEGRATION_GUIDE.md** - Frontend usage guide
- **IMPLEMENTATION_SUMMARY.md** - What was built

---

## 💡 Quick Tips

1. **Search is flexible:** Can search partial name, phone, etc.
2. **Claims update automatically:** Invoices created when claim submitted
3. **Color coding helps:** Red = owes money, Green = fully paid
4. **Calculations are automatic:** No manual math needed
5. **Everything is connected:** Triggers handle the workflow

---

## 🐛 If Something Doesn't Work

**Backend not starting?**
```bash
cd backend
npm install
node server.js
```

**Frontend not starting?**
```bash
cd frontend
npm install
npm run dev
```

**Can't see new pages?**
- Check you're logged in as admin/staff
- Clear browser cache
- Refresh page

**API errors?**
- Check backend is running (http://localhost:3000)
- Check token in localStorage: `localStorage.getItem('catms_token')`
- Check console for error messages

---

## 🎊 Enjoy Your Automated Billing System!

Everything is automated from appointment to invoice. Just:
1. Create appointments
2. Add treatments
3. Submit insurance claims
4. Record patient payments
5. System handles the rest!

**No manual calculations needed!** 🎉

---

**Date:** October 21, 2025
**Status:** ✅ PRODUCTION READY
**Backend:** http://localhost:3000
**Frontend:** http://localhost:5173
