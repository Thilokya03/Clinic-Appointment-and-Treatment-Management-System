// Migration script to fix treatment_id field length
require('dotenv').config();
const db = require('./db');

async function migrateTreatmentIdLength() {
  try {
    console.log('🔧 Starting migration: Fixing treatment_id field length...');
    
    // Alter the treatment_id column to varchar(20)
    await db.query('ALTER TABLE treatment MODIFY treatment_id VARCHAR(20) NOT NULL');
    console.log('✅ Successfully updated treatment_id to VARCHAR(20)');
    
    // Verify the change
    const [columns] = await db.query("DESCRIBE treatment");
    const treatmentIdColumn = columns.find(col => col.Field === 'treatment_id');
    console.log('📋 Current treatment_id definition:', treatmentIdColumn);
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrateTreatmentIdLength();
