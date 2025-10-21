-- Fix treatment_id field length issue
-- Current: varchar(5) cannot hold timestamp-based IDs like "T1729558800000" (14 chars)
-- Solution: Increase to varchar(20) to accommodate the format

USE catms;

ALTER TABLE treatment MODIFY treatment_id VARCHAR(20) NOT NULL;

-- Verify the change
DESCRIBE treatment;
