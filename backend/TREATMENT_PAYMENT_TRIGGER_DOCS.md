# Treatment-Payment Trigger Documentation

## Overview
This trigger automatically updates the payment record when a treatment is added to an appointment, increasing the total amount and due payment by the treatment fee.

## Trigger Details

**Trigger Name:** `after_treatment_insert`  
**Timing:** AFTER INSERT  
**Table:** `treatment`  
**Created:** October 21, 2025

## Functionality

When a new treatment is added via the Staff.jsx "Add Treatment" feature, this trigger automatically:

1. **Fetches the Treatment Fee**
   - Looks up `treatment_fee` from `treatment_catalog` table
   - Uses the `catalog_id` from the newly inserted treatment

2. **Updates the Payment Record**
   - Finds the payment using the `appointment_id`
   - Adds treatment fee to `total_amount`
   - Adds treatment fee to `Due_payment`
   - Keeps the payment status and other fields unchanged

## Database Flow

```
Staff Adds Treatment
        ↓
Treatment Record Created
        ↓
🔥 TRIGGER FIRES 🔥
        ↓
1. SELECT treatment_fee FROM treatment_catalog WHERE catalog_id = [new treatment's catalog_id]
        ↓
2. UPDATE payment 
   SET total_amount = total_amount + treatment_fee,
       Due_payment = Due_payment + treatment_fee
   WHERE appointment_id = [new treatment's appointment_id]
        ↓
✅ Payment Updated!
```

## Example Scenario

### Initial State:
```
Appointment A0729:
- Appointment Fee: LKR 1,500.00

Payment PM001:
- Total Amount: LKR 1,500.00
- Due Payment: LKR 1,500.00
- Status: Pending
```

### Staff Adds Treatment:
```
Treatment T001:
- Catalog ID: C0001 (Root Canal)
- Treatment Fee: LKR 2,000.00
- Appointment ID: A0729
```

### After Trigger Fires:
```
Payment PM001:
- Total Amount: LKR 3,500.00 (1,500 + 2,000)
- Due Payment: LKR 3,500.00 (1,500 + 2,000)
- Status: Pending (unchanged)
```

## Benefits

✅ **Automatic Cost Calculation**: Treatment costs automatically added to bill  
✅ **Accurate Billing**: Total reflects appointment fee + all treatments  
✅ **Real-time Updates**: Payment updated instantly when treatment added  
✅ **Data Consistency**: No manual calculation errors  
✅ **Staff Efficiency**: Staff just add treatments, billing updates automatically

## How It Works in Staff.jsx

### Staff Workflow:
1. Staff opens "Add Treatment" tab in Staff Dashboard
2. Searches for patient
3. Selects patient's appointment
4. Chooses treatment from catalog
5. Clicks "Add Treatment"

### Behind the Scenes:
```javascript
// Frontend sends:
POST /api/treatment
{
  treatment_id: "T1729...",
  catalog_id: "C0001",
  appointment_id: "A0729",
  description: "Root canal treatment"
}

// Backend inserts treatment
// ✨ TRIGGER FIRES AUTOMATICALLY ✨
// Payment updated with treatment fee
```

## Database Schema

