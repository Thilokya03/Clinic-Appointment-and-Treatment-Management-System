-- Database Schema Updates for Branch Manager Support
-- Run these queries to update your existing database

-- 1. Update staff category to include Branch Manager
ALTER TABLE staff MODIFY COLUMN category 
  ENUM('Admin', 'Branch Manager', 'Nurse', 'Doctor', 'Other') NOT NULL;

-- 2. Add manager_id to branch table
ALTER TABLE branch ADD COLUMN IF NOT EXISTS manager_id VARCHAR(5) NULL;

-- 3. Add foreign key constraint for manager
ALTER TABLE branch ADD CONSTRAINT fk_branch_manager 
  FOREIGN KEY (manager_id) REFERENCES staff(staff_id) 
  ON DELETE SET NULL ON UPDATE CASCADE;

-- 4. Sample data: Create test branches
INSERT INTO branch (branch_id, name, address) VALUES
('B0001', 'Main Branch - Colombo', '123 Galle Road, Colombo 03'),
('B0002', 'Kandy Branch', '45 Peradeniya Road, Kandy'),
('B0003', 'Galle Branch', '78 Matara Road, Galle')
ON DUPLICATE KEY UPDATE branch_id=branch_id;

-- Note: Use the create-branch-manager.js script to create branch manager accounts
-- with properly hashed passwords
