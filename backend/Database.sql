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
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
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
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `branch` VALUES ('B0001','Main Branch','Gall Road, Colombo 7','0703371796','thilokyaangeesa@gmail.com','S0001');
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
INSERT INTO `doctor` VALUES ('S0002','Nothing');
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
  CONSTRAINT `doctor_schedule_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_ds_doctor` FOREIGN KEY (`doctor_id`, `speciality`) REFERENCES `doctor` (`staff_id`, `speciality`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_schedule`
--

LOCK TABLES `doctor_schedule` WRITE;
/*!40000 ALTER TABLE `doctor_schedule` DISABLE KEYS */;
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
INSERT INTO `insurance` VALUES ('I0001','UOM','Full','0112488881');
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
INSERT INTO `patient` VALUES ('P0001','Thilokya03','Thilokya Angeesa','0703371796',22,'Male','200324610311','thilokyaangeesa@gmail.com','$2b$10$Zr/FffTZe5itbznChx8N9uKPppuNQh/moeBmnuVJ2SAWtjptSmBF.',NULL,NULL),('P0002','ThilokyaP','Thilokya Angeesa','0703371796',22,'Male','200324610310','thilokyaangeeka@gmail.com','$2b$10$2RlFtMmx/XBxN.wATxnN8O6W9YbOv46nWSllAy6/EJI4lpOEq/tWG',NULL,NULL);
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
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `staff` VALUES ('S0001','Thilokya03','Thilokya Angeesa','Branch Manager','0703371796','Male','200324610311','thilokyaangeesa@gmail.com','$2b$10$vNhcoiq/WcT3csnTQISsIuO1zFJFmf4ncOZHWyE14YNgihD/DE8FK','B0001',NULL),('S0002','ThilokyaD1','Thilokya Angeesa','Doctor','0703371796','Male','200324610312','thilokyaange@gmail.com','$2b$10$Quq.7GcmR4FStPhgvNZpa.TLN/oeE7j82QkMtUofxegXUbEymSrgm','B0001',NULL),('S0003','ThilokyaS','Thilokya Angeesa','Nurse','0703371791','Male','200324610313','sajdbsa@hdf.com','$2b$10$qI7g5vAA0pCDXfJIcuPFkuscbCzsbdjy9no05RKY/1sfpaavuf69.','B0001',NULL);
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
  `treatment_id` varchar(5) NOT NULL,
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
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `treatment_catalog` VALUES ('C0001','kadjfsa',2000.00);
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

-- Dump completed on 2025-10-20 20:18:26
