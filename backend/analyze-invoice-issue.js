require('dotenv').config();
const db = require('./db');

async function analyzeInvoiceIssue() {
    try {
        console.log('🔍 INVOICE TRIGGER ANALYSIS\n');
        console.log('='.repeat(80) + '\n');
        
        // Check all payments
        const [allPayments] = await db.execute(`
            SELECT payment_id, appointment_id, 
                   total_amount, 
                   insurance_paid_amount, 
                   patient_paid_amount, 
                   discount_amount,
                   Due_payment,
                   status
            FROM payment 
            ORDER BY payment_id
        `);
        
        console.log('💰 ALL PAYMENTS:');
        console.table(allPayments);
        
        // Check all invoices
        const [allInvoices] = await db.execute(`
            SELECT * FROM invoice ORDER BY invoice_id
        `);
        
        console.log('\n📄 ALL INVOICES:');
        if (allInvoices.length === 0) {
            console.log('❌ No invoices found!\n');
        } else {
            console.table(allInvoices);
        }
        
        console.log('\n' + '='.repeat(80));
        console.log('📚 HOW THE INVOICE TRIGGER WORKS:');
        console.log('='.repeat(80) + '\n');
        
        console.log('The trigger ONLY creates an invoice when:');
        console.log('  1. You UPDATE a payment record');
        console.log('  2. The sum of (insurance_paid + patient_paid) INCREASES\n');
        
        console.log('Example scenarios:\n');
        
        console.log('✅ WILL CREATE INVOICE:');
        console.log('   Before: insurance=0,    patient=0');
        console.log('   After:  insurance=100,  patient=500');
        console.log('   Result: Invoice created with amount=600\n');
        
        console.log('✅ WILL UPDATE INVOICE:');
        console.log('   Before: insurance=100,  patient=500  (invoice exists with 600)');
        console.log('   After:  insurance=200,  patient=600');
        console.log('   Result: Invoice updated to amount=800\n');
        
        console.log('❌ WILL NOT CREATE INVOICE:');
        console.log('   Before: insurance=100,  patient=500');
        console.log('   After:  insurance=100,  patient=500  (same values)');
        console.log('   Result: No change, no invoice created\n');
        
        console.log('❌ WILL NOT CREATE INVOICE:');
        console.log('   Before: insurance=200,  patient=600');
        console.log('   After:  insurance=100,  patient=500  (decreased)');
        console.log('   Result: No invoice created (refunds not supported)\n');
        
        console.log('='.repeat(80));
        console.log('\n💡 SOLUTIONS:\n');
        
        for (let i = 0; i < allPayments.length; i++) {
            const payment = allPayments[i];
            const oldInsurance = parseFloat(payment.insurance_paid_amount);
            const oldPatient = parseFloat(payment.patient_paid_amount);
            const totalPaid = oldInsurance + oldPatient;
            
            if (totalPaid > 0) {
                console.log(`Payment ${payment.payment_id}:`);
                console.log(`  Current paid: Insurance=${oldInsurance}, Patient=${oldPatient}, Total=${totalPaid}`);
                console.log(`  ⚠️  This payment already has amounts set!`);
                console.log(`  To create invoice, you need to INCREASE these amounts in ManagePayment page.\n`);
            } else {
                console.log(`Payment ${payment.payment_id}:`);
                console.log(`  Current paid: Insurance=${oldInsurance}, Patient=${oldPatient}, Total=${totalPaid}`);
                console.log(`  ✅ This payment is ready! Set insurance/patient amounts to create invoice.\n`);
            }
        }
        
        await db.end();
        
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

analyzeInvoiceIssue();
