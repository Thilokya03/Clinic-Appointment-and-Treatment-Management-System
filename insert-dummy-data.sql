-- ========================================
-- CLINIC APPOINTMENT AND TREATMENT MANAGEMENT SYSTEM
-- DUMMY DATA INSERTION SCRIPT
-- ========================================
-- This script inserts comprehensive dummy data for all tables
-- Run this after creating the database schema

USE `catms`;

-- Disable foreign key checks temporarily for easier insertion
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- 2. INSERT BRANCHES
-- ========================================
INSERT INTO `branch` (`branch_id`, `name`, `address`, `phone_no`, `email`, `manager_id`) VALUES
('B0001', 'Main Branch - Colombo', 'Galle Road, Colombo 07', '0112345671', 'colombo@dentalclinic.lk', NULL),
('B0002', 'Kandy Branch', '123 Peradeniya Road, Kandy', '0812234567', 'kandy@dentalclinic.lk', NULL),
('B0003', 'Galle Branch', '456 Matara Road, Galle', '0912234567', 'galle@dentalclinic.lk', NULL),
('B0004', 'Negombo Branch', '789 Kurana Road, Negombo', '0312234567', 'negombo@dentalclinic.lk', NULL),
('B0005', 'Jaffna Branch', '321 Hospital Road, Jaffna', '0212234567', 'jaffna@dentalclinic.lk', NULL);

-- ========================================
-- 3. INSERT STAFF (Admin, Branch Managers, Doctors, Nurses)
-- ========================================
-- Password for all staff: "password123" (hashed with bcrypt)
INSERT INTO `staff` (`staff_id`, `username`, `name`, `category`, `phone_no`, `gender`, `nic`, `email`, `password`, `branch_id`, `reference_no`) VALUES
-- Admin
('S0001', 'admin', 'Dr. Rajesh Kumar', 'Admin', '0771234567', 'Male', '198512345678', 'admin@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0001', 1001),

-- Branch Managers
('S0002', 'bmanager_col', 'Saman Perera', 'Branch Manager', '0772234567', 'Male', '198712345679', 'saman.p@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0001', 1002),
('S0003', 'bmanager_kan', 'Nimal Silva', 'Branch Manager', '0773234567', 'Male', '198812345680', 'nimal.s@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0002', 1003),
('S0004', 'bmanager_gal', 'Kamala Jayasinghe', 'Branch Manager', '0774234567', 'Female', '198912345681', 'kamala.j@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0003', 1004),
('S0005', 'bmanager_neg', 'Ravi Fernando', 'Branch Manager', '0775234567', 'Male', '199012345682', 'ravi.f@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0004', 1005),
('S0006', 'bmanager_jaf', 'Priya Ramesh', 'Branch Manager', '0776234567', 'Female', '199112345683', 'priya.r@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0005', 1006),

-- Doctors
('S0007', 'dr_sunil', 'Dr. Sunil Wijesinghe', 'Doctor', '0777234567', 'Male', '198012345684', 'sunil.w@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0001', 2001),
('S0008', 'dr_anura', 'Dr. Anura Dissanayake', 'Doctor', '0778234567', 'Male', '198112345685', 'anura.d@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0001', 2002),
('S0009', 'dr_maya', 'Dr. Maya Rodrigo', 'Doctor', '0779234567', 'Female', '198212345686', 'maya.r@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0002', 2003),
('S0010', 'dr_kasun', 'Dr. Kasun Bandara', 'Doctor', '0771134567', 'Male', '198312345687', 'kasun.b@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0002', 2004),
('S0011', 'dr_tharaka', 'Dr. Tharaka Gunasekara', 'Doctor', '0772134567', 'Male', '198412345688', 'tharaka.g@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0003', 2005),
('S0012', 'dr_sandya', 'Dr. Sandya Perera', 'Doctor', '0773134567', 'Female', '198512345689', 'sandya.p@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0004', 2006),
('S0013', 'dr_lalith', 'Dr. Lalith Jayawardena', 'Doctor', '0774134567', 'Male', '198612345690', 'lalith.j@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0005', 2007),