### Treatment Table (Trigger Source)
```sql
CREATE TABLE `treatment` (
  `treatment_id` varchar(20) NOT NULL,
  `catalog_id` varchar(5) NOT NULL,
  `appointment_id` varchar(5) NOT NULL,
  `description` text,
  PRIMARY KEY (`treatment_id`),
  FOREIGN KEY (`catalog_id`) REFERENCES `treatment_catalog` (`catalog_id`),
  FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`)
)
```

### Treatment Catalog Table (Fee Source)
```sql
CREATE TABLE `treatment_catalog` (
  `catalog_id` varchar(5) NOT NULL,
  `treatment_name` varchar(150) NOT NULL,
  `treatment_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`catalog_id`)
)
```

### Payment Table (Trigger Target)
```sql
CREATE TABLE `payment` (
  `payment_id` varchar(5) NOT NULL,
  `appointment_id` varchar(5) NOT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `Due_payment` decimal(10,2) DEFAULT NULL,
  `status` enum('Pending','Partial','Paid','Voided'),
  -- ... other fields
)
```

## Trigger SQL

```sql
CREATE TRIGGER after_treatment_insert
AFTER INSERT ON treatment
FOR EACH ROW
BEGIN
    DECLARE treatment_cost DECIMAL(10,2);
    
    -- Get the treatment fee from treatment_catalog
    SELECT treatment_fee INTO treatment_cost
    FROM treatment_catalog
    WHERE catalog_id = NEW.catalog_id;
    
    -- Update the payment record for this appointment
    -- Add treatment cost to both total_amount and Due_payment
    UPDATE payment
    SET 
        total_amount = total_amount + treatment_cost,
        Due_payment = Due_payment + treatment_cost
    WHERE appointment_id = NEW.appointment_id;
END
```

## Testing Results

✅ **Test Passed Successfully**

```
Test Scenario:
- Initial Payment Total: LKR 1,500.00
- Treatment Fee Added: LKR 2,000.00
- Expected Result: LKR 3,500.00
- Actual Result: LKR 3,500.00 ✓

✅ Treatment fee fetched from catalog
✅ Payment total_amount increased correctly
✅ Payment Due_payment increased correctly
✅ Correct payment record updated using appointment_id
```

## Integration with Other Triggers

This system now has **TWO** triggers working together:

### 1. after_appointment_insert
- **When:** Appointment is created
- **Does:** Creates payment record with appointment_fee
- **Result:** Payment exists with base fee

### 2. after_treatment_insert (NEW!)
- **When:** Treatment is added to appointment
- **Does:** Adds treatment_fee to existing payment
- **Result:** Payment total reflects appointment + treatments

### Flow Example:
```
1. Patient books appointment (Fee: LKR 1,500)
   → after_appointment_insert fires
   → Payment created: Total = LKR 1,500

2. Staff adds Treatment 1 (Fee: LKR 2,000)
   → after_treatment_insert fires
   → Payment updated: Total = LKR 3,500

3. Staff adds Treatment 2 (Fee: LKR 1,000)
   → after_treatment_insert fires
   → Payment updated: Total = LKR 4,500
```

## Payment Status Management

The trigger only updates amounts, not status. Status is managed by ManagePayment page:

- **Pending**: No payments made yet (total_amount > 0, patient_paid = 0)
- **Partial**: Some payment made (Due_payment > 0, but some paid)
- **Paid**: Fully paid (Due_payment = 0)
- **Voided**: Cancelled payment

## Important Notes

⚠️ **Multiple Treatments**: Each treatment added will increment the payment total

⚠️ **Treatment Deletion**: If a treatment is deleted, payment is NOT automatically decreased (manual adjustment needed)

⚠️ **Catalog Changes**: If treatment_fee changes in catalog AFTER treatment is added, payment is NOT updated

⚠️ **Foreign Keys**: Treatment must have valid catalog_id and appointment_id

## Files Created

1. **create-treatment-payment-trigger.sql** - Raw SQL for trigger
2. **create-treatment-payment-trigger.js** - Node.js script to create trigger
3. **test-treatment-payment-trigger.js** - Test script to verify functionality
4. **TREATMENT_PAYMENT_TRIGGER_DOCS.md** - This documentation

## Maintenance

### View Trigger
```sql
SHOW CREATE TRIGGER after_treatment_insert;
```

### List All Triggers on Treatment Table
```sql
SHOW TRIGGERS WHERE `Table` = 'treatment';
```

### Drop Trigger (if needed)
```sql
DROP TRIGGER IF EXISTS after_treatment_insert;
```

### Recreate Trigger
```bash
node create-treatment-payment-trigger.js
```

## Future Enhancements

Possible improvements:
- Trigger to decrease payment when treatment is deleted
- Update payment if catalog treatment_fee changes
- Send notification when treatment fee exceeds threshold
- Auto-apply discounts for multiple treatments
- Track payment history for audit purposes

## Complete System Overview

### Payment Lifecycle:
```
1. APPOINTMENT CREATED
   ↓
   [after_appointment_insert trigger]
   ↓
   Payment record created (appointment_fee)
   
2. TREATMENT ADDED
   ↓
   [after_treatment_insert trigger] ← NEW!
   ↓
   Payment total increased (+ treatment_fee)
   
3. STAFF RECORDS PAYMENT
   ↓
   [ManagePayment page]
   ↓
   Insurance/Patient amounts recorded
   Due payment calculated
   Status updated
```

---

**Created by:** Database Migration System  
**Date:** October 21, 2025  
**Version:** 1.0  
**Status:** ✅ Tested and Working
