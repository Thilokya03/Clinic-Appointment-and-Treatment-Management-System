-- ============================================
-- CASCADE DELETE SETUP FOR BRANCH DELETION
-- ============================================
-- This script updates foreign key constraints to enable cascade deletion
-- When a branch is deleted, all associated records will be automatically deleted
-- 
-- WARNING: This will delete ALL related data including:
-- - Staff (Branch Managers, Doctors, Nurses, etc.)
-- - Doctors (and their doctor-specific data)
-- - Appointments (and their treatments)
-- - This action affects data integrity across the system
-- 
-- Run this script BEFORE attempting to delete branches with associated data
-- ============================================

USE catms;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- Update staff table foreign key
-- Change from ON DELETE RESTRICT to ON DELETE CASCADE
-- ============================================
ALTER TABLE staff 
DROP FOREIGN KEY fk_staff_branch;

ALTER TABLE staff 
ADD CONSTRAINT fk_staff_branch 
FOREIGN KEY (branch_id) REFERENCES branch(branch_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- ============================================
-- Update appointment table foreign keys
-- Change doctor foreign key from RESTRICT to CASCADE
-- ============================================
ALTER TABLE appointment 
DROP FOREIGN KEY fk_appt_doctor;

ALTER TABLE appointment 
ADD CONSTRAINT fk_appt_doctor 
FOREIGN KEY (doctor_id) REFERENCES doctor(staff_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- ============================================
-- Update payment table foreign keys for better cascade handling
-- Change from RESTRICT to CASCADE for appointments
-- ============================================
ALTER TABLE payment 
DROP FOREIGN KEY fk_payment_appointment;

ALTER TABLE payment 
ADD CONSTRAINT fk_payment_appointment 
FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Update patient foreign key to CASCADE as well
ALTER TABLE payment 
DROP FOREIGN KEY fk_payment_patient;

ALTER TABLE payment 
ADD CONSTRAINT fk_payment_patient 
FOREIGN KEY (patient_id) REFERENCES patient(patient_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- ============================================
-- Update invoice table to cascade when payment is deleted
-- ============================================
ALTER TABLE invoice 
DROP FOREIGN KEY fk_invoice_payment;

ALTER TABLE invoice 
ADD CONSTRAINT fk_invoice_payment 
FOREIGN KEY (payment_id) REFERENCES payment(payment_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- Verify the changes
-- ============================================
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME,
    DELETE_RULE,
    UPDATE_RULE
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE 
    TABLE_SCHEMA = 'catms'
    AND REFERENCED_TABLE_NAME IS NOT NULL
    AND TABLE_NAME IN ('staff', 'appointment', 'payment', 'invoice')
ORDER BY 
    TABLE_NAME, CONSTRAINT_NAME;

-- ============================================
-- CASCADE DELETION FLOW
-- ============================================
-- When a branch is deleted, the following cascade happens:
--
-- 1. Branch deleted
--    ↓
-- 2. All Staff in that branch deleted (CASCADE)
--    ↓
-- 3. All Doctors (from staff) deleted (CASCADE - already exists)
--    ↓
-- 4. All Appointments with those doctors deleted (CASCADE)
--    ↓
-- 5. All Treatments for those appointments deleted (CASCADE - already exists)
--    ↓
-- 6. All Payments for those appointments deleted (CASCADE)
--    ↓
-- 7. All Invoices for those payments deleted (CASCADE)
--
-- ============================================

SELECT 'CASCADE DELETE setup completed successfully!' as Status;
