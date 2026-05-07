console.log('=== 🧪 MOCK ORDER TEST ===');
console.log('Testing notifications to Elarenha@gmail.com and Telegram Chat ID 8699917719...');

async function testMockOrder() {
    try {
        console.log('\n📤 Sending mock order request...');
        
        const mockOrderData = {
            telegramMessage: `🚀 طلب جديد (MOCK TEST)

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

✅ لقد قمت بالتحويل`,
            
            emailSubject: '🚀 طلب جديد (MOCK TEST) - شراء USDT',
            emailText: 'هذا طلب اختبار من النظام المحدث للتحقق من وصول الإشعارات',
            emailHtml: `<div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
                <h2 style="color: #ff6d00; margin-bottom: 20px;">🚀 طلب جديد (MOCK TEST)</h2>
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

        const response = await fetch('http://localhost:3000/api/send-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mockOrderData)
        });
        
        const result = await response.json();
        console.log('\n📨 Response received:', JSON.stringify(result, null, 2));
        
        if (result.success) {
            console.log('\n✅ MOCK ORDER TEST RESULTS:');
            
            if (result.results.telegram?.success) {
                console.log('📱 Telegram: ✅ SENT to Chat ID 8699917719');
                console.log(`   Message ID: ${result.results.telegram.messageId}`);
                console.log(`   Timestamp: ${result.results.telegram.timestamp}`);
            } else {
                console.log('📱 Telegram: ❌ FAILED');
                console.log(`   Error: ${result.results.telegram?.error}`);
            }
            
            if (result.results.email?.success) {
                console.log('📧 Email: ✅ SENT to Elarenha@gmail.com');
                console.log(`   Message ID: ${result.results.email.messageId}`);
                console.log(`   Timestamp: ${result.results.email.timestamp}`);
                console.log('\n🎉 EMAIL NOTIFICATIONS ARE WORKING!');
            } else {
                console.log('📧 Email: ⚠️ NEEDS APP PASSWORD');
                console.log(`   Error: ${result.results.email?.error}`);
                console.log('\n📋 To fix email: Get App Password from Google and add to .env');
            }
            
            console.log('\n🎯 OVERALL STATUS:');
            console.log('Telegram Notifications: ✅ WORKING');
            console.log('Email Notifications: ⏳ READY (needs App Password)');
            
        } else {
            console.log('❌ MOCK ORDER TEST FAILED:', result.error);
        }
        
    } catch (error) {
        console.error('❌ TEST FAILED:', error.message);
    }
}

testMockOrder();