-- Nurses
('S0014', 'nurse_nimali', 'Nimali Wickramasinghe', 'Nurse', '0775134567', 'Female', '199212345691', 'nimali.w@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0001', 3001),
('S0015', 'nurse_chamila', 'Chamila Rathnayake', 'Nurse', '0776134567', 'Female', '199312345692', 'chamila.r@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0001', 3002),
('S0016', 'nurse_geetha', 'Geetha Samaraweera', 'Nurse', '0777134567', 'Female', '199412345693', 'geetha.s@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0002', 3003),
('S0017', 'nurse_sanduni', 'Sanduni Fernando', 'Nurse', '0778134567', 'Female', '199512345694', 'sanduni.f@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0003', 3004),
('S0018', 'nurse_dilani', 'Dilani Gunathilaka', 'Nurse', '0779134567', 'Female', '199612345695', 'dilani.g@dentalclinic.lk', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'B0004', 3005);

-- Update branch managers
UPDATE `branch` SET `manager_id` = 'S0002' WHERE `branch_id` = 'B0001';
UPDATE `branch` SET `manager_id` = 'S0003' WHERE `branch_id` = 'B0002';
UPDATE `branch` SET `manager_id` = 'S0004' WHERE `branch_id` = 'B0003';
UPDATE `branch` SET `manager_id` = 'S0005' WHERE `branch_id` = 'B0004';
UPDATE `branch` SET `manager_id` = 'S0006' WHERE `branch_id` = 'B0005';

-- ========================================
-- 4. INSERT DOCTORS (with specialities)
-- ========================================
INSERT INTO `doctor` (`staff_id`, `speciality`) VALUES
('S0007', 'Orthodontics'),
('S0008', 'Endodontics'),
('S0009', 'Periodontics'),
('S0010', 'Prosthodontics'),
('S0011', 'Oral Surgery'),
('S0012', 'Pediatric Dentistry'),
('S0013', 'General Dentistry');

