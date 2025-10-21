# 🎨 Frontend Integration Complete!

## ✅ What Has Been Connected

### 1. Patient Balance Search Page ✨
**Location:** `/dashboard/patient-balance`

**Features:**
- ✅ Search patients by ID, name, phone, or NIC
- ✅ View total billed, total paid, and outstanding balance
- ✅ Click any patient to see detailed payment history
- ✅ Color-coded outstanding amounts (red = owed, green = paid)
- ✅ Shows all payments with invoice information

**Access:** Admin, Branch Manager, Staff, Nurse

**File:** `frontend/src/pages/PatientBalance/PatientBalance.jsx`

---

### 2. Insurance Claim Management Page ✨
**Location:** `/dashboard/insurance-claims`

**Features:**
- ✅ View all insurance claims in table
- ✅ Submit new claim with payment selector
- ✅ Auto-calculate claim amount from percentage
- ✅ Edit claim percentage
- ✅ Delete claims (with refund)
- ✅ Shows patient info and insurance company

**Access:** Admin, Branch Manager, Nurse

**File:** `frontend/src/pages/InsuranceClaim/InsuranceClaim.jsx`

---

### 3. Updated Navigation (Sidebar) ✨
**File:** `frontend/src/compornent/LeftSlideBar/LeftslideBar.jsx`

**New Menu Items Added:**

**For Admin:**
- Manage Payments
- Patient Balance
- Insurance Claims

**For Branch Manager:**
- Manage Payments
- Patient Balance
- Insurance Claims

**For Staff:**
- Manage Payments
- Patient Balance

**For Nurse:**
- Manage Payments
- Patient Balance
- Insurance Claims

---

### 4. Updated Routes ✨
**File:** `frontend/src/App.jsx`

**New Routes:**
```javascript
/dashboard/patient-balance    → PatientBalance component
/dashboard/insurance-claims   → InsuranceClaim component
```

---

## 🚀 How to Use

### Start the Application

**Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:3000
```

**Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📖 User Guide

### Patient Balance Search

**Step 1:** Navigate to Patient Balance
- Click "Patient Balance" in sidebar
- OR go to `/dashboard/patient-balance`

**Step 2:** Search for Patient
- Enter patient ID (e.g., P0001)
- OR enter patient name (e.g., "John")
- OR enter phone number (e.g., "077")
- Click "Search" or press Enter

**Step 3:** View Results
- Table shows all matching patients
- See total billed, paid, and outstanding amounts
- Outstanding amount color-coded:
  - 🟢 Green = Fully paid (0.00)
  - 🔴 Red = Has outstanding balance

**Step 4:** View Details
- Click "View Details" button
- OR click anywhere on the patient row
- Dialog opens with:
  - Patient information
  - Financial summary (billed, paid, outstanding)
  - Complete payment history
  - Associated invoices

---

### Insurance Claim Management

**Step 1:** Navigate to Insurance Claims
- Click "Insurance Claims" in sidebar
- OR go to `/dashboard/insurance-claims`

**Step 2:** Submit New Claim
- Click "Submit New Claim" button
- Form opens with fields:
  - **Claim ID:** Auto-generated (e.g., CL123)
  - **Payment:** Select from dropdown
  - **Insurance Company:** Select from dropdown
  - **Coverage Percentage:** Enter 0-100

**Step 3:** Review Calculation
- System shows estimated claim amount
- Example: Total 3,500 × 30% = 1,050
- Click "Submit Claim"

**Step 4:** What Happens
- ✅ Claim saved to database
- ✅ Payment updated with insurance amount
- ✅ Invoice automatically created/updated
- ✅ Success message shows claim amount

**Step 5:** Manage Claims
- **Edit:** Click pencil icon → Change percentage
- **Delete:** Click trash icon → Claim removed, amount refunded

---

## 🎯 Complete Workflow Example

### Scenario: Patient Visit with Insurance

**1. Create Appointment (Existing)**
- Patient books appointment
- ✅ Payment PM001 auto-created: LKR 1,500

**2. Add Treatment (Existing)**
- Doctor adds root canal treatment
- ✅ Payment PM001 updated: LKR 3,500

**3. Search Patient Balance (NEW!)**
- Staff navigates to "Patient Balance"
- Searches for patient: "P0001"
- Result shows:
  - Total Billed: 3,500
  - Total Paid: 0
  - Outstanding: 3,500 🔴

**4. Submit Insurance Claim (NEW!)**
- Staff clicks "Insurance Claims"
- Clicks "Submit New Claim"
- Selects:
  - Payment: PM001
  - Insurance: ABC Insurance
  - Percentage: 30%
- System calculates: 3,500 × 30% = 1,050
- Clicks "Submit Claim"
- ✅ Success: "Claim amount: LKR 1,050"

**5. Verify in Patient Balance (NEW!)**
- Return to "Patient Balance"
- Search patient again
- Result shows:
  - Total Billed: 3,500
  - Total Paid: 1,050 ✅ (insurance)
  - Outstanding: 2,450 🔴

**6. Patient Pays (Existing)**
- Go to "Manage Payments"
- Edit payment PM001
- Enter:
  - Patient Paid: 2,250
  - Discount: 200
- Click "Update Payment"
- ✅ Invoice updated to 3,300

**7. Final Balance Check (NEW!)**
- Return to "Patient Balance"
- Search patient
- Result shows:
  - Total Billed: 3,500
  - Total Paid: 3,300 (1,050 + 2,250)
  - Outstanding: 0 🟢 PAID!

---

## 🖼️ Page Screenshots & Features

### Patient Balance Page

**Search Section:**
```
┌─────────────────────────────────────────────────┐
│  Patient Balance Search                         │
├─────────────────────────────────────────────────┤
│  [Search Patient________________] [Search 🔍]   │
└─────────────────────────────────────────────────┘
```

**Results Table:**
```
┌────────┬──────────┬──────────┬──────────┬──────────┬─────────┬──────────────┐
│ Pat ID │ Name     │ Phone    │ Email    │ Billed   │ Paid    │ Outstanding  │
├────────┼──────────┼──────────┼──────────┼──────────┼─────────┼──────────────┤
│ P0001  │ John Doe │ 07712... │ john@... │ 3,500.00 │ 600.00  │ 2,900.00 🔴  │
│ P0002  │ Jane Doe │ 07723... │ jane@... │ 2,000.00 │ 2,000.00│ 0.00 🟢      │
└────────┴──────────┴──────────┴──────────┴──────────┴─────────┴──────────────┘
```

**Details Dialog:**
```
┌────────────────────────────────────────────────────────────┐
│  Patient Balance Details                           [X]     │
├────────────────────────────────────────────────────────────┤
│  Patient Information                                        │
│  ID: P0001  Name: John Doe  Phone: 0771234567              │
│                                                             │
│  Financial Summary                                          │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │ Billed   │ Paid     │ Outstanding│ Payments│            │
│  │ 3,500.00 │ 600.00   │ 2,900.00  │ 1       │            │
│  └──────────┴──────────┴──────────┴──────────┘            │
│                                                             │
│  Payment History                                            │
│  ┌────────┬──────┬────────┬─────────┬────────┬──────┐    │
│  │ PM001  │ A0729│ 3,500  │ 100     │ 500    │ 2,900│    │
│  └────────┴──────┴────────┴─────────┴────────┴──────┘    │
└────────────────────────────────────────────────────────────┘
```

---

### Insurance Claim Page

**Header:**
```
┌─────────────────────────────────────────────────┐
│  Insurance Claims Management    [Submit New +]  │
└─────────────────────────────────────────────────┘
```

**Claims Table:**
```
┌──────┬────────┬────────┬──────────┬──────────┬──────┬──────┬────────┐
│ Claim│ Patient│ Payment│ Insurance│ Total    │ %    │ Claim│ Actions│
├──────┼────────┼────────┼──────────┼──────────┼──────┼──────┼────────┤
│ CL001│ John   │ PM001  │ ABC Ins  │ 3,500.00 │ 30%  │1,050 │ ✏️ 🗑️ │
│ CL002│ Jane   │ PM002  │ XYZ Ins  │ 2,000.00 │ 50%  │1,000 │ ✏️ 🗑️ │
└──────┴────────┴────────┴──────────┴──────────┴──────┴──────┴────────┘
```

**Submit Claim Dialog:**
```
┌───────────────────────────────────────┐
│  Submit New Insurance Claim           │
├───────────────────────────────────────┤
│  Claim ID: [CL123________] (disabled) │
│  Payment:  [Select Payment▼]          │
│  Insurance:[Select Insurance▼]        │
│  Percentage:[___30____]%              │
│                                       │
│  ℹ️ Estimated Claim: LKR 1,050.00     │
│                                       │
│  [Cancel]  [Submit Claim]             │
└───────────────────────────────────────┘
```

---

## 🔧 Technical Details

### API Integration

**Patient Balance Search:**
```javascript
// In PatientBalance.jsx
const response = await axios.get(
  `http://localhost:3000/api/patient/search?search=${searchTerm}`,
  { headers: { Authorization: `Bearer ${token}` }}
);
```

**Patient Balance Details:**
```javascript
const response = await axios.get(
  `http://localhost:3000/api/patient/balance/${patientId}`,
  { headers: { Authorization: `Bearer ${token}` }}
);
```

**Submit Insurance Claim:**
```javascript
await axios.post(
  'http://localhost:3000/api/claim',
  {
    claim_id: 'CL001',
    insurance_id: 'IN001',
    percentage: 30,
    payment_id: 'PM001'
  },
  { headers: { Authorization: `Bearer ${token}` }}
);
```

---

## 📁 Files Created

### New Frontend Files
✅ `frontend/src/pages/PatientBalance/PatientBalance.jsx`
✅ `frontend/src/pages/PatientBalance/PatientBalance.css`
✅ `frontend/src/pages/InsuranceClaim/InsuranceClaim.jsx`
✅ `frontend/src/pages/InsuranceClaim/InsuranceClaim.css`

### Modified Frontend Files
✅ `frontend/src/App.jsx` - Added routes
✅ `frontend/src/compornent/LeftSlideBar/LeftslideBar.jsx` - Added menu items

---

## 🎨 UI Features

### Material-UI Components Used
- ✅ TextField - Search inputs
- ✅ Button - Actions
- ✅ Table - Data display
- ✅ Dialog - Modals
- ✅ Chip - Status badges
- ✅ Alert - Success/Error messages
- ✅ Card - Content sections
- ✅ Grid - Responsive layout
- ✅ CircularProgress - Loading states

### Responsive Design
- ✅ Mobile-friendly tables
- ✅ Adaptive grid layouts
- ✅ Touch-friendly buttons
- ✅ Scrollable content

### Color Coding
- 🟢 Green - Fully paid / Success
- 🔴 Red - Outstanding / Error
- 🟡 Yellow - Partial payment / Warning
- 🔵 Blue - Information / Primary actions

---

## ✅ Testing Checklist

### Patient Balance Page
- [ ] Navigate to /dashboard/patient-balance
- [ ] Search for patient by ID
- [ ] Search for patient by name
- [ ] View patient balance details
- [ ] Check color coding for outstanding amounts
- [ ] Verify payment history displays correctly
- [ ] Check invoice information shows

### Insurance Claim Page
- [ ] Navigate to /dashboard/insurance-claims
- [ ] View existing claims
- [ ] Click "Submit New Claim"
- [ ] Select payment from dropdown
- [ ] Select insurance company
- [ ] Enter percentage
- [ ] Verify calculation preview
- [ ] Submit claim
- [ ] Check success message
- [ ] Edit existing claim
- [ ] Delete claim
- [ ] Verify refund message

### Integration Testing
- [ ] Create appointment → Check payment created
- [ ] Add treatment → Check payment updated
- [ ] Submit claim → Check payment updated with insurance amount
- [ ] Search patient → Verify balance shows claim amount
- [ ] Update payment → Check invoice created
- [ ] View patient details → Verify invoice appears

---

## 🐛 Troubleshooting

### Issue: "401 Unauthorized"
**Solution:** Token not set correctly
```javascript
// Check token in browser console
localStorage.getItem('catms_token')
// Should return a JWT token string
```

### Issue: "No patients found"
**Solution:** Database might be empty
```bash
# Check backend is running
cd backend
npm start

# Test API directly
curl http://localhost:3000/api/patient/search
```

### Issue: Pages not showing in sidebar
**Solution:** Check user role
```javascript
// In browser console
localStorage.getItem('catms_role')
// Should return: 'admin', 'branch_manager', 'staff', or 'nurse'
```

### Issue: Insurance companies dropdown empty
**Solution:** Add insurance companies via admin panel or API

---

## 🎉 Success!

You now have a **complete automated billing system** with:

✅ **Backend Features:**
- Auto-create payment on appointment
- Auto-add treatment fees
- Auto-create invoices
- Insurance claim management
- Patient balance tracking

✅ **Frontend Features:**
- Patient balance search page
- Insurance claim management page
- Updated navigation
- Responsive design
- Real-time calculations

✅ **Integration:**
- All APIs connected
- Routes configured
- Sidebar navigation
- Role-based access

---

**Ready to test!** 🚀

Login as admin/staff → Navigate to new pages → Test the features!

---

**Created:** October 21, 2025
**Status:** ✅ FULLY INTEGRATED
**Next:** Test all features and enjoy the automated billing system!
