-- Trigger to automatically create invoice when payment is made
-- This trigger will:
-- 1. Fire when payment is updated (patient pays)
-- 2. Create invoice record if patient_paid_amount or insurance_paid_amount > 0
-- 3. Generate unique invoice_id
-- 4. Calculate total paid amount (insurance + patient)

USE catms;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS after_payment_update;

DELIMITER $$

CREATE TRIGGER after_payment_update
AFTER UPDATE ON payment
FOR EACH ROW
BEGIN
    DECLARE new_invoice_id VARCHAR(5);
    DECLARE max_invoice_num INT;
    DECLARE total_paid DECIMAL(10,2);
    DECLARE payment_method VARCHAR(20);
    
    -- Calculate total amount paid in this update
    SET total_paid = (NEW.insurance_paid_amount + NEW.patient_paid_amount) - 
                     (OLD.insurance_paid_amount + OLD.patient_paid_amount);
    
    -- Only create invoice if there's a new payment (amount increased)
    IF total_paid > 0 THEN
        
        -- Check if invoice already exists for this payment
        -- If not exists, create new invoice
        IF NOT EXISTS (SELECT 1 FROM invoice WHERE payment_id = NEW.payment_id) THEN
            
            -- Generate new invoice_id
            SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_id, 3) AS UNSIGNED)), 0) INTO max_invoice_num
            FROM invoice;
            
            -- Create new invoice_id (INV001, INV002, etc.)
            SET new_invoice_id = CONCAT('INV', LPAD(max_invoice_num + 1, 2, '0'));
            
            -- Determine payment method (default to Cash if patient paid, Card if insurance)
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
    
END$$

DELIMITER ;

-- Verify the trigger was created
SHOW TRIGGERS WHERE `Table` = 'payment';
