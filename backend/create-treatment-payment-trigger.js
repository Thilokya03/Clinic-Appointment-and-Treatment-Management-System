// Script to create the treatment-payment trigger
require('dotenv').config();
const db = require('./db');

async function createTreatmentPaymentTrigger() {
  try {
    console.log('🔧 Creating treatment-payment trigger...');
    
    // Drop trigger if exists
    console.log('📝 Dropping existing trigger if any...');
    await db.query('DROP TRIGGER IF EXISTS after_treatment_insert');
    console.log('✅ Old trigger dropped (if existed)');
    
    // Create the trigger
    console.log('📝 Creating new trigger...');
    const triggerSQL = `
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
          
      END
    `;
    
    await db.query(triggerSQL);
    console.log('✅ Trigger created successfully!');
    
    // Verify trigger creation
    console.log('📋 Verifying trigger...');
    const [triggers] = await db.query("SHOW TRIGGERS WHERE `Table` = 'treatment'");
    
    if (triggers.length > 0) {
      console.log('✅ Trigger verification successful!');
      console.log('\n📄 Active Triggers on treatment table:');
      triggers.forEach((trigger, index) => {
        console.log(`${index + 1}. ${trigger.Trigger}`);
        console.log(`   Timing: ${trigger.Timing}`);
        console.log(`   Event: ${trigger.Event}`);
      });
    } else {
      console.log('⚠️  Warning: No triggers found on treatment table');
    }
    
    console.log('\n✅ Treatment-Payment trigger setup completed successfully!');
    console.log('📌 From now on, whenever a treatment is added:');
    console.log('   - Treatment fee will be fetched from treatment_catalog');
    console.log('   - Payment total_amount will be increased by treatment fee');
    console.log('   - Payment Due_payment will be increased by treatment fee');
    console.log('   - Automatically updates the correct payment using appointment_id');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating trigger:', error.message);
    console.error(error);
    process.exit(1);
  }
}

createTreatmentPaymentTrigger();
