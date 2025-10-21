CREATE DATABASE  IF NOT EXISTS `catms` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `catms`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: catms
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` varchar(5) NOT NULL,
  `patient_id` varchar(5) NOT NULL,
  `status` enum('Scheduled','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
  `appointment_date` date NOT NULL,
  `start_time` time NOT NULL DEFAULT '09:00:00',
  `end_time` time NOT NULL DEFAULT '10:00:00',
  `notes` text,
  `appointment_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `schedule_id` varchar(10) NOT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `fk_appt_patient` (`patient_id`),
  KEY `fk_appt_doctor_schedule` (`schedule_id`),
  KEY `idx_schedule_id` (`schedule_id`),
  CONSTRAINT `fk_appt_doctor_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `doctor_schedule` (`schedule_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_appt_patient` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_appt_time` CHECK ((`end_time` > `start_time`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES ('A0001','P0001','Completed','2025-10-15','09:00:00','09:30:00','Regular checkup and cleaning',7500.00,'SCH001'),('A0002','P0002','Completed','2025-10-15','09:30:00','10:00:00','Root canal treatment follow-up',15000.00,'SCH004'),('A0003','P0003','Completed','2025-10-16','14:00:00','14:30:00','Tooth extraction',13800.00,'SCH007'),('A0004','P0004','Completed','2025-10-16','14:30:00','15:00:00','Crown placement consultation',28500.00,'SCH010'),('A0005','P0005','Completed','2025-10-17','09:00:00','09:30:00','Wisdom tooth extraction',14500.00,'SCH012'),('A0006','P0006','Completed','2025-10-17','09:30:00','10:00:00','Pediatric dental checkup',6500.00,'SCH014'),('A0007','P0007','Completed','2025-10-18','09:00:00','09:30:00','Dental cleaning and fluoride treatment',8000.00,'SCH016'),('A0008','P0008','Completed','2025-10-18','09:30:00','10:00:00','Braces adjustment',7500.00,'SCH001'),('A0009','P0009','Completed','2025-10-19','14:00:00','14:30:00','Emergency toothache treatment',12500.00,'SCH004'),('A0010','P0010','Completed','2025-10-19','14:30:00','15:00:00','Gum disease treatment',12800.00,'SCH007'),('A0011','P0011','Scheduled','2025-10-22','09:00:00','09:30:00','First consultation for braces',2500.00,'SCH001'),('A0012','P0012','Scheduled','2025-10-22','09:30:00','10:00:00','Teeth whitening consultation',2500.00,'SCH001'),('A0013','P0013','Scheduled','2025-10-22','14:00:00','14:30:00','Root canal treatment session 1',3000.00,'SCH004'),('A0014','P0014','Scheduled','2025-10-22','14:30:00','15:00:00','Composite filling',3000.00,'SCH004'),('A0015','P0015','Scheduled','2025-10-23','09:00:00','09:30:00','Dental checkup',2500.00,'SCH016'),('A0016','P0001','Scheduled','2025-10-23','14:00:00','14:30:00','Follow-up appointment',2500.00,'SCH002'),('A0017','P0002','Scheduled','2025-10-24','09:00:00','09:30:00','Root canal completion',3000.00,'SCH005'),('A0018','P0003','Scheduled','2025-10-24','14:00:00','14:30:00','Cavity filling',2000.00,'SCH015'),('A0019','P0004','Cancelled','2025-10-20','09:00:00','09:30:00','Patient cancelled due to emergency',2800.00,'SCH007'),('A0020','P0005','Cancelled','2025-10-21','14:00:00','14:30:00','Rescheduled to next week',3500.00,'SCH010');
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_appointment_fee` BEFORE INSERT ON `appointment` FOR EACH ROW BEGIN
    DECLARE doctor_fee DECIMAL(10,2);

    -- Fetch the fee from doctor_schedule based on the schedule_id
    SELECT fee INTO doctor_fee
    FROM doctor_schedule
    WHERE schedule_id = NEW.schedule_id
    LIMIT 1;

    -- Assign it to the appointment_fee of the new row
    SET NEW.appointment_fee = IFNULL(doctor_fee, 0);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_appointment_insert` AFTER INSERT ON `appointment` FOR EACH ROW BEGIN
          DECLARE new_payment_id VARCHAR(5);
          DECLARE max_payment_num INT;
          
          -- Generate new payment_id
          SELECT COALESCE(MAX(CAST(SUBSTRING(payment_id, 3) AS UNSIGNED)), 0) INTO max_payment_num
          FROM payment;
          
          -- Create new payment_id (PM001, PM002, etc.)
          SET new_payment_id = CONCAT('PM', LPAD(max_payment_num + 1, 3, '0'));
          
          -- Insert payment record
          INSERT INTO payment (
              payment_id,
              appointment_id,
              patient_id,
              total_amount,
              insurance_paid_amount,
              patient_paid_amount,
              Due_payment,
              status
          ) VALUES (
              new_payment_id,
              NEW.appointment_id,
              NEW.patient_id,
              NEW.appointment_fee,
              0.00,
              0.00,
              NEW.appointment_fee,
              'Pending'
          );
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branch` (
  `branch_id` varchar(5) NOT NULL,
  `name` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `phone_no` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `manager_id` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`branch_id`),
  KEY `fk_branch_manager` (`manager_id`),
  CONSTRAINT `fk_branch_manager` FOREIGN KEY (`manager_id`) REFERENCES `staff` (`staff_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES ('B0001','Main Branch - Colombo','Galle Road, Colombo 07','0112345671','colombo@dentalclinic.lk','S0002'),('B0002','Kandy Branch','123 Peradeniya Road, Kandy','0812234567','kandy@dentalclinic.lk','S0003'),('B0003','Galle Branch','456 Matara Road, Galle','0912234567','galle@dentalclinic.lk','S0004'),('B0004','Negombo Branch','789 Kurana Road, Negombo','0312234567','negombo@dentalclinic.lk','S0005'),('B0005','Jaffna Branch','321 Hospital Road, Jaffna','0212234567','jaffna@dentalclinic.lk','S0006');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `staff_id` varchar(5) NOT NULL,
  `speciality` varchar(100) NOT NULL,
  PRIMARY KEY (`staff_id`,`speciality`),
  UNIQUE KEY `uq_doctor_staff` (`staff_id`),
  CONSTRAINT `fk_doctor_staff` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`staff_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES ('S0007','Orthodontics'),('S0008','Endodontics'),('S0009','Periodontics'),('S0010','Prosthodontics'),('S0011','Oral Surgery'),('S0012','Pediatric Dentistry'),('S0013','General Dentistry');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_schedule`
--

DROP TABLE IF EXISTS `doctor_schedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_schedule` (
  `schedule_id` varchar(10) NOT NULL,
  `doctor_id` varchar(5) NOT NULL,
  `speciality` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `max_patients` int DEFAULT '10',
  PRIMARY KEY (`schedule_id`),
  UNIQUE KEY `unique_schedule_doctor_time` (`doctor_id`,`date`,`start_time`,`end_time`),
  KEY `fk_ds_doctor` (`doctor_id`,`speciality`),
  CONSTRAINT `doctor_schedule_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_schedule`
--

LOCK TABLES `doctor_schedule` WRITE;
/*!40000 ALTER TABLE `doctor_schedule` DISABLE KEYS */;
INSERT INTO `doctor_schedule` VALUES ('SCH001','S0007','Orthodontics','2025-10-22','09:00:00','12:00:00',2500.00,'ACTIVE',10),('SCH002','S0007','Orthodontics','2025-10-23','14:00:00','17:00:00',2500.00,'ACTIVE',10),('SCH003','S0007','Orthodontics','2025-10-25','09:00:00','12:00:00',2500.00,'ACTIVE',10),('SCH004','S0008','Endodontics','2025-10-22','14:00:00','17:00:00',3000.00,'ACTIVE',8),('SCH005','S0008','Endodontics','2025-10-24','09:00:00','12:00:00',3000.00,'ACTIVE',8),('SCH006','S0008','Endodontics','2025-10-26','14:00:00','17:00:00',3000.00,'ACTIVE',8),('SCH007','S0009','Periodontics','2025-10-22','09:00:00','12:00:00',2800.00,'ACTIVE',12),('SCH008','S0009','Periodontics','2025-10-23','09:00:00','12:00:00',2800.00,'ACTIVE',12),('SCH009','S0009','Periodontics','2025-10-25','14:00:00','17:00:00',2800.00,'ACTIVE',12),('SCH010','S0010','Prosthodontics','2025-10-22','14:00:00','17:00:00',3500.00,'ACTIVE',10),('SCH011','S0010','Prosthodontics','2025-10-24','09:00:00','12:00:00',3500.00,'ACTIVE',10),('SCH012','S0011','Oral Surgery','2025-10-23','09:00:00','12:00:00',4000.00,'ACTIVE',6),('SCH013','S0011','Oral Surgery','2025-10-25','09:00:00','12:00:00',4000.00,'ACTIVE',6),('SCH014','S0012','Pediatric Dentistry','2025-10-22','09:00:00','12:00:00',2000.00,'ACTIVE',15),('SCH015','S0012','Pediatric Dentistry','2025-10-24','14:00:00','17:00:00',2000.00,'ACTIVE',15),('SCH016','S0013','General Dentistry','2025-10-23','09:00:00','12:00:00',2500.00,'ACTIVE',12),('SCH017','S0013','General Dentistry','2025-10-25','14:00:00','17:00:00',2500.00,'ACTIVE',12);
/*!40000 ALTER TABLE `doctor_schedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance`
--

DROP TABLE IF EXISTS `insurance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance` (
  `insurance_id` varchar(5) NOT NULL,
  `name` varchar(100) NOT NULL,
  `coverage_type` varchar(100) NOT NULL,
  `phone_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`insurance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance`
--

LOCK TABLES `insurance` WRITE;
/*!40000 ALTER TABLE `insurance` DISABLE KEYS */;
INSERT INTO `insurance` VALUES ('I0001','National Insurance Trust Fund','Full Coverage','0112345678'),('I0002','Sri Lanka Insurance Corporation','Partial Coverage','0112345679'),('I0003','Ceylinco Healthcare','Full Coverage','0112345680'),('I0004','AIA Insurance Lanka','Partial Coverage','0112345681'),('I0005','Union Assurance Health','Full Coverage','0112345682'),('I0006','Allianz Life Insurance','Partial Coverage','0112345683');
/*!40000 ALTER TABLE `insurance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insurance_claim`
--

DROP TABLE IF EXISTS `insurance_claim`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insurance_claim` (
  `claim_id` varchar(5) NOT NULL,
  `insurance_id` varchar(5) NOT NULL,
  `percentage` decimal(5,2) DEFAULT NULL,
  `payment_id` varchar(5) NOT NULL,
  PRIMARY KEY (`claim_id`),
  KEY `fk_claim_insurance` (`insurance_id`),
  KEY `fk_claim_payment` (`payment_id`),
  CONSTRAINT `fk_claim_insurance` FOREIGN KEY (`insurance_id`) REFERENCES `insurance` (`insurance_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_claim_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE CASCADE,
  CONSTRAINT `insurance_claim_chk_1` CHECK (((`percentage` >= 0.00) and (`percentage` <= 100.00)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insurance_claim`
--

LOCK TABLES `insurance_claim` WRITE;
/*!40000 ALTER TABLE `insurance_claim` DISABLE KEYS */;
/*!40000 ALTER TABLE `insurance_claim` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_insurance_paid` AFTER INSERT ON `insurance_claim` FOR EACH ROW BEGIN
    UPDATE payment
    SET insurance_paid_amount = insurance_paid_amount + (NEW.percentage / 100) * total_amount,
        Due_payment = total_amount - (patient_paid_amount + (NEW.percentage / 100) * total_amount),
        status = CASE
                    WHEN patient_paid_amount +  (NEW.percentage / 100) * total_amount >= total_amount THEN 'Paid'
                    WHEN patient_paid_amount + (NEW.percentage / 100) * total_amount > 0 THEN 'Partial'
                    ELSE 'Pending'
                 END
    WHERE payment_id = NEW.payment_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `invoice_id` varchar(5) NOT NULL,
  `payment_id` varchar(5) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('Cash','Card','Online','BankTransfer') NOT NULL,
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `uq_invoice_payment` (`payment_id`),
  CONSTRAINT `fk_invoice_payment` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`payment_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES ('INV01','PAY01',5000.00,'Card'),('INV02','PAY02',12000.00,'BankTransfer'),('INV03','PAY03',7300.00,'Cash'),('INV04','PAY04',25000.00,'Online'),('INV05','PAY05',7000.00,'Card'),('INV06','PAY06',4000.00,'Cash'),('INV07','PAY07',3000.00,'Cash'),('INV08','PAY09',1000.00,'Card');
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `login`
--

DROP TABLE IF EXISTS `login`;
/*!50001 DROP VIEW IF EXISTS `login`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `login` AS SELECT 
 1 AS `username`,
 1 AS `password`,
 1 AS `role`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `patient_id` varchar(5) NOT NULL,
  `username` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone_no` varchar(10) NOT NULL,
  `age` int NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `emergencyContactName` varchar(255) DEFAULT NULL,
  `emergencyContactNo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nic` (`nic`),
  CONSTRAINT `patient_chk_1` CHECK (((`age` >= 0) and (`age` <= 130)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES ('P0001','john_doe','John Doe Silva','0771234001',35,'Male','198912345601','john.silva@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Jane Silva','0772234001'),('P0002','sarah_p','Sarah Perera','0772234002',28,'Female','199612345602','sarah.perera@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','David Perera','0773234002'),('P0003','michael_f','Michael Fernando','0773234003',42,'Male','198212345603','michael.f@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Lisa Fernando','0774234003'),('P0004','kavitha_r','Kavitha Rajendran','0774234004',31,'Female','199312345604','kavitha.r@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Ravi Rajendran','0775234004'),('P0005','amit_s','Amit Sharma','0775234005',25,'Male','199912345605','amit.sharma@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Priya Sharma','0776234005'),('P0006','nisha_g','Nisha Gunawardena','0776234006',38,'Female','198612345606','nisha.g@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Sunil Gunawardena','0777234006'),('P0007','rohan_d','Rohan Dissanayake','0777234007',45,'Male','197912345607','rohan.d@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Mala Dissanayake','0778234007'),('P0008','priyanka_m','Priyanka Mendis','0778234008',33,'Female','199112345608','priyanka.m@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Kumar Mendis','0779234008'),('P0009','ashan_j','Ashan Jayawardena','0779234009',27,'Male','199712345609','ashan.j@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Nimal Jayawardena','0771134009'),('P0010','dilini_w','Dilini Wickramasinghe','0771134010',29,'Female','199512345610','dilini.w@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Saman Wickramasinghe','0772134010'),('P0011','kasun_p','Kasun Pathirana','0772134011',36,'Male','198812345611','kasun.p@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Chamari Pathirana','0773134011'),('P0012','thilini_r','Thilini Rathnayake','0773134012',24,'Female','200012345612','thilini.r@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Gayan Rathnayake','0774134012'),('P0013','nuwan_k','Nuwan Kumara','0774134013',40,'Male','198412345613','nuwan.k@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Malini Kumara','0775134013'),('P0014','sandamali_s','Sandamali Samaraweera','0775134014',32,'Female','199212345614','sandamali.s@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Roshan Samaraweera','0776134014'),('P0015','tharindu_b','Tharindu Bandara','0776134015',26,'Male','199812345615','tharindu.b@email.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','Anusha Bandara','0777134015');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` varchar(5) NOT NULL,
  `appointment_id` varchar(5) NOT NULL,
  `insurance_paid_amount` decimal(10,2) DEFAULT '0.00',
  `patient_paid_amount` decimal(10,2) DEFAULT '0.00',
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('Pending','Partial','Paid','Voided') NOT NULL DEFAULT 'Pending',
  `patient_id` varchar(5) NOT NULL,
  `Due_payment` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payment_appointment` (`appointment_id`),
  KEY `fk_payment_patient` (`patient_id`),
  CONSTRAINT `fk_payment_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES ('PAY01','A0001',2000.00,3000.00,0.00,5000.00,'Paid','P0001',0.00),('PAY02','A0002',6000.00,6000.00,0.00,12000.00,'Paid','P0002',0.00),('PAY03','A0003',0.00,7300.00,0.00,7300.00,'Paid','P0003',0.00),('PAY04','A0004',17500.00,7500.00,0.00,25000.00,'Paid','P0004',0.00),('PAY05','A0005',4500.00,2500.00,0.00,9000.00,'Partial','P0005',2000.00),('PAY06','A0006',2000.00,2000.00,0.00,4500.00,'Partial','P0006',500.00),('PAY07','A0007',0.00,3000.00,0.00,4500.00,'Partial','P0007',1500.00),('PAY08','A0008',0.00,0.00,0.00,5000.00,'Pending','P0008',5000.00),('PAY09','A0009',0.00,1000.00,0.00,8000.00,'Partial','P0009',7000.00),('PAY10','A0010',1400.00,0.00,0.00,5600.00,'Partial','P0010',4200.00),('PAY11','A0011',0.00,0.00,0.00,2500.00,'Pending','P0011',2500.00),('PAY12','A0012',0.00,0.00,0.00,2500.00,'Pending','P0012',2500.00),('PAY13','A0013',0.00,0.00,0.00,3000.00,'Pending','P0013',3000.00),('PAY14','A0014',0.00,0.00,0.00,3000.00,'Pending','P0014',3000.00),('PAY15','A0015',0.00,0.00,0.00,2500.00,'Pending','P0015',2500.00),('PAY16','A0016',0.00,0.00,0.00,2500.00,'Pending','P0001',2500.00),('PAY17','A0017',0.00,0.00,0.00,3000.00,'Pending','P0002',3000.00),('PAY18','A0018',0.00,0.00,0.00,2000.00,'Pending','P0003',2000.00),('PM001','A0001',0.00,0.00,0.00,7500.00,'Pending','P0001',7500.00),('PM002','A0002',0.00,0.00,0.00,15000.00,'Pending','P0002',15000.00),('PM003','A0003',0.00,0.00,0.00,13800.00,'Pending','P0003',13800.00),('PM004','A0004',0.00,0.00,0.00,28500.00,'Pending','P0004',28500.00),('PM005','A0005',0.00,0.00,0.00,14500.00,'Pending','P0005',14500.00),('PM006','A0006',0.00,0.00,0.00,6500.00,'Pending','P0006',6500.00),('PM007','A0007',0.00,0.00,0.00,8000.00,'Pending','P0007',8000.00),('PM008','A0008',0.00,0.00,0.00,7500.00,'Pending','P0008',7500.00),('PM009','A0009',0.00,0.00,0.00,12500.00,'Pending','P0009',12500.00),('PM010','A0010',0.00,0.00,0.00,12800.00,'Pending','P0010',12800.00),('PM011','A0011',0.00,0.00,0.00,2500.00,'Pending','P0011',2500.00),('PM012','A0012',0.00,0.00,0.00,2500.00,'Pending','P0012',2500.00),('PM013','A0013',0.00,0.00,0.00,3000.00,'Pending','P0013',3000.00),('PM014','A0014',0.00,0.00,0.00,3000.00,'Pending','P0014',3000.00),('PM015','A0015',0.00,0.00,0.00,2500.00,'Pending','P0015',2500.00),('PM016','A0016',0.00,0.00,0.00,2500.00,'Pending','P0001',2500.00),('PM017','A0017',0.00,0.00,0.00,3000.00,'Pending','P0002',3000.00),('PM018','A0018',0.00,0.00,0.00,2000.00,'Pending','P0003',2000.00),('PM019','A0019',0.00,0.00,0.00,2800.00,'Pending','P0004',2800.00),('PM020','A0020',0.00,0.00,0.00,3500.00,'Pending','P0005',3500.00);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_payment_update` AFTER UPDATE ON `payment` FOR EACH ROW BEGIN
          DECLARE new_invoice_id VARCHAR(5);
          DECLARE max_invoice_num INT;
          DECLARE total_paid DECIMAL(10,2);
          DECLARE payment_method VARCHAR(20);
          DECLARE invoice_exists INT;
          
          -- Calculate total amount paid in this update
          SET total_paid = (NEW.insurance_paid_amount + NEW.patient_paid_amount) - 
                           (OLD.insurance_paid_amount + OLD.patient_paid_amount);
          
          -- Only create/update invoice if there's a new payment (amount increased)
          IF total_paid > 0 THEN
              
              -- Check if invoice already exists
              SELECT COUNT(*) INTO invoice_exists FROM invoice WHERE payment_id = NEW.payment_id;
              
              IF invoice_exists = 0 THEN
                  
                  -- Generate new invoice_id
                  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_id, 3) AS UNSIGNED)), 0) INTO max_invoice_num
                  FROM invoice;
                  
                  -- Create new invoice_id (INV01, INV02, etc.)
                  SET new_invoice_id = CONCAT('INV', LPAD(max_invoice_num + 1, 2, '0'));
                  
                  -- Determine payment method
                  IF NEW.patient_paid_amount > OLD.patient_paid_amount THEN
                      SET payment_method = 'Cash';
                  ELSE
                      SET payment_method = 'Card';
                  END IF;
                  
                  -- Insert invoice record
                  INSERT INTO invoice (
                      invoice_id,
                      payment_id,
                      amount,
                      method
                  ) VALUES (
                      new_invoice_id,
                      NEW.payment_id,
                      NEW.insurance_paid_amount + NEW.patient_paid_amount,
                      payment_method
                  );
                  
              ELSE
                  -- Update existing invoice with new total amount
                  UPDATE invoice
                  SET amount = NEW.insurance_paid_amount + NEW.patient_paid_amount
                  WHERE payment_id = NEW.payment_id;
              END IF;
              
          END IF;
          
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `staff_id` varchar(5) NOT NULL,
  `username` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` enum('Admin','Branch Manager','Nurse','Doctor','Other') NOT NULL,
  `phone_no` varchar(10) NOT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `branch_id` varchar(5) NOT NULL,
  `reference_no` int DEFAULT NULL,
  PRIMARY KEY (`staff_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nic` (`nic`),
  KEY `fk_staff_branch` (`branch_id`),
  CONSTRAINT `fk_staff_branch` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES ('S0001','admin','Dr. Rajesh Kumar','Admin','0771234567','Male','198512345678','admin@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0001',1001),('S0002','bmanager_col','Saman Perera','Branch Manager','0772234567','Male','198712345679','saman.p@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0001',1002),('S0003','bmanager_kan','Nimal Silva','Branch Manager','0773234567','Male','198812345680','nimal.s@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0002',1003),('S0004','bmanager_gal','Kamala Jayasinghe','Branch Manager','0774234567','Female','198912345681','kamala.j@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0003',1004),('S0005','bmanager_neg','Ravi Fernando','Branch Manager','0775234567','Male','199012345682','ravi.f@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0004',1005),('S0006','bmanager_jaf','Priya Ramesh','Branch Manager','0776234567','Female','199112345683','priya.r@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0005',1006),('S0007','dr_sunil','Dr. Sunil Wijesinghe','Doctor','0777234567','Male','198012345684','sunil.w@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0001',2001),('S0008','dr_anura','Dr. Anura Dissanayake','Doctor','0778234567','Male','198112345685','anura.d@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0001',2002),('S0009','dr_maya','Dr. Maya Rodrigo','Doctor','0779234567','Female','198212345686','maya.r@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0002',2003),('S0010','dr_kasun','Dr. Kasun Bandara','Doctor','0771134567','Male','198312345687','kasun.b@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0002',2004),('S0011','dr_tharaka','Dr. Tharaka Gunasekara','Doctor','0772134567','Male','198412345688','tharaka.g@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0003',2005),('S0012','dr_sandya','Dr. Sandya Perera','Doctor','0773134567','Female','198512345689','sandya.p@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0004',2006),('S0013','dr_lalith','Dr. Lalith Jayawardena','Doctor','0774134567','Male','198612345690','lalith.j@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0005',2007),('S0014','nurse_nimali','Nimali Wickramasinghe','Nurse','0775134567','Female','199212345691','nimali.w@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0001',3001),('S0015','nurse_chamila','Chamila Rathnayake','Nurse','0776134567','Female','199312345692','chamila.r@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0001',3002),('S0016','nurse_geetha','Geetha Samaraweera','Nurse','0777134567','Female','199412345693','geetha.s@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0002',3003),('S0017','nurse_sanduni','Sanduni Fernando','Nurse','0778134567','Female','199512345694','sanduni.f@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0003',3004),('S0018','nurse_dilani','Dilani Gunathilaka','Nurse','0779134567','Female','199612345695','dilani.g@dentalclinic.lk','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.','B0004',3005);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `staff_appointment_notes`
--

DROP TABLE IF EXISTS `staff_appointment_notes`;
/*!50001 DROP VIEW IF EXISTS `staff_appointment_notes`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `staff_appointment_notes` AS SELECT 
 1 AS `appointment_id`,
 1 AS `patient_name`,
 1 AS `notes`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `treatment_id` varchar(20) NOT NULL,
  `catalog_id` varchar(5) NOT NULL,
  `appointment_id` varchar(5) NOT NULL,
  `description` text,
  PRIMARY KEY (`treatment_id`),
  KEY `fk_treatment_catalog` (`catalog_id`),
  KEY `fk_treatment_appointment` (`appointment_id`),
  CONSTRAINT `fk_treatment_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_treatment_catalog` FOREIGN KEY (`catalog_id`) REFERENCES `treatment_catalog` (`catalog_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
INSERT INTO `treatment` VALUES ('T0001','C0001','A0001','General consultation and examination completed. Patient has good oral health.'),('T0002','C0002','A0001','Scaling and polishing performed. Removed tartar buildup.'),('T0003','C0006','A0002','Root canal treatment on tooth #14. First session completed successfully.'),('T0004','C0004','A0003','Extracted tooth #28. Healing well, prescribed antibiotics.'),('T0005','C0014','A0003','Deep cleaning performed on lower gums. Patient advised on proper brushing technique.'),('T0006','C0007','A0004','Crown consultation for tooth #11. Impressions taken for crown fabrication.'),('T0007','C0005','A0005','Surgical extraction of impacted wisdom tooth #38. Sutures placed.'),('T0008','C0016','A0005','Emergency pain management and antibiotics prescribed.'),('T0009','C0018','A0006','Pediatric checkup for 8-year-old. Applied fluoride treatment.'),('T0010','C0017','A0006','Fluoride application on all teeth for cavity prevention.'),('T0011','C0002','A0007','Professional teeth cleaning completed. Excellent oral hygiene.'),('T0012','C0017','A0007','Fluoride treatment applied as preventive measure.'),('T0013','C0011','A0008','Braces adjustment. Tightened wires and replaced rubber bands.'),('T0014','C0016','A0009','Emergency treatment for severe toothache. Tooth #46 abscess drained.'),('T0015','C0003','A0009','Temporary filling placed on tooth #46.'),('T0016','C0014','A0010','Deep scaling and root planing for gum disease. Stage 2 treatment.'),('T0017','C0001','A0010','Follow-up consultation for periodontal condition.');
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `update_appointment_fee_after_treatment` AFTER INSERT ON `treatment` FOR EACH ROW BEGIN
    DECLARE doctor_fee DECIMAL(10,2);
    DECLARE treatment_total DECIMAL(10,2);

    -- Get doctor fee from the schedule of this appointment
    SELECT ds.fee INTO doctor_fee
    FROM doctor_schedule ds
    JOIN appointment a ON ds.schedule_id = a.schedule_id
    WHERE a.appointment_id = NEW.appointment_id
    LIMIT 1;

    -- Get total treatment fees for this appointment
    SELECT IFNULL(SUM(tc.treatment_fee),0) INTO treatment_total
    FROM treatment t
    JOIN treatment_catalog tc ON t.catalog_id = tc.catalog_id
    WHERE t.appointment_id = NEW.appointment_id;

    -- Update the appointment_fee
    UPDATE appointment
    SET appointment_fee = IFNULL(doctor_fee,0) + treatment_total
    WHERE appointment_id = NEW.appointment_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_treatment_insert` AFTER INSERT ON `treatment` FOR EACH ROW BEGIN
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
          
      END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `treatment_catalog`
--

DROP TABLE IF EXISTS `treatment_catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_catalog` (
  `catalog_id` varchar(5) NOT NULL,
  `treatment_name` varchar(150) NOT NULL,
  `treatment_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`catalog_id`),
  UNIQUE KEY `treatment_name` (`treatment_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_catalog`
--

LOCK TABLES `treatment_catalog` WRITE;
/*!40000 ALTER TABLE `treatment_catalog` DISABLE KEYS */;
INSERT INTO `treatment_catalog` VALUES ('C0001','General Consultation',1500.00),('C0002','Teeth Cleaning (Scaling)',3500.00),('C0003','Tooth Filling (Composite)',4500.00),('C0004','Tooth Extraction (Simple)',2500.00),('C0005','Tooth Extraction (Surgical)',5500.00),('C0006','Root Canal Treatment',12000.00),('C0007','Crown Placement (Porcelain)',25000.00),('C0008','Dental Implant',85000.00),('C0009','Teeth Whitening',15000.00),('C0010','Braces Installation',120000.00),('C0011','Braces Adjustment',5000.00),('C0012','Dentures (Complete Set)',45000.00),('C0013','Dental Bridge',35000.00),('C0014','Gum Treatment (Deep Cleaning)',8500.00),('C0015','X-Ray (Full Mouth)',3000.00),('C0016','Emergency Treatment',5000.00),('C0017','Cavity Prevention (Fluoride)',2000.00),('C0018','Pediatric Dental Check-up',2500.00);
/*!40000 ALTER TABLE `treatment_catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_branch_appointment_summary`
--

DROP TABLE IF EXISTS `vw_branch_appointment_summary`;
/*!50001 DROP VIEW IF EXISTS `vw_branch_appointment_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_branch_appointment_summary` AS SELECT 
 1 AS `branch_id`,
 1 AS `branch_name`,
 1 AS `appointment_date`,
 1 AS `scheduled_count`,
 1 AS `completed_count`,
 1 AS `cancelled_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_doctor_revenue`
--

DROP TABLE IF EXISTS `vw_doctor_revenue`;
/*!50001 DROP VIEW IF EXISTS `vw_doctor_revenue`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_doctor_revenue` AS SELECT 
 1 AS `doctor_id`,
 1 AS `doctor_name`,
 1 AS `total_revenue`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_insurance_vs_patient`
--

DROP TABLE IF EXISTS `vw_insurance_vs_patient`;
/*!50001 DROP VIEW IF EXISTS `vw_insurance_vs_patient`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_insurance_vs_patient` AS SELECT 
 1 AS `insurance_name`,
 1 AS `total_insurance_paid`,
 1 AS `total_patient_paid`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_patients_due`
--

DROP TABLE IF EXISTS `vw_patients_due`;
/*!50001 DROP VIEW IF EXISTS `vw_patients_due`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_patients_due` AS SELECT 
 1 AS `patient_id`,
 1 AS `name`,
 1 AS `total_amount`,
 1 AS `patient_paid_amount`,
 1 AS `insurance_paid_amount`,
 1 AS `Due_payment`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_treatments_summary`
--

DROP TABLE IF EXISTS `vw_treatments_summary`;
/*!50001 DROP VIEW IF EXISTS `vw_treatments_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_treatments_summary` AS SELECT 
 1 AS `treatment_name`,
 1 AS `treatment_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'catms'
--

--
-- Dumping routines for database 'catms'
--

--
-- Final view structure for view `login`
--

/*!50001 DROP VIEW IF EXISTS `login`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `login` AS select `staff`.`username` AS `username`,`staff`.`password` AS `password`,`staff`.`category` AS `role` from `staff` union select `patient`.`username` AS `username`,`patient`.`password` AS `password`,'patient' AS `role` from `patient` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `staff_appointment_notes`
--

/*!50001 DROP VIEW IF EXISTS `staff_appointment_notes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `staff_appointment_notes` AS select `a`.`appointment_id` AS `appointment_id`,`p`.`name` AS `patient_name`,`a`.`notes` AS `notes` from (`appointment` `a` join `patient` `p` on((`a`.`patient_id` = `p`.`patient_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_branch_appointment_summary`
--

/*!50001 DROP VIEW IF EXISTS `vw_branch_appointment_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_branch_appointment_summary` AS select `b`.`branch_id` AS `branch_id`,`b`.`name` AS `branch_name`,`a`.`appointment_date` AS `appointment_date`,sum((case when (`a`.`status` = 'Scheduled') then 1 else 0 end)) AS `scheduled_count`,sum((case when (`a`.`status` = 'Completed') then 1 else 0 end)) AS `completed_count`,sum((case when (`a`.`status` = 'Cancelled') then 1 else 0 end)) AS `cancelled_count` from ((((`appointment` `a` join `doctor_schedule` `ds` on((`a`.`schedule_id` = `ds`.`schedule_id`))) join `doctor` `d` on((`ds`.`doctor_id` = `d`.`staff_id`))) join `staff` `s` on((`d`.`staff_id` = `s`.`staff_id`))) join `branch` `b` on((`s`.`branch_id` = `b`.`branch_id`))) group by `b`.`branch_id`,`a`.`appointment_date` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_doctor_revenue`
--

/*!50001 DROP VIEW IF EXISTS `vw_doctor_revenue`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_doctor_revenue` AS select `s`.`staff_id` AS `doctor_id`,`s`.`name` AS `doctor_name`,sum((`p`.`patient_paid_amount` + `p`.`insurance_paid_amount`)) AS `total_revenue` from ((((`payment` `p` join `appointment` `a` on((`p`.`appointment_id` = `a`.`appointment_id`))) join `doctor_schedule` `ds` on((`a`.`schedule_id` = `ds`.`schedule_id`))) join `doctor` `d` on((`ds`.`doctor_id` = `d`.`staff_id`))) join `staff` `s` on((`d`.`staff_id` = `s`.`staff_id`))) group by `s`.`staff_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_insurance_vs_patient`
--

/*!50001 DROP VIEW IF EXISTS `vw_insurance_vs_patient`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_insurance_vs_patient` AS select `ic`.`name` AS `insurance_name`,sum(`p`.`insurance_paid_amount`) AS `total_insurance_paid`,sum(`p`.`patient_paid_amount`) AS `total_patient_paid` from ((`payment` `p` left join `insurance_claim` `icm` on((`p`.`payment_id` = `icm`.`payment_id`))) left join `insurance` `ic` on((`icm`.`insurance_id` = `ic`.`insurance_id`))) group by `ic`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_patients_due`
--

/*!50001 DROP VIEW IF EXISTS `vw_patients_due`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_patients_due` AS select `pt`.`patient_id` AS `patient_id`,`pt`.`name` AS `name`,`p`.`total_amount` AS `total_amount`,`p`.`patient_paid_amount` AS `patient_paid_amount`,`p`.`insurance_paid_amount` AS `insurance_paid_amount`,`p`.`Due_payment` AS `Due_payment` from (`payment` `p` join `patient` `pt` on((`p`.`patient_id` = `pt`.`patient_id`))) where (`p`.`Due_payment` > 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_treatments_summary`
--

/*!50001 DROP VIEW IF EXISTS `vw_treatments_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_treatments_summary` AS select `tc`.`treatment_name` AS `treatment_name`,count(`t`.`treatment_id`) AS `treatment_count` from ((`treatment` `t` join `treatment_catalog` `tc` on((`t`.`catalog_id` = `tc`.`catalog_id`))) join `appointment` `a` on((`t`.`appointment_id` = `a`.`appointment_id`))) group by `tc`.`treatment_name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-21  8:46:06
