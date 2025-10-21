# Payment Trigger Documentation

## Overview
This trigger automatically creates a payment record whenever a new appointment is created in the system.

## Trigger Details

**Trigger Name:** `after_appointment_insert`  
**Timing:** AFTER INSERT  
**Table:** `appointment`  
**Created:** October 21, 2025

## Functionality

When a new appointment is inserted into the `appointment` table, this trigger automatically:

1. **Generates a unique Payment ID**
   - Format: `PM001`, `PM002`, `PM003`, etc.
   - Auto-increments based on existing payment records
   - Ensures no duplicate payment IDs

2. **Creates a Payment Record** with the following data:
   - `payment_id`: Auto-generated (PM###)
   - `appointment_id`: Links to the new appointment
   - `patient_id`: Copies from the appointment
   - `total_amount`: Set to the appointment fee
   - `insurance_paid_amount`: Initialized to 0.00
   - `patient_paid_amount`: Initialized to 0.00
   - `Due_payment`: Set equal to total_amount (appointment fee)
   - `status`: Set to 'Pending'

## Benefits

✅ **Automatic Payment Tracking**: No need to manually create payment records  
✅ **Data Consistency**: Ensures every appointment has a corresponding payment  
✅ **Reduced Errors**: Eliminates human error in payment record creation  
✅ **Audit Trail**: Automatic tracking from appointment creation  
✅ **Simplified Workflow**: Staff can focus on updating payment status rather than creating records

## Example Flow

### Before Trigger:
1. Patient books appointment (fee: LKR 320.00)
2. Staff manually creates payment record
3. Staff enters all payment details
4. Risk of missing/incorrect data

### After Trigger:
1. Patient books appointment (fee: LKR 320.00)
2. ✨ **Payment record auto-created** ✨
   - Payment ID: PM001
   - Total Amount: LKR 320.00
   - Due Payment: LKR 320.00
   - Status: Pending
3. Staff only needs to update payment when patient pays

## How to Use

### For Frontend (SetAppointment.jsx, etc.)
Simply create an appointment as usual:
```javascript
await axios.post(`${API_URL}/appointment`, {
  appointment_id: 'A0001',
  patient_id: 'P0001',
  schedule_id: 'DS0001',
  appointment_date: '2025-10-21',
  start_time: '10:00:00',
  end_time: '10:30:00',
  appointment_fee: 320.00,
  status: 'Scheduled'
});
// Payment record is automatically created! No additional API call needed.
```

### For Staff (ManagePayment.jsx)
Staff can now:
1. View existing payment records (auto-created with appointments)
2. Update payment status when patient pays
3. Record insurance and patient paid amounts
4. No need to manually create payment records

## Database Schema

### Appointment Table (Source)
```sql
CREATE TABLE `appointment` (
  `appointment_id` varchar(5) NOT NULL,
  `patient_id` varchar(5) NOT NULL,
  `appointment_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `schedule_id` varchar(10) NOT NULL,
  -- ... other fields
)
```

### Payment Table (Target)
```sql
CREATE TABLE `payment` (
  `payment_id` varchar(5) NOT NULL,
  `appointment_id` varchar(5) NOT NULL,
  `patient_id` varchar(5) NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `insurance_paid_amount` decimal(10,2) DEFAULT '0.00',
  `patient_paid_amount` decimal(10,2) DEFAULT '0.00',
  `Due_payment` decimal(10,2) DEFAULT NULL,
  `status` enum('Pending','Partial','Paid','Voided') DEFAULT 'Pending',
  -- ... constraints
)
```

## Testing

The trigger has been tested and verified to work correctly:
- ✅ Payment record created automatically
- ✅ Payment ID auto-incremented properly
- ✅ Total amount matches appointment fee
- ✅ Due payment equals total amount
- ✅ Status set to Pending
- ✅ Foreign key relationships maintained

Test Results:
```
✅ TRIGGER TEST PASSED! ✅

📌 The trigger is working correctly:
   ✓ Payment record auto-generated when appointment created
   ✓ Payment ID auto-incremented
   ✓ Total amount set to appointment fee
   ✓ Due payment equals total amount
   ✓ Status set to Pending
```

## Files Created

1. **create-payment-trigger.sql** - Raw SQL for trigger creation
2. **create-payment-trigger.js** - Node.js script to create trigger
3. **test-payment-trigger.js** - Test script to verify trigger functionality
4. **PAYMENT_TRIGGER_DOCS.md** - This documentation file

## Maintenance

### View Trigger
```sql
SHOW CREATE TRIGGER after_appointment_insert;
```

### List All Triggers
```sql
SHOW TRIGGERS;
```

### Drop Trigger (if needed)
```sql
DROP TRIGGER IF EXISTS after_appointment_insert;
```

### Recreate Trigger
```bash
node create-payment-trigger.js
```

## Important Notes

⚠️ **Cascading Deletes**: If an appointment is deleted, the associated payment will also be deleted (CASCADE)

⚠️ **Payment ID Format**: Uses 3-digit padding (PM001-PM999). If you need more than 999 payments, modify the trigger's LPAD function.

⚠️ **Total Amount Calculation**: Currently sets total_amount = appointment_fee. If you need to add treatment costs, this will need to be updated separately.

## Future Enhancements

Possible improvements:
- Auto-calculate total based on appointment fee + treatments
- Send notification when payment record is created
- Auto-apply insurance discounts based on patient's insurance plan
- Generate payment invoice number automatically

---

**Created by:** Database Migration System  
**Date:** October 21, 2025  
**Version:** 1.0
