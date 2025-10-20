-- ============================================================================
-- Database Schema Updates for CATMS (Clinic Appointment and Treatment Management System)
-- Date: October 20, 2025
-- ============================================================================
-- Run these commands to update your database schema if starting from the base Database.sql

USE catms;

-- ============================================================================
-- 1. UPDATE BRANCH TABLE - Add missing columns
-- ============================================================================

-- Add phone_no column (if not exists)
ALTER TABLE branch 
ADD COLUMN phone_no VARCHAR(15) NULL AFTER address;

-- Add email column (if not exists)
ALTER TABLE branch 
ADD COLUMN email VARCHAR(100) NULL AFTER phone_no;

-- Add manager_id column with foreign key (if not exists)
ALTER TABLE branch 
ADD COLUMN manager_id VARCHAR(5) NULL AFTER email;

-- Add foreign key constraint for manager_id
ALTER TABLE branch 
ADD CONSTRAINT fk_branch_manager 
FOREIGN KEY (manager_id) REFERENCES staff(staff_id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- ============================================================================
-- 2. UPDATE STAFF TABLE - Add 'Branch Manager' to category ENUM
-- ============================================================================

-- Modify category ENUM to include 'Branch Manager'
ALTER TABLE staff 
MODIFY COLUMN category ENUM('Admin', 'Branch Manager', 'Nurse', 'Doctor', 'Other') NOT NULL;

-- ============================================================================
-- 3. UPDATE STAFF TABLE - Make gender and nic nullable
-- ============================================================================

-- Make gender column nullable (was NOT NULL before)
ALTER TABLE staff 
MODIFY COLUMN gender ENUM('Male', 'Female') NULL;

-- Make nic column nullable (keep UNIQUE constraint)
ALTER TABLE staff 
MODIFY COLUMN nic VARCHAR(20) NULL;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify branch table structure
SELECT 'Branch Table Structure:' AS Info;
DESCRIBE branch;

-- Verify staff table structure
SELECT 'Staff Table Structure:' AS Info;
DESCRIBE staff;

-- Show category ENUM values
SELECT 'Staff Category ENUM Values:' AS Info;
SHOW COLUMNS FROM staff WHERE Field = 'category';

-- ============================================================================
-- SUMMARY OF CHANGES
-- ============================================================================
-- 
-- Branch Table:
--   - Added: phone_no VARCHAR(15) NULL
--   - Added: email VARCHAR(100) NULL
--   - Added: manager_id VARCHAR(5) NULL (FK to staff.staff_id)
--
-- Staff Table:
--   - Updated: category ENUM to include 'Branch Manager'
--   - Updated: gender ENUM to allow NULL
--   - Updated: nic VARCHAR(20) to allow NULL (maintains UNIQUE constraint)
--
-- ============================================================================
