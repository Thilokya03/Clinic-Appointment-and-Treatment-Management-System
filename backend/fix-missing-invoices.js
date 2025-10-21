require('dotenv').config();
const db = require('./db');

async function fixExistingPayments() {
    try {
        console.log('🔧 FIXING EXISTING PAYMENTS - Creating Missing Invoices\n');
        console.log('='.repeat(80) + '\n');
        
        // Get all payments that have amounts paid but no invoice
        const [paymentsWithoutInvoice] = await db.execute(`
            SELECT p.payment_id, p.appointment_id, 
                   p.insurance_paid_amount, p.patient_paid_amount,
                   p.total_amount, p.status
            FROM payment p
            LEFT JOIN invoice i ON p.payment_id = i.payment_id
            WHERE i.invoice_id IS NULL
              AND (p.insurance_paid_amount > 0 OR p.patient_paid_amount > 0)
        `);
        
        if (paymentsWithoutInvoice.length === 0) {
            console.log('✅ All payments with amounts already have invoices!\n');
            
            // Show current status
            const [allPaymentsWithInvoices] = await db.execute(`
                SELECT p.payment_id, p.appointment_id,
                       p.insurance_paid_amount, p.patient_paid_amount,
                       p.total_amount, p.status,
                       i.invoice_id, i.amount as invoice_amount, i.method
                FROM payment p
                LEFT JOIN invoice i ON p.payment_id = i.payment_id
                ORDER BY p.payment_id
            `);
            
            console.log('📊 CURRENT STATUS:');
            console.table(allPaymentsWithInvoices);
            
        } else {
            console.log(`⚠️  Found ${paymentsWithoutInvoice.length} payment(s) without invoices:\n`);
            console.table(paymentsWithoutInvoice);
            
            console.log('\n🔧 Manually creating invoices for these payments...\n');
            
            for (const payment of paymentsWithoutInvoice) {
                const totalPaid = parseFloat(payment.insurance_paid_amount) + 
                                parseFloat(payment.patient_paid_amount);
                
                if (totalPaid > 0) {
                    // Get next invoice ID
                    const [maxInvoice] = await db.execute(`
                        SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_id, 4) AS UNSIGNED)), 0) as max_num
                        FROM invoice
                    `);
                    
                    const nextNum = maxInvoice[0].max_num + 1;
                    const newInvoiceId = `INV${String(nextNum).padStart(2, '0')}`;
                    
                    // Determine payment method
                    const method = parseFloat(payment.patient_paid_amount) > 0 ? 'Cash' : 'Insurance';
                    
                    // Insert invoice
                    await db.execute(`
                        INSERT INTO invoice (invoice_id, payment_id, amount, method)
                        VALUES (?, ?, ?, ?)
                    `, [newInvoiceId, payment.payment_id, totalPaid, method]);
                    
                    console.log(`✅ Created ${newInvoiceId} for ${payment.payment_id}: LKR ${totalPaid}`);
                }
            }
            
            console.log('\n✨ All missing invoices created!\n');
        }
        
        console.log('\n' + '='.repeat(80));
        console.log('📝 IMPORTANT NOTES:\n');
        console.log('1. The trigger works automatically when you UPDATE payments in ManagePayment page');
        console.log('2. Invoices are created when payment amounts INCREASE');
        console.log('3. If you set amounts initially (not via update), use this script to create invoices');
        console.log('4. Future updates through the UI will trigger invoices automatically\n');
        
        await db.end();
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        console.error(err);
        process.exit(1);
    }
}

fixExistingPayments();
