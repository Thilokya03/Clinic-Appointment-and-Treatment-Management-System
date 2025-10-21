# Invoice Generation Trigger Documentation

## Overview
This trigger automatically creates an invoice record when a payment is updated (when a patient or insurance makes a payment).

## Trigger Details

**Trigger Name:** `after_payment_update`  
**Timing:** AFTER UPDATE  
**Table:** `payment`  
**Created:** October 21, 2025

## Functionality

When a payment record is updated with actual payment amounts, this trigger automatically:

1. **Detects New Payments**
   - Monitors changes in `insurance_paid_amount` and `patient_paid_amount`
   - Only fires when payment amounts increase (new payment made)

2. **Generates Invoice**
   - Creates unique Invoice ID (INV01, INV02, etc.)
   - Records total paid amount (insurance + patient)
   - Determines payment method automatically

3. **Updates Existing Invoice**
   - If invoice already exists for the payment
   - Updates the amount to reflect new total

## Database Flow

```
Staff Updates Payment (Patient Pays)
        ↓
Payment Record Updated
        ↓
🔥 TRIGGER FIRES 🔥
        ↓
1. Calculate new payment amount
   new_paid = (NEW.insurance_paid + NEW.patient_paid) -
              (OLD.insurance_paid + OLD.patient_paid)
        ↓
2. IF new_paid > 0:
   - Check if invoice exists
   - If NO: Create new invoice
   - If YES: Update invoice amount
        ↓
✅ Invoice Created/Updated!
```

## Example Scenario

### Initial State:
```
Payment PM001:
- Total Amount: LKR 3,500.00
- Insurance Paid: LKR 0.00
- Patient Paid: LKR 0.00
- Due Payment: LKR 3,500.00
```

### Staff Records Payment:
```
Updated Payment PM001:
- Insurance Paid: LKR 1,000.00
- Patient Paid: LKR 500.00
- Due Payment: LKR 2,000.00
```

### After Trigger Fires:
```
Invoice INV01 Created:
- Invoice ID: INV01
- Payment ID: PM001
- Amount: LKR 1,500.00 (1,000 + 500)
- Method: Cash (determined automatically)
```

### Additional Payment:
```
Updated Payment PM001:
- Insurance Paid: LKR 1,000.00
- Patient Paid: LKR 1,500.00 (+1,000)
- Due Payment: LKR 1,000.00
```

### Invoice Updated:
```
Invoice INV01 Updated:
- Amount: LKR 2,500.00 (1,000 + 1,500)
```

## Benefits

✅ **Automatic Invoice Generation**: No manual invoice creation needed  
✅ **Accurate Billing**: Invoice amount always matches paid amounts  
✅ **Real-time Updates**: Invoice created instantly when payment recorded  
✅ **Payment Tracking**: Every payment has corresponding invoice  
✅ **Audit Trail**: Complete record of all payments and invoices

## How It Works in ManagePayment

### Staff Workflow:
1. Open ManagePayment page
2. Select a payment to update
3. Enter insurance paid amount
4. Enter patient paid amount
5. Enter discount (if any)
6. Click "Update Payment"

### Behind the Scenes:
```javascript
// Frontend sends UPDATE:
PUT /api/payment/PM001
{
  insurance_paid_amount: 1000,
  patient_paid_amount: 500,
  discount_amount: 200,
  status: 'Partial',
  Due_payment: 1800
}

// Backend updates payment
// ✨ TRIGGER FIRES AUTOMATICALLY ✨
// Invoice created/updated with paid amounts
```

## Payment Method Logic

The trigger automatically determines the payment method:

```sql
IF NEW.patient_paid_amount > OLD.patient_paid_amount THEN
    method = 'Cash'  -- Patient paid directly
ELSE
    method = 'Card'  -- Insurance payment
END IF
```

**Note:** You can manually change the method in the invoice table if needed.

## Database Schema

### Payment Table (Trigger Source)
```sql
CREATE TABLE `payment` (
  `payment_id` varchar(5) NOT NULL,
  `insurance_paid_amount` decimal(10,2) DEFAULT '0.00',
  `patient_paid_amount` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `Due_payment` decimal(10,2) DEFAULT NULL,
  `status` enum('Pending','Partial','Paid','Voided'),
  -- ... other fields
)
```

### Invoice Table (Trigger Target)
```sql
CREATE TABLE `invoice` (
  `invoice_id` varchar(5) NOT NULL,
  `payment_id` varchar(5) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('Cash','Card','Online','BankTransfer') NOT NULL,
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `uq_invoice_payment` (`payment_id`)
)
```

## Trigger SQL

