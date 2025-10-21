require('dotenv').config();
const db = require('./db');

async function checkTriggers() {
    try {
        console.log('🔍 Checking database triggers...\n');
        
        // Check all triggers related to payment and invoice
        const [triggers] = await db.execute(`
            SHOW TRIGGERS 
            WHERE \`Trigger\` LIKE '%payment%' 
               OR \`Trigger\` LIKE '%invoice%'
        `);
        
        console.log('📌 Active Triggers:');
        if (triggers.length === 0) {
            console.log('❌ No payment or invoice triggers found!');
        } else {
            triggers.forEach(t => {
                console.log(`\n✓ Trigger: ${t.Trigger}`);
                console.log(`  Event: ${t.Event}`);
                console.log(`  Table: ${t.Table}`);
                console.log(`  Timing: ${t.Timing}`);
            });
        }
        
        console.log('\n\n🔍 Checking recent payments...\n');
        
        // Check recent payments
        const [payments] = await db.execute(`
            SELECT payment_id, appointment_id, patient_id, 
                   total_amount, insurance_paid_amount, patient_paid_amount, 
                   discount_amount, Due_payment, status
            FROM payment 
            ORDER BY payment_id DESC 
            LIMIT 5
        `);
        
        console.log('💰 Recent Payments:');
        console.table(payments);
        
        console.log('\n\n🔍 Checking invoices...\n');
        
        // Check invoices
        const [invoices] = await db.execute(`
            SELECT * FROM invoice ORDER BY invoice_id DESC LIMIT 10
        `);
        
        console.log('📄 Invoices:');
        if (invoices.length === 0) {
            console.log('❌ No invoices found!');
        } else {
            console.table(invoices);
        }
        
        await db.end();
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

checkTriggers();
