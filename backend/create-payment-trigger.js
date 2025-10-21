// Script to create the payment trigger
require('dotenv').config();
const db = require('./db');
const fs = require('fs');
const path = require('path');

async function createPaymentTrigger() {
  try {
    console.log('🔧 Creating payment trigger...');
    
    // Drop trigger if exists
    console.log('📝 Dropping existing trigger if any...');
    await db.query('DROP TRIGGER IF EXISTS after_appointment_insert');
    console.log('✅ Old trigger dropped (if existed)');
    
    // Create the trigger
    console.log('📝 Creating new trigger...');
    const triggerSQL = `
      CREATE TRIGGER after_appointment_insert
      AFTER INSERT ON appointment
      FOR EACH ROW
      BEGIN
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
      END
    `;
    
    await db.query(triggerSQL);
    console.log('✅ Trigger created successfully!');
    
    // Verify trigger creation
    console.log('📋 Verifying trigger...');
    const [triggers] = await db.query("SHOW TRIGGERS WHERE `Table` = 'appointment'");
    
    if (triggers.length > 0) {
      console.log('✅ Trigger verification successful!');
      console.log('Trigger details:', {
        name: triggers[0].Trigger,
        timing: triggers[0].Timing,
        event: triggers[0].Event,
        table: triggers[0].Table
      });
    } else {
      console.log('⚠️  Warning: Trigger not found in verification');
    }
    
    console.log('\n✅ Payment trigger setup completed successfully!');
    console.log('📌 From now on, whenever an appointment is created:');
    console.log('   - A payment record will be automatically created');
    console.log('   - Payment ID will be auto-generated (PM001, PM002, etc.)');
    console.log('   - Total amount will be set to appointment fee');
    console.log('   - Due payment will equal total amount');
    console.log('   - Status will be set to "Pending"');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating trigger:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createPaymentTrigger();