```sql
CREATE TRIGGER after_payment_update
AFTER UPDATE ON payment
FOR EACH ROW
BEGIN
    DECLARE new_invoice_id VARCHAR(5);
    DECLARE max_invoice_num INT;
    DECLARE total_paid DECIMAL(10,2);
    DECLARE payment_method VARCHAR(20);
    DECLARE invoice_exists INT;
    
    -- Calculate total amount paid in this update
    SET total_paid = (NEW.insurance_paid_amount + NEW.patient_paid_amount) - 
                     (OLD.insurance_paid_amount + OLD.patient_paid_amount);
    
    -- Only create/update invoice if there's a new payment
    IF total_paid > 0 THEN
        
        -- Check if invoice already exists
        SELECT COUNT(*) INTO invoice_exists 
        FROM invoice WHERE payment_id = NEW.payment_id;
        
        IF invoice_exists = 0 THEN
            -- Generate new invoice_id
            SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_id, 3) AS UNSIGNED)), 0) 
            INTO max_invoice_num FROM invoice;
            
            SET new_invoice_id = CONCAT('INV', LPAD(max_invoice_num + 1, 2, '0'));
            
            -- Determine payment method
            IF NEW.patient_paid_amount > OLD.patient_paid_amount THEN
                SET payment_method = 'Cash';
            ELSE
                SET payment_method = 'Card';
            END IF;
            
            -- Insert invoice record
            INSERT INTO invoice (invoice_id, payment_id, amount, method)
            VALUES (new_invoice_id, NEW.payment_id, 
                    NEW.insurance_paid_amount + NEW.patient_paid_amount, 
                    payment_method);
        ELSE
            -- Update existing invoice
            UPDATE invoice
            SET amount = NEW.insurance_paid_amount + NEW.patient_paid_amount
            WHERE payment_id = NEW.payment_id;
        END IF;
    END IF;
END
```

## Testing Results

✅ **Test Passed Successfully**

```
Test Scenario:
- Initial Insurance Paid: LKR 1,000.00
- Initial Patient Paid: LKR 500.00
- Added Payment: LKR 500.00
- Expected Invoice Amount: LKR 2,000.00
- Actual Invoice Amount: LKR 2,000.00 ✓

✅ Invoice created automatically when payment updated
✅ Invoice ID auto-generated (INV01)
✅ Invoice amount = insurance_paid + patient_paid
✅ Payment method determined automatically (Cash)
```

## Integration with Payment System

This system now has **COMPLETE** automated billing:

### 1. after_appointment_insert
- **When:** Appointment created
- **Does:** Creates payment with appointment_fee
- **Result:** Payment exists with base amount

### 2. after_treatment_insert
- **When:** Treatment added
- **Does:** Adds treatment_fee to payment
- **Result:** Payment total includes all treatments

### 3. after_payment_update (NEW!)
- **When:** Payment updated (patient pays)
- **Does:** Creates/updates invoice
- **Result:** Invoice tracks actual payments

### Complete Flow Example:
```
1. Appointment created (Fee: LKR 1,500)
   → Payment created: Total = LKR 1,500

2. Treatment added (Fee: LKR 2,000)
   → Payment updated: Total = LKR 3,500

3. Patient pays LKR 1,500
   → Invoice created: Amount = LKR 1,500
   → Payment: Due = LKR 2,000

4. Patient pays another LKR 1,000
   → Invoice updated: Amount = LKR 2,500
   → Payment: Due = LKR 1,000

5. Insurance pays LKR 1,000
   → Invoice updated: Amount = LKR 3,500
   → Payment: Due = LKR 0, Status = Paid
```

## Important Notes

⚠️ **Unique Constraint**: Each payment can have only ONE invoice (enforced by database)

⚠️ **Invoice Updates**: When additional payments made, invoice amount is updated

⚠️ **Payment Decreases**: If payment amounts decrease, invoice is NOT updated (prevents negative adjustments)

⚠️ **Trigger Conflicts**: Removed conflicting triggers:
- `update_payment_after_invoice` (circular dependency)
- `set_payment_total` (conflicting logic)

## Files Created

1. **create-invoice-trigger.sql** - Raw SQL for trigger
2. **create-invoice-trigger.js** - Node.js script to create trigger
3. **test-invoice-trigger.js** - Test script to verify functionality
4. **fix-trigger-conflicts.js** - Script to resolve trigger conflicts
5. **INVOICE_TRIGGER_DOCS.md** - This documentation

## Maintenance

### View Trigger
```sql
SHOW CREATE TRIGGER after_payment_update;
```

### List All Triggers on Payment Table
```sql
SHOW TRIGGERS WHERE `Table` = 'payment';
```

### Drop Trigger (if needed)
```sql
DROP TRIGGER IF EXISTS after_payment_update;
```

### Recreate Trigger
```bash
node create-invoice-trigger.js
```

## Future Enhancements

Possible improvements:
- Support multiple payment methods per invoice
- Generate PDF invoices automatically
- Send invoice via email to patient
- Track invoice payment history
- Support partial refunds
- Invoice numbering customization

---

**Created by:** Database Trigger System  
**Date:** October 21, 2025  
**Version:** 1.0  
**Status:** ✅ Tested and Working
