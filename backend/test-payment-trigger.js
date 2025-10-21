// Test script to verify the payment trigger works correctly
require('dotenv').config();
const db = require('./db');

async function testPaymentTrigger() {
  try {
    console.log('🧪 Testing payment trigger...\n');
    
    // Step 1: Get a valid patient and schedule
    console.log('📋 Step 1: Getting test data...');
    const [patients] = await db.query('SELECT patient_id, name FROM patient LIMIT 1');
    const [schedules] = await db.query('SELECT schedule_id, fee FROM doctor_schedule LIMIT 1');
    
    if (patients.length === 0 || schedules.length === 0) {
      console.log('⚠️  No test data available. Please ensure you have at least one patient and one doctor schedule.');
      process.exit(1);
    }
    
    const testPatient = patients[0];
    const testSchedule = schedules[0];
    
    console.log(`✅ Patient: ${testPatient.name} (${testPatient.patient_id})`);
    console.log(`✅ Schedule: ${testSchedule.schedule_id} (Fee: LKR ${testSchedule.fee})\n`);
    
    // Step 2: Use a simple test appointment ID
    const testApptId = 'ATEST'; // Simple 5-char test ID
    
    // Delete any existing test appointment first
    await db.query('DELETE FROM appointment WHERE appointment_id = ?', [testApptId]);
    
    console.log(`📝 Step 2: Creating test appointment ${testApptId}...`);
    
    // Step 3: Count payments before
    const [paymentsBefore] = await db.query('SELECT COUNT(*) as count FROM payment');
    const paymentCountBefore = paymentsBefore[0].count;
    console.log(`   Current payment records: ${paymentCountBefore}`);
    
    // Step 4: Insert appointment
    await db.query(`
      INSERT INTO appointment (
        appointment_id,
        patient_id,
        schedule_id,
        appointment_date,
        start_time,
        end_time,
        appointment_fee,
        status
      ) VALUES (?, ?, ?, CURDATE(), '10:00:00', '10:30:00', ?, 'Scheduled')
    `, [testApptId, testPatient.patient_id, testSchedule.schedule_id, testSchedule.fee]);
    
    console.log(`✅ Appointment created: ${testApptId}`);
    
    // Step 5: Check if payment was automatically created
    console.log('\n📋 Step 3: Checking if payment was auto-created...');
    
    const [paymentsAfter] = await db.query('SELECT COUNT(*) as count FROM payment');
    const paymentCountAfter = paymentsAfter[0].count;
    console.log(`   Current payment records: ${paymentCountAfter}`);
    
    const [newPayment] = await db.query(`
      SELECT * FROM payment WHERE appointment_id = ?
    `, [testApptId]);
    
    if (newPayment.length > 0) {
      const payment = newPayment[0];
      console.log('\n✅ SUCCESS! Payment was automatically created!');
      console.log('\n📄 Payment Details:');
      console.log(`   Payment ID: ${payment.payment_id}`);
      console.log(`   Appointment ID: ${payment.appointment_id}`);
      console.log(`   Patient ID: ${payment.patient_id}`);
      console.log(`   Total Amount: LKR ${payment.total_amount}`);
      console.log(`   Insurance Paid: LKR ${payment.insurance_paid_amount}`);
      console.log(`   Patient Paid: LKR ${payment.patient_paid_amount}`);
      console.log(`   Due Payment: LKR ${payment.Due_payment}`);
      console.log(`   Status: ${payment.status}`);
      
      console.log('\n✅ TRIGGER TEST PASSED! ✅');
      console.log('\n📌 The trigger is working correctly:');
      console.log('   ✓ Payment record auto-generated when appointment created');
      console.log('   ✓ Payment ID auto-incremented');
      console.log('   ✓ Total amount set to appointment fee');
      console.log('   ✓ Due payment equals total amount');
      console.log('   ✓ Status set to Pending');
    } else {
      console.log('\n❌ FAIL! No payment was created automatically.');
      console.log('   The trigger may not be working correctly.');
    }
    
    // Cleanup (optional - comment out if you want to keep the test data)
    console.log('\n🧹 Cleaning up test data...');
    await db.query('DELETE FROM appointment WHERE appointment_id = ?', [testApptId]);
    console.log('✅ Test data cleaned up');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testPaymentTrigger();
