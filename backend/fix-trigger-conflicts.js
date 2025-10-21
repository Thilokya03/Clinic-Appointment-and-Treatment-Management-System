// Script to fix trigger conflicts and set up invoice trigger correctly
require('dotenv').config();
const db = require('./db');

async function fixTriggerConflicts() {
  try {
    console.log('🔧 Fixing trigger conflicts...\n');
    
    // List all triggers
    console.log('📋 Current triggers:');
    const [triggers] = await db.query('SHOW TRIGGERS');
    triggers.forEach(t => {
      console.log(`   ${t.Trigger} - ${t.Timing} ${t.Event} ON ${t.Table}`);
    });
    console.log('');
    
    // Drop any conflicting triggers on invoice table that might update payment
    console.log('📝 Dropping potentially conflicting triggers...');
    await db.query('DROP TRIGGER IF EXISTS update_payment_after_invoice');
    console.log('✅ Dropped update_payment_after_invoice (if existed)');
    
    await db.query('DROP TRIGGER IF EXISTS set_payment_total');
    console.log('✅ Dropped set_payment_total (if existed)');
    
    console.log('\n✅ Trigger conflicts resolved!');
    console.log('📌 Now you can test the invoice trigger without circular dependency issues.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixTriggerConflicts();
