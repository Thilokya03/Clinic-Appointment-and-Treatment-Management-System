// Test script to verify the treatment-payment trigger works correctly
require('dotenv').config();
const db = require('./db');

async function testTreatmentPaymentTrigger() {
  try {
    console.log('🧪 Testing treatment-payment trigger...\n');
    
    // Step 1: Get test data
    console.log('📋 Step 1: Getting test data...');
    
    // Get an appointment that has a payment
    const [payments] = await db.query(`
      SELECT p.payment_id, p.appointment_id, p.patient_id, p.total_amount, p.Due_payment
      FROM payment p
      LIMIT 1
    `);
    
    if (payments.length === 0) {
      console.log('⚠️  No payment records found. Please create an appointment first.');
      console.log('   (Payments are auto-created when appointments are made)');
      process.exit(1);
    }
    
    const testPayment = payments[0];
    console.log(`✅ Found payment: ${testPayment.payment_id}`);
    console.log(`   Appointment ID: ${testPayment.appointment_id}`);
    console.log(`   Current Total: LKR ${parseFloat(testPayment.total_amount).toFixed(2)}`);
    console.log(`   Current Due: LKR ${parseFloat(testPayment.Due_payment).toFixed(2)}`);
    
    // Get a treatment from catalog
    const [catalog] = await db.query(`
      SELECT catalog_id, treatment_name, treatment_fee
      FROM treatment_catalog
      LIMIT 1
    `);
    
    if (catalog.length === 0) {
      console.log('⚠️  No treatment catalog entries found. Please add treatments to catalog first.');
      process.exit(1);
    }
    
    const testCatalog = catalog[0];
    console.log(`✅ Found treatment: ${testCatalog.treatment_name} (${testCatalog.catalog_id})`);
    console.log(`   Treatment Fee: LKR ${parseFloat(testCatalog.treatment_fee).toFixed(2)}\n`);
    
    // Step 2: Calculate expected values
    const expectedTotal = parseFloat(testPayment.total_amount) + parseFloat(testCatalog.treatment_fee);
    const expectedDue = parseFloat(testPayment.Due_payment) + parseFloat(testCatalog.treatment_fee);
    
    console.log('📊 Expected after adding treatment:');
    console.log(`   Expected Total: LKR ${expectedTotal.toFixed(2)}`);
    console.log(`   Expected Due: LKR ${expectedDue.toFixed(2)}\n`);
    
    // Step 3: Generate test treatment ID
    const [existingTreatments] = await db.query(
      'SELECT COALESCE(MAX(CAST(SUBSTRING(treatment_id, 2) AS UNSIGNED)), 0) as max_num FROM treatment'
    );
    const newTreatmentNum = existingTreatments[0].max_num + 1;
    const testTreatmentId = `T${Date.now()}`; // Use timestamp for unique ID
    
    console.log(`📝 Step 2: Creating test treatment ${testTreatmentId}...`);
    
    // Step 4: Insert treatment (trigger should fire)
    await db.query(`
      INSERT INTO treatment (
        treatment_id,
        catalog_id,
        appointment_id,
        description
      ) VALUES (?, ?, ?, ?)
    `, [
      testTreatmentId,
      testCatalog.catalog_id,
      testPayment.appointment_id,
      'Test treatment for trigger verification'
    ]);
    
    console.log(`✅ Treatment created: ${testTreatmentId}\n`);
    
    // Step 5: Check if payment was updated
    console.log('📋 Step 3: Checking if payment was updated...');
    
    const [updatedPayment] = await db.query(`
      SELECT payment_id, total_amount, Due_payment
      FROM payment
      WHERE payment_id = ?
    `, [testPayment.payment_id]);
    
    const payment = updatedPayment[0];
    const actualTotal = parseFloat(payment.total_amount);
    const actualDue = parseFloat(payment.Due_payment);
    
    console.log('📄 Actual payment values:');
    console.log(`   Actual Total: LKR ${actualTotal.toFixed(2)}`);
    console.log(`   Actual Due: LKR ${actualDue.toFixed(2)}\n`);
    
    // Step 6: Verify results
    const totalMatch = Math.abs(actualTotal - expectedTotal) < 0.01;
    const dueMatch = Math.abs(actualDue - expectedDue) < 0.01;
    
    if (totalMatch && dueMatch) {
      console.log('✅ SUCCESS! Trigger working correctly! ✅\n');
      console.log('📌 Verification Results:');
      console.log(`   ✓ Total Amount: ${actualTotal.toFixed(2)} (Expected: ${expectedTotal.toFixed(2)})`);
      console.log(`   ✓ Due Payment: ${actualDue.toFixed(2)} (Expected: ${expectedDue.toFixed(2)})`);
      console.log(`   ✓ Treatment Fee (${testCatalog.treatment_fee}) was added correctly`);
      
      console.log('\n✅ TRIGGER TEST PASSED! ✅');
      console.log('\n📌 The trigger is working correctly:');
      console.log('   ✓ Treatment fee fetched from catalog');
      console.log('   ✓ Payment total_amount increased by treatment fee');
      console.log('   ✓ Payment Due_payment increased by treatment fee');
      console.log('   ✓ Correct payment record updated using appointment_id');
    } else {
      console.log('❌ FAIL! Payment amounts do not match expected values.');
      console.log(`   Total Match: ${totalMatch}`);
      console.log(`   Due Match: ${dueMatch}`);
    }
    
    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await db.query('DELETE FROM treatment WHERE treatment_id = ?', [testTreatmentId]);
    
    // Reset payment to original values
    await db.query(`
      UPDATE payment 
      SET total_amount = ?, Due_payment = ?
      WHERE payment_id = ?
    `, [testPayment.total_amount, testPayment.Due_payment, testPayment.payment_id]);
    
    console.log('✅ Test data cleaned up\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testTreatmentPaymentTrigger();