-- ========================================
-- 5. INSERT PATIENTS
-- ========================================
-- Password for all patients: "password123" (hashed with bcrypt)
INSERT INTO `patient` (`patient_id`, `username`, `name`, `phone_no`, `age`, `gender`, `nic`, `email`, `password`, `emergencyContactName`, `emergencyContactNo`) VALUES
('P0001', 'john_doe', 'John Doe Silva', '0771234001', 35, 'Male', '198912345601', 'john.silva@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Jane Silva', '0772234001'),
('P0002', 'sarah_p', 'Sarah Perera', '0772234002', 28, 'Female', '199612345602', 'sarah.perera@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'David Perera', '0773234002'),
('P0003', 'michael_f', 'Michael Fernando', '0773234003', 42, 'Male', '198212345603', 'michael.f@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Lisa Fernando', '0774234003'),
('P0004', 'kavitha_r', 'Kavitha Rajendran', '0774234004', 31, 'Female', '199312345604', 'kavitha.r@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Ravi Rajendran', '0775234004'),
('P0005', 'amit_s', 'Amit Sharma', '0775234005', 25, 'Male', '199912345605', 'amit.sharma@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Priya Sharma', '0776234005'),
('P0006', 'nisha_g', 'Nisha Gunawardena', '0776234006', 38, 'Female', '198612345606', 'nisha.g@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Sunil Gunawardena', '0777234006'),
('P0007', 'rohan_d', 'Rohan Dissanayake', '0777234007', 45, 'Male', '197912345607', 'rohan.d@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Mala Dissanayake', '0778234007'),
('P0008', 'priyanka_m', 'Priyanka Mendis', '0778234008', 33, 'Female', '199112345608', 'priyanka.m@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Kumar Mendis', '0779234008'),
('P0009', 'ashan_j', 'Ashan Jayawardena', '0779234009', 27, 'Male', '199712345609', 'ashan.j@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Nimal Jayawardena', '0771134009'),
('P0010', 'dilini_w', 'Dilini Wickramasinghe', '0771134010', 29, 'Female', '199512345610', 'dilini.w@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Saman Wickramasinghe', '0772134010'),
('P0011', 'kasun_p', 'Kasun Pathirana', '0772134011', 36, 'Male', '198812345611', 'kasun.p@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Chamari Pathirana', '0773134011'),
('P0012', 'thilini_r', 'Thilini Rathnayake', '0773134012', 24, 'Female', '200012345612', 'thilini.r@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Gayan Rathnayake', '0774134012'),
('P0013', 'nuwan_k', 'Nuwan Kumara', '0774134013', 40, 'Male', '198412345613', 'nuwan.k@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Malini Kumara', '0775134013'),
('P0014', 'sandamali_s', 'Sandamali Samaraweera', '0775134014', 32, 'Female', '199212345614', 'sandamali.s@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Roshan Samaraweera', '0776134014'),
('P0015', 'tharindu_b', 'Tharindu Bandara', '0776134015', 26, 'Male', '199812345615', 'tharindu.b@email.com', '$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.', 'Anusha Bandara', '0777134015');

-- ========================================
-- 6. INSERT INSURANCE COMPANIES
-- ========================================
INSERT INTO `insurance` (`insurance_id`, `name`, `coverage_type`, `phone_no`) VALUES
('I0001', 'National Insurance Trust Fund', 'Full Coverage', '0112345678'),
('I0002', 'Sri Lanka Insurance Corporation', 'Partial Coverage', '0112345679'),
('I0003', 'Ceylinco Healthcare', 'Full Coverage', '0112345680'),
('I0004', 'AIA Insurance Lanka', 'Partial Coverage', '0112345681'),
('I0005', 'Union Assurance Health', 'Full Coverage', '0112345682'),
('I0006', 'Allianz Life Insurance', 'Partial Coverage', '0112345683');

-- ========================================
-- 7. INSERT TREATMENT CATALOG
-- ========================================
INSERT INTO `treatment_catalog` (`catalog_id`, `treatment_name`, `treatment_fee`) VALUES
('C0001', 'General Consultation', 1500.00),
('C0002', 'Teeth Cleaning (Scaling)', 3500.00),
('C0003', 'Tooth Filling (Composite)', 4500.00),
('C0004', 'Tooth Extraction (Simple)', 2500.00),
('C0005', 'Tooth Extraction (Surgical)', 5500.00),
('C0006', 'Root Canal Treatment', 12000.00),
('C0007', 'Crown Placement (Porcelain)', 25000.00),
('C0008', 'Dental Implant', 85000.00),
('C0009', 'Teeth Whitening', 15000.00),
('C0010', 'Braces Installation', 120000.00),
('C0011', 'Braces Adjustment', 5000.00),
('C0012', 'Dentures (Complete Set)', 45000.00),
('C0013', 'Dental Bridge', 35000.00),
('C0014', 'Gum Treatment (Deep Cleaning)', 8500.00),
('C0015', 'X-Ray (Full Mouth)', 3000.00),
('C0016', 'Emergency Treatment', 5000.00),
('C0017', 'Cavity Prevention (Fluoride)', 2000.00),
('C0018', 'Pediatric Dental Check-up', 2500.00);

-- ========================================
-- 8. INSERT DOCTOR SCHEDULES
-- ========================================
INSERT INTO `doctor_schedule` (`schedule_id`, `doctor_id`, `speciality`, `date`, `start_time`, `end_time`, `fee`, `status`, `max_patients`) VALUES
-- Dr. Sunil - Orthodontics (Colombo)
('SCH001', 'S0007', 'Orthodontics', '2025-10-22', '09:00:00', '12:00:00', 2500.00, 'ACTIVE', 10),
('SCH002', 'S0007', 'Orthodontics', '2025-10-23', '14:00:00', '17:00:00', 2500.00, 'ACTIVE', 10),
('SCH003', 'S0007', 'Orthodontics', '2025-10-25', '09:00:00', '12:00:00', 2500.00, 'ACTIVE', 10),

-- Dr. Anura - Endodontics (Colombo)
('SCH004', 'S0008', 'Endodontics', '2025-10-22', '14:00:00', '17:00:00', 3000.00, 'ACTIVE', 8),
('SCH005', 'S0008', 'Endodontics', '2025-10-24', '09:00:00', '12:00:00', 3000.00, 'ACTIVE', 8),
('SCH006', 'S0008', 'Endodontics', '2025-10-26', '14:00:00', '17:00:00', 3000.00, 'ACTIVE', 8),

-- Dr. Maya - Periodontics (Kandy)
('SCH007', 'S0009', 'Periodontics', '2025-10-22', '09:00:00', '12:00:00', 2800.00, 'ACTIVE', 12),
('SCH008', 'S0009', 'Periodontics', '2025-10-23', '09:00:00', '12:00:00', 2800.00, 'ACTIVE', 12),
('SCH009', 'S0009', 'Periodontics', '2025-10-25', '14:00:00', '17:00:00', 2800.00, 'ACTIVE', 12),

-- Dr. Kasun - Prosthodontics (Kandy)
('SCH010', 'S0010', 'Prosthodontics', '2025-10-22', '14:00:00', '17:00:00', 3500.00, 'ACTIVE', 10),
('SCH011', 'S0010', 'Prosthodontics', '2025-10-24', '09:00:00', '12:00:00', 3500.00, 'ACTIVE', 10),

-- Dr. Tharaka - Oral Surgery (Galle)
('SCH012', 'S0011', 'Oral Surgery', '2025-10-23', '09:00:00', '12:00:00', 4000.00, 'ACTIVE', 6),
('SCH013', 'S0011', 'Oral Surgery', '2025-10-25', '09:00:00', '12:00:00', 4000.00, 'ACTIVE', 6),

-- Dr. Sandya - Pediatric Dentistry (Negombo)
('SCH014', 'S0012', 'Pediatric Dentistry', '2025-10-22', '09:00:00', '12:00:00', 2000.00, 'ACTIVE', 15),
('SCH015', 'S0012', 'Pediatric Dentistry', '2025-10-24', '14:00:00', '17:00:00', 2000.00, 'ACTIVE', 15),

-- Dr. Lalith - General Dentistry (Jaffna)
('SCH016', 'S0013', 'General Dentistry', '2025-10-23', '09:00:00', '12:00:00', 2500.00, 'ACTIVE', 12),
('SCH017', 'S0013', 'General Dentistry', '2025-10-25', '14:00:00', '17:00:00', 2500.00, 'ACTIVE', 12);

-- ========================================
-- 9. INSERT APPOINTMENTS
-- ========================================
INSERT INTO `appointment` (`appointment_id`, `patient_id`, `status`, `appointment_date`, `start_time`, `end_time`, `notes`, `appointment_fee`, `schedule_id`) VALUES
-- Completed Appointments (Past dates)
('A0001', 'P0001', 'Completed', '2025-10-15', '09:00:00', '09:30:00', 'Regular checkup and cleaning', 2500.00, 'SCH001'),
('A0002', 'P0002', 'Completed', '2025-10-15', '09:30:00', '10:00:00', 'Root canal treatment follow-up', 3000.00, 'SCH004'),
('A0003', 'P0003', 'Completed', '2025-10-16', '14:00:00', '14:30:00', 'Tooth extraction', 2800.00, 'SCH007'),
('A0004', 'P0004', 'Completed', '2025-10-16', '14:30:00', '15:00:00', 'Crown placement consultation', 3500.00, 'SCH010'),
('A0005', 'P0005', 'Completed', '2025-10-17', '09:00:00', '09:30:00', 'Wisdom tooth extraction', 4000.00, 'SCH012'),
('A0006', 'P0006', 'Completed', '2025-10-17', '09:30:00', '10:00:00', 'Pediatric dental checkup', 2000.00, 'SCH014'),
('A0007', 'P0007', 'Completed', '2025-10-18', '09:00:00', '09:30:00', 'Dental cleaning and fluoride treatment', 2500.00, 'SCH016'),
('A0008', 'P0008', 'Completed', '2025-10-18', '09:30:00', '10:00:00', 'Braces adjustment', 2500.00, 'SCH001'),
('A0009', 'P0009', 'Completed', '2025-10-19', '14:00:00', '14:30:00', 'Emergency toothache treatment', 3000.00, 'SCH004'),
('A0010', 'P0010', 'Completed', '2025-10-19', '14:30:00', '15:00:00', 'Gum disease treatment', 2800.00, 'SCH007'),

-- Scheduled Appointments (Future dates)
('A0011', 'P0011', 'Scheduled', '2025-10-22', '09:00:00', '09:30:00', 'First consultation for braces', 2500.00, 'SCH001'),
('A0012', 'P0012', 'Scheduled', '2025-10-22', '09:30:00', '10:00:00', 'Teeth whitening consultation', 2500.00, 'SCH001'),
('A0013', 'P0013', 'Scheduled', '2025-10-22', '14:00:00', '14:30:00', 'Root canal treatment session 1', 3000.00, 'SCH004'),
('A0014', 'P0014', 'Scheduled', '2025-10-22', '14:30:00', '15:00:00', 'Composite filling', 3000.00, 'SCH004'),
('A0015', 'P0015', 'Scheduled', '2025-10-23', '09:00:00', '09:30:00', 'Dental checkup', 2500.00, 'SCH016'),
('A0016', 'P0001', 'Scheduled', '2025-10-23', '14:00:00', '14:30:00', 'Follow-up appointment', 2500.00, 'SCH002'),
('A0017', 'P0002', 'Scheduled', '2025-10-24', '09:00:00', '09:30:00', 'Root canal completion', 3000.00, 'SCH005'),
('A0018', 'P0003', 'Scheduled', '2025-10-24', '14:00:00', '14:30:00', 'Cavity filling', 2000.00, 'SCH015'),

-- Cancelled Appointments
('A0019', 'P0004', 'Cancelled', '2025-10-20', '09:00:00', '09:30:00', 'Patient cancelled due to emergency', 2800.00, 'SCH007'),
('A0020', 'P0005', 'Cancelled', '2025-10-21', '14:00:00', '14:30:00', 'Rescheduled to next week', 3500.00, 'SCH010');

-- ========================================
-- 10. INSERT TREATMENTS
-- ========================================
INSERT INTO `treatment` (`treatment_id`, `catalog_id`, `appointment_id`, `description`) VALUES
-- Treatments for completed appointments
('T0001', 'C0001', 'A0001', 'General consultation and examination completed. Patient has good oral health.'),
('T0002', 'C0002', 'A0001', 'Scaling and polishing performed. Removed tartar buildup.'),
('T0003', 'C0006', 'A0002', 'Root canal treatment on tooth #14. First session completed successfully.'),
('T0004', 'C0004', 'A0003', 'Extracted tooth #28. Healing well, prescribed antibiotics.'),
('T0005', 'C0014', 'A0003', 'Deep cleaning performed on lower gums. Patient advised on proper brushing technique.'),
('T0006', 'C0007', 'A0004', 'Crown consultation for tooth #11. Impressions taken for crown fabrication.'),
('T0007', 'C0005', 'A0005', 'Surgical extraction of impacted wisdom tooth #38. Sutures placed.'),
('T0008', 'C0016', 'A0005', 'Emergency pain management and antibiotics prescribed.'),
('T0009', 'C0018', 'A0006', 'Pediatric checkup for 8-year-old. Applied fluoride treatment.'),
('T0010', 'C0017', 'A0006', 'Fluoride application on all teeth for cavity prevention.'),
('T0011', 'C0002', 'A0007', 'Professional teeth cleaning completed. Excellent oral hygiene.'),
('T0012', 'C0017', 'A0007', 'Fluoride treatment applied as preventive measure.'),
('T0013', 'C0011', 'A0008', 'Braces adjustment. Tightened wires and replaced rubber bands.'),
('T0014', 'C0016', 'A0009', 'Emergency treatment for severe toothache. Tooth #46 abscess drained.'),
('T0015', 'C0003', 'A0009', 'Temporary filling placed on tooth #46.'),
('T0016', 'C0014', 'A0010', 'Deep scaling and root planing for gum disease. Stage 2 treatment.'),
('T0017', 'C0001', 'A0010', 'Follow-up consultation for periodontal condition.');

-- ========================================
-- 11. INSERT PAYMENTS
-- ========================================
INSERT INTO `payment` (`payment_id`, `appointment_id`, `insurance_paid_amount`, `patient_paid_amount`, `total_amount`, `status`, `patient_id`, `Due_payment`) VALUES
-- Fully Paid
('PAY01', 'A0001', 2000.00, 3000.00, 5000.00, 'Paid', 'P0001', 0.00),
('PAY02', 'A0002', 6000.00, 6000.00, 12000.00, 'Paid', 'P0002', 0.00),
('PAY03', 'A0003', 0.00, 7300.00, 7300.00, 'Paid', 'P0003', 0.00),
('PAY04', 'A0004', 17500.00, 7500.00, 25000.00, 'Paid', 'P0004', 0.00),

-- Partial Payment
('PAY05', 'A0005', 4500.00, 2500.00, 9000.00, 'Partial', 'P0005', 2000.00),
('PAY06', 'A0006', 2000.00, 2000.00, 4500.00, 'Partial', 'P0006', 500.00),
('PAY07', 'A0007', 0.00, 3000.00, 4500.00, 'Partial', 'P0007', 1500.00),

-- Pending Payment
('PAY08', 'A0008', 0.00, 0.00, 5000.00, 'Pending', 'P0008', 5000.00),
('PAY09', 'A0009', 0.00, 1000.00, 8000.00, 'Partial', 'P0009', 7000.00),
('PAY10', 'A0010', 1400.00, 0.00, 5600.00, 'Partial', 'P0010', 4200.00),

-- Scheduled appointments (Pending)
('PAY11', 'A0011', 0.00, 0.00, 2500.00, 'Pending', 'P0011', 2500.00),
('PAY12', 'A0012', 0.00, 0.00, 2500.00, 'Pending', 'P0012', 2500.00),
('PAY13', 'A0013', 0.00, 0.00, 3000.00, 'Pending', 'P0013', 3000.00),
('PAY14', 'A0014', 0.00, 0.00, 3000.00, 'Pending', 'P0014', 3000.00),
('PAY15', 'A0015', 0.00, 0.00, 2500.00, 'Pending', 'P0015', 2500.00),
('PAY16', 'A0016', 0.00, 0.00, 2500.00, 'Pending', 'P0001', 2500.00),
('PAY17', 'A0017', 0.00, 0.00, 3000.00, 'Pending', 'P0002', 3000.00),
('PAY18', 'A0018', 0.00, 0.00, 2000.00, 'Pending', 'P0003', 2000.00);

-- ========================================
-- 12. INSERT INSURANCE CLAIMS
-- ========================================
INSERT INTO `insurance_claim` (`claim_id`, `insurance_id`, `percentage`, `payment_id`) VALUES
('CL001', 'I0001', 40.00, 'PAY01'),
('CL002', 'I0003', 50.00, 'PAY02'),
('CL003', 'I0001', 70.00, 'PAY04'),
('CL004', 'I0002', 50.00, 'PAY05'),
('CL005', 'I0004', 45.00, 'PAY06'),
('CL006', 'I0005', 25.00, 'PAY10');

-- ========================================
-- 13. INSERT INVOICES
-- ========================================
INSERT INTO `invoice` (`invoice_id`, `payment_id`, `amount`, `method`) VALUES
('INV01', 'PAY01', 5000.00, 'Card'),
('INV02', 'PAY02', 12000.00, 'BankTransfer'),
('INV03', 'PAY03', 7300.00, 'Cash'),
('INV04', 'PAY04', 25000.00, 'Online'),
('INV05', 'PAY05', 7000.00, 'Card'),
('INV06', 'PAY06', 4000.00, 'Cash'),
('INV07', 'PAY07', 3000.00, 'Cash'),
('INV08', 'PAY09', 1000.00, 'Card');

-- ========================================
-- Re-enable foreign key checks
-- ========================================
SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Uncomment these to verify the data insertion

-- SELECT 'Branches:', COUNT(*) as count FROM branch;
-- SELECT 'Staff:', COUNT(*) as count FROM staff;
-- SELECT 'Doctors:', COUNT(*) as count FROM doctor;
-- SELECT 'Patients:', COUNT(*) as count FROM patient;
-- SELECT 'Insurance Companies:', COUNT(*) as count FROM insurance;
-- SELECT 'Treatment Catalog:', COUNT(*) as count FROM treatment_catalog;
-- SELECT 'Doctor Schedules:', COUNT(*) as count FROM doctor_schedule;
-- SELECT 'Appointments:', COUNT(*) as count FROM appointment;
-- SELECT 'Treatments:', COUNT(*) as count FROM treatment;
-- SELECT 'Payments:', COUNT(*) as count FROM payment;
-- SELECT 'Insurance Claims:', COUNT(*) as count FROM insurance_claim;
-- SELECT 'Invoices:', COUNT(*) as count FROM invoice;

SELECT '✅ DUMMY DATA INSERTION COMPLETED SUCCESSFULLY!' as status;

-- ========================================
-- SUMMARY OF INSERTED DATA
-- ========================================
/*
BRANCHES: 5 branches across Sri Lanka
STAFF: 18 staff members (1 Admin, 5 Branch Managers, 7 Doctors, 5 Nurses)
DOCTORS: 7 doctors with different specialties
PATIENTS: 15 patients with complete profiles
INSURANCE: 6 insurance companies
TREATMENT CATALOG: 18 different treatment types
DOCTOR SCHEDULES: 17 active schedules
APPOINTMENTS: 20 appointments (10 Completed, 8 Scheduled, 2 Cancelled)
TREATMENTS: 17 treatment records
PAYMENTS: 18 payment records (Various statuses)
INSURANCE CLAIMS: 6 claims
INVOICES: 8 invoices

All passwords (staff & patients): password123
*/
