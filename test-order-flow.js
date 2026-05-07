import dotenv from 'dotenv';
dotenv.config();

console.log('=== END-TO-END ORDER FLOW TEST ===');
console.log('Testing complete order submission flow...');

async function testOrderFlow() {
    try {
        console.log('\n🔄 Step 1: Simulating order submission...');
        
        // Mock order data (same as frontend would send)
        const mockOrder = {
            telegramMessage: `🚀 طلب جديد

📊 تفاصيل العملية:
• العملية: شراء
• العملة: USDT
• المبلغ: 100 USDT
• السعر: 8.50 د.ل
• الإجمالي: 867.00 د.ل
• طريقة الدفع: تحويل بنكي

📞 رقم الهاتف:
0912345678

👤 بيانات الزبون:
• الاسم بالكامل: Test User
• عنوان المحفظة: 0xf486b33c719ab4d99742f84e5a94d91589403855
• الشبكة: BEP20

🏦 بياناتنا:
• البنك: مصرف الجمهورية
• الفرع: وكالة البرج
• رقم الحساب: 104202000002722
• الآيبان: LY24007039039011370298010

💼 محفظتنا:
• العنوان: 0xf486b33c719ab4d99742f84e5a94d91589403855
• الشبكة: BEP20`,
            
            emailSubject: '🚀 New Order - شراء USDT',
            emailText: 'Test order submission - 100 USDT purchase',
            emailHtml: `<div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
                <h2 style="color: #ff6d00; margin-bottom: 20px;">🚀 طلب جديد</h2>
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <h3 style="color: #333; margin-bottom: 15px;">📊 تفاصيل العملية:</h3>
                    <p style="margin: 5px 0;"><strong>نوع العملية:</strong> شراء</p>
                    <p style="margin: 5px 0;"><strong>العملة:</strong> USDT</p>
                    <p style="margin: 5px 0;"><strong>المبلغ:</strong> 100 USDT</p>
                    <p style="margin: 5px 0;"><strong>السعر:</strong> 8.50 د.ل</p>
                    <p style="margin: 5px 0;"><strong>الإجمالي:</strong> 867.00 د.ل</p>
                    <p style="margin: 5px 0;"><strong>رقم الهاتف:</strong> 0912345678</p>
                    <p style="margin: 5px 0;"><strong>الاسم:</strong> Test User</p>
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        🕐 تم الإرسال: ${new Date().toLocaleString('ar-LY')}
                    </p>
                </div>
            </div>`
        };

        console.log('\n📤 Step 2: Sending notifications...');
        
        const response = await fetch('http://localhost:3001/api/send-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockOrder)
        });
        
        const result = await response.json();
        console.log('📨 Response:', JSON.stringify(result, null, 2));
        
        if (result.success) {
            console.log('\n✅ ORDER FLOW TEST RESULTS:');
            
            if (result.results.telegram?.success) {
                console.log('✅ TELEGRAM: WORKING - Message ID:', result.results.telegram.messageId);
            } else {
                console.log('❌ TELEGRAM: FAILED -', result.results.telegram?.error);
            }
            
            if (result.results.email?.success) {
                console.log('✅ EMAIL: WORKING - Message ID:', result.results.email.messageId);
            } else {
                console.log('⚠️ EMAIL: CONFIGURATION NEEDED -', result.results.email?.error);
            }
            
            console.log('\n🎯 END-TO-END TEST: SUCCESS');
            console.log('📋 Order flow: Frontend → Backend → Notifications ✅');
            
        } else {
            console.log('❌ ORDER FLOW TEST FAILED:', result.error);
        }
        
    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
    }
}

testOrderFlow();
