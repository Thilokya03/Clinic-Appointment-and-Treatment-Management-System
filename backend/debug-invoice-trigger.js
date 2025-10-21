require('dotenv').config();
const db = require('./db');

async function testInvoiceTrigger() {
    try {
        console.log('🔍 Testing Invoice Trigger...\n');
        
        // Show the trigger definition
        console.log('📌 Current Trigger Definition:');
        const [triggers] = await db.execute(`
            SHOW CREATE TRIGGER after_payment_update
        `);
        console.log(triggers[0]['SQL Original Statement']);
        console.log('\n' + '='.repeat(80) + '\n');
        
        // Get the current payment
        const [payments] = await db.execute(`
            SELECT * FROM payment WHERE payment_id = 'PM001'
        `);
        
        if (payments.length === 0) {
            console.log('❌ Payment PM001 not found!');
            await db.end();
            return;
        }
        
        console.log('💰 Current Payment:');
        console.table(payments[0]);
        
        console.log('\n🧪 Testing trigger by updating payment...\n');
        
        // Update the payment to trigger the invoice creation
        const oldInsurance = parseFloat(payments[0].insurance_paid_amount);
        const oldPatient = parseFloat(payments[0].patient_paid_amount);
        
        // Increase payment amounts to trigger the invoice
        const newInsurance = oldInsurance + 100;
        const newPatient = oldPatient + 100;
        
        console.log(`Updating insurance_paid_amount: ${oldInsurance} → ${newInsurance}`);
        console.log(`Updating patient_paid_amount: ${oldPatient} → ${newPatient}`);
        
        await db.execute(`
            UPDATE payment 
            SET insurance_paid_amount = ?,
                patient_paid_amount = ?
            WHERE payment_id = 'PM001'
        `, [newInsurance, newPatient]);
        
        console.log('✓ Payment updated!\n');
        
        // Check if invoice was created
        const [invoices] = await db.execute(`
            SELECT * FROM invoice WHERE payment_id = 'PM001'
        `);
        
        console.log('📄 Invoice Status:');
        if (invoices.length === 0) {
            console.log('❌ No invoice created! The trigger did NOT fire correctly.');
            
            // Check for any errors in trigger execution
            console.log('\n🔍 Checking for trigger errors...');
            const [warnings] = await db.execute('SHOW WARNINGS');
            if (warnings.length > 0) {
                console.table(warnings);
            } else {
                console.log('No warnings found.');
            }
        } else {
            console.log('✅ Invoice created successfully!');
            console.table(invoices[0]);
        }
        
        await db.end();
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
}

testInvoiceTrigger();
