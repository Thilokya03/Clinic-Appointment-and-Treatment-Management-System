-- Update branch table schema to add missing columns
-- Run this script in MySQL to update your database

USE catms;

-- Add phone_no column
ALTER TABLE branch 
ADD COLUMN phone_no VARCHAR(15) NULL AFTER address;

-- Add email column
ALTER TABLE branch 
ADD COLUMN email VARCHAR(100) NULL AFTER phone_no;

-- Add manager_id column with foreign key
ALTER TABLE branch 
ADD COLUMN manager_id VARCHAR(5) NULL AFTER email,
ADD CONSTRAINT fk_branch_manager 
FOREIGN KEY (manager_id) REFERENCES staff(staff_id) 
ON DELETE SET NULL 
ON UPDATE CASCADE;

-- Verify the changes
DESCRIBE branch;
