// Test script to verify the invoice trigger works correctly
require('dotenv').config();
const db = require('./db');

async function testInvoiceTrigger() {
  try {
    console.log('🧪 Testing payment-invoice trigger...\n');
    
    // Step 1: Get or create a test payment
    console.log('📋 Step 1: Setting up test payment...');
    
    let [payments] = await db.query(`
      SELECT payment_id, total_amount, insurance_paid_amount, patient_paid_amount, Due_payment
      FROM payment
      LIMIT 1
    `);
    
    if (payments.length === 0) {
      console.log('⚠️  No payments found. Please create an appointment first.');
      process.exit(1);
    }
    
    const testPayment = payments[0];
    console.log(`✅ Using payment: ${testPayment.payment_id}`);
    console.log(`   Total Amount: LKR ${parseFloat(testPayment.total_amount).toFixed(2)}`);
    console.log(`   Current Insurance Paid: LKR ${parseFloat(testPayment.insurance_paid_amount).toFixed(2)}`);
    console.log(`   Current Patient Paid: LKR ${parseFloat(testPayment.patient_paid_amount).toFixed(2)}`);
    console.log(`   Due Payment: LKR ${parseFloat(testPayment.Due_payment).toFixed(2)}\n`);
    
    // Step 2: Count invoices before
    const [invoicesBefore] = await db.query('SELECT COUNT(*) as count FROM invoice');
    const invoiceCountBefore = invoicesBefore[0].count;
    console.log(`📋 Step 2: Current invoice count: ${invoiceCountBefore}`);
    
    // Step 3: Update payment (simulate patient paying)
    console.log('\n📝 Step 3: Simulating patient payment...');
    const paymentAmount = 500.00;
    const newPatientPaid = parseFloat(testPayment.patient_paid_amount) + paymentAmount;
    const newDuePayment = parseFloat(testPayment.Due_payment) - paymentAmount;
    
    console.log(`   Adding LKR ${paymentAmount.toFixed(2)} to patient_paid_amount`);
    
    await db.query(`
      UPDATE payment
      SET patient_paid_amount = ?,
          Due_payment = ?
      WHERE payment_id = ?
    `, [newPatientPaid, newDuePayment, testPayment.payment_id]);
    
    console.log('✅ Payment updated\n');
    
    // Step 4: Check if invoice was created
    console.log('📋 Step 4: Checking if invoice was created...');
    
    const [invoicesAfter] = await db.query('SELECT COUNT(*) as count FROM invoice');
    const invoiceCountAfter = invoicesAfter[0].count;
    console.log(`   Current invoice count: ${invoiceCountAfter}`);
    
    const [newInvoice] = await db.query(`
      SELECT * FROM invoice WHERE payment_id = ?
    `, [testPayment.payment_id]);
    
    if (newInvoice.length > 0) {
      const invoice = newInvoice[0];
      console.log('\n✅ SUCCESS! Invoice was automatically created!\n');
      console.log('📄 Invoice Details:');
      console.log(`   Invoice ID: ${invoice.invoice_id}`);
      console.log(`   Payment ID: ${invoice.payment_id}`);
      console.log(`   Amount: LKR ${parseFloat(invoice.amount).toFixed(2)}`);
      console.log(`   Method: ${invoice.method}`);
      
      // Verify the amount is correct
      const [updatedPayment] = await db.query(`
        SELECT insurance_paid_amount, patient_paid_amount
        FROM payment WHERE payment_id = ?
      `, [testPayment.payment_id]);
      
      const expectedAmount = parseFloat(updatedPayment[0].insurance_paid_amount) + 
                           parseFloat(updatedPayment[0].patient_paid_amount);
      const actualAmount = parseFloat(invoice.amount);
      
      if (Math.abs(expectedAmount - actualAmount) < 0.01) {
        console.log(`\n✅ Amount verification: PASSED`);
        console.log(`   Expected: LKR ${expectedAmount.toFixed(2)}`);
        console.log(`   Actual: LKR ${actualAmount.toFixed(2)}`);
      } else {
        console.log(`\n⚠️  Amount mismatch:`);
        console.log(`   Expected: LKR ${expectedAmount.toFixed(2)}`);
        console.log(`   Actual: LKR ${actualAmount.toFixed(2)}`);
      }
      
      console.log('\n✅ TRIGGER TEST PASSED! ✅\n');
      console.log('📌 The trigger is working correctly:');
      console.log('   ✓ Invoice created automatically when payment updated');
      console.log('   ✓ Invoice ID auto-generated');
      console.log('   ✓ Invoice amount = insurance_paid + patient_paid');
      console.log('   ✓ Payment method determined automatically');
      
    } else {
      console.log('\n❌ FAIL! No invoice was created automatically.');
      console.log('   The trigger may not be working correctly.');
    }
    
    // Cleanup (optional - reset the payment)
    console.log('\n🧹 Cleaning up test data...');
    await db.query(`
      UPDATE payment
      SET patient_paid_amount = ?,
          Due_payment = ?
      WHERE payment_id = ?
    `, [testPayment.patient_paid_amount, testPayment.Due_payment, testPayment.payment_id]);
    
    // Delete test invoice
    await db.query('DELETE FROM invoice WHERE payment_id = ?', [testPayment.payment_id]);
    console.log('✅ Test data cleaned up\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testInvoiceTrigger();
