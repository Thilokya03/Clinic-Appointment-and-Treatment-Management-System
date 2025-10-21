-- Trigger to automatically create payment record when appointment is created
-- This trigger will:
-- 1. Generate a unique payment_id
-- 2. Set total_amount to appointment_fee
-- 3. Set Due_payment to total_amount (since nothing is paid yet)
-- 4. Set status to 'Pending'
-- 5. Link to the appointment and patient

USE catms;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS after_appointment_insert;

DELIMITER $$

CREATE TRIGGER after_appointment_insert
AFTER INSERT ON appointment
FOR EACH ROW
BEGIN
    DECLARE new_payment_id VARCHAR(5);
    DECLARE max_payment_num INT;
    
    -- Generate new payment_id
    -- Get the maximum payment number
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
END$$

DELIMITER ;

-- Verify the trigger was created
SHOW TRIGGERS LIKE 'appointment';
