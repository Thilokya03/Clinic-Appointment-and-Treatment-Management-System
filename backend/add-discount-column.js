// Migration script to add discount_amount column to payment table
require('dotenv').config();
const db = require('./db');

async function addDiscountColumn() {
  try {
    console.log('🔧 Adding discount_amount column to payment table...');
    
    // Check if column already exists
    const [columns] = await db.query("SHOW COLUMNS FROM payment LIKE 'discount_amount'");
    
    if (columns.length > 0) {
      console.log('✅ discount_amount column already exists');
      process.exit(0);
    }
    
    // Add the column
    await db.query(`
      ALTER TABLE payment 
      ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0.00 
      AFTER patient_paid_amount
    `);
    
    console.log('✅ discount_amount column added successfully!');
    
    // Verify
    const [cols] = await db.query('DESCRIBE payment');
    console.log('\n📋 Updated payment table columns:');
    cols.forEach(c => console.log(`   ${c.Field.padEnd(25)} ${c.Type}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding column:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addDiscountColumn();
