-- Trigger to automatically update payment when treatment is added
-- This trigger will:
-- 1. Get the treatment_fee from treatment_catalog
-- 2. Add the treatment_fee to the payment's total_amount and Due_payment
-- 3. Update the payment record for the corresponding appointment

USE catms;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS after_treatment_insert;

DELIMITER $$

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
    
END$$

DELIMITER ;

-- Verify the trigger was created
SHOW TRIGGERS WHERE `Table` = 'treatment';
