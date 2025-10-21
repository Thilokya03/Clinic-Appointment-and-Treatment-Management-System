// Script to create the payment-invoice trigger
require('dotenv').config();
const db = require('./db');

async function createInvoiceTrigger() {
  try {
    console.log('🔧 Creating payment-invoice trigger...\n');
    
    // Drop trigger if exists
    console.log('📝 Dropping existing trigger if any...');
    await db.query('DROP TRIGGER IF EXISTS after_payment_update');
    console.log('✅ Old trigger dropped (if existed)\n');
    
    // Create the trigger
    console.log('📝 Creating new trigger...');
    const triggerSQL = `
      CREATE TRIGGER after_payment_update
      AFTER UPDATE ON payment
      FOR EACH ROW
      BEGIN
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
          
      END
    `;
    
    await db.query(triggerSQL);
    console.log('✅ Trigger created successfully!\n');
    
    // Verify trigger creation
    console.log('📋 Verifying trigger...');
    const [triggers] = await db.query("SHOW TRIGGERS WHERE `Table` = 'payment'");
    
    if (triggers.length > 0) {
      console.log('✅ Trigger verification successful!\n');
      console.log('📄 Active Triggers on payment table:');
      triggers.forEach((trigger, index) => {
        console.log(`${index + 1}. ${trigger.Trigger}`);
        console.log(`   Timing: ${trigger.Timing}`);
        console.log(`   Event: ${trigger.Event}\n`);
      });
    } else {
      console.log('⚠️  Warning: No triggers found on payment table\n');
    }
    
    console.log('✅ Payment-Invoice trigger setup completed successfully!\n');
    console.log('📌 From now on, when payment is updated:');
    console.log('   - If patient pays (insurance_paid or patient_paid increases)');
    console.log('   - Invoice record is automatically created');
    console.log('   - Invoice ID auto-generated (INV01, INV02, etc.)');
    console.log('   - Invoice amount = insurance_paid + patient_paid');
    console.log('   - Payment method auto-determined (Cash/Card)');
    console.log('   - If invoice exists, it will be updated with new amount');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating trigger:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createInvoiceTrigger();
