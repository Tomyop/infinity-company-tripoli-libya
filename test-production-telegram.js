// Test script to verify Telegram notifications work on Vercel production
// Run this in browser console on your Vercel deployed site

async function testTelegramProduction() {
    console.log('🧪 TESTING TELEGRAM ON VERCEL PRODUCTION');
    console.log('=' .repeat(50));
    
    try {
        // Test 1: Direct Telegram API call
        console.log('\n📡 Test 1: Testing /api/send-telegram endpoint...');
        
        const telegramResponse = await fetch('/api/send-telegram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: '🧪 Test Message from Vercel Production\n\n🔍 This is a test to verify Telegram notifications work on Vercel deployment.\n\n📅 Time: ' + new Date().toISOString()
            })
        });
        
        const telegramData = await telegramResponse.json();
        console.log('📊 Telegram API Response:', telegramData);
        
        if (telegramData.success) {
            console.log('✅ Telegram notification sent successfully!');
            console.log(`📨 Message ID: ${telegramData.messageId}`);
        } else {
            console.log('❌ Telegram notification failed:', telegramData.error);
            console.log('🔍 Debug info:', telegramData.debug);
        }
        
        // Test 2: Combined notifications (same as your app uses)
        console.log('\n📧 Test 2: Testing /api/send-notifications endpoint...');
        
        const notificationsResponse = await fetch('/api/send-notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                telegramMessage: `🚀 PRODUCTION TEST ORDER

📊 تفاصيل العملية:
• العملية: شراء
• العملة: USDT
• المبلغ: 100 USDT
• السعر: 8.50 د.ل
• الإجمالي: 867.00 د.ل

📞 رقم الهاتف:
0912345678

👤 بيانات الزبون:
• الاسم بالكامل: Production Test User

🏦 بياناتنا:
• البنك: مصرف الجمهورية
• الفرع: وكالة البرج

💼 محفظتنا:
• العنوان: 0xf486b33c719ab4d99742f84e5a94d91589403855
• الشبكة: BEP20

🕐 تم الإرسال: ${new Date().toLocaleString('ar-LY')}`,
                
                emailSubject: '🧪 Production Test - Telegram Notification',
                emailText: 'This is a test email from Vercel production to verify notification system works.',
                emailHtml: `<div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
                    <h2 style="color: #ff6d00; margin-bottom: 20px;">🧪 Production Test</h2>
                    <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <p style="margin: 5px 0;"><strong>Test:</strong> Telegram notifications on Vercel</p>
                        <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('ar-LY')}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> Testing production deployment</p>
                    </div>
                </div>`
            })
        });
        
        const notificationsData = await notificationsResponse.json();
        console.log('📊 Notifications API Response:', notificationsData);
        
        if (notificationsData.success) {
            console.log('✅ Combined notifications test completed!');
            
            if (notificationsData.results.telegram?.success) {
                console.log('✅ Telegram: Working - Message ID:', notificationsData.results.telegram.messageId);
            } else {
                console.log('❌ Telegram: Failed -', notificationsData.results.telegram?.error);
                console.log('🔍 Debug info:', notificationsData.results.telegram?.debug);
            }
            
            if (notificationsData.results.email?.success) {
                console.log('✅ Email: Working - Message ID:', notificationsData.results.email.messageId);
            } else {
                console.log('⚠️ Email: Failed -', notificationsData.results.email?.error);
            }
        } else {
            console.log('❌ Combined notifications failed:', notificationsData.error);
        }
        
        console.log('\n🎯 PRODUCTION TEST SUMMARY:');
        console.log('📍 URL:', window.location.href);
        console.log('🌐 Environment:', process?.env?.NODE_ENV || 'Unknown');
        console.log('📱 User Agent:', navigator.userAgent);
        console.log('🕐 Test completed at:', new Date().toISOString());
        
    } catch (error) {
        console.error('❌ Production test failed:', error);
        console.error('🔍 Full error:', error.stack);
    }
}

// Auto-run the test
console.log('🚀 Starting Telegram production test...');
testTelegramProduction();
