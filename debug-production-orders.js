// PRODUCTION DEBUG SCRIPT - Run this in browser console on Vercel deployed site
// This will help identify the exact root cause of notification failures

async function debugProductionOrders() {
    console.log('🔍 PRODUCTION ORDER DEBUG SCRIPT');
    console.log('=' .repeat(60));
    
    // 1. Check Environment
    console.log('\n🌍 ENVIRONMENT CHECK:');
    console.log('  - URL:', window.location.href);
    console.log('  - Origin:', window.location.origin);
    console.log('  - Protocol:', window.location.protocol);
    console.log('  - Host:', window.location.host);
    
    // 2. Test API Endpoints
    console.log('\n📡 TESTING API ENDPOINTS:');
    
    try {
        // Test send-telegram endpoint
        console.log('\n1️⃣ Testing /api/send-telegram...');
        const telegramTest = await fetch('/api/send-telegram', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: '🧪 Production Debug Test - Telegram'
            })
        });
        
        console.log('📊 TELEGRAM API RESPONSE:');
        console.log('  - Status:', telegramTest.status, telegramTest.statusText);
        console.log('  - Headers:', Object.fromEntries(telegramTest.headers.entries()));
        
        if (telegramTest.ok) {
            const telegramData = await telegramTest.json();
            console.log('  - Response:', telegramData);
            console.log('✅ TELEGRAM ENDPOINT: WORKING');
        } else {
            const errorText = await telegramTest.text();
            console.log('  - Error:', errorText);
            console.log('❌ TELEGRAM ENDPOINT: FAILED');
        }
    } catch (error) {
        console.error('❌ TELEGRAM API TEST FAILED:', error);
    }
    
    try {
        // Test send-notifications endpoint
        console.log('\n2️⃣ Testing /api/send-notifications...');
        const notificationsTest = await fetch('/api/send-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramMessage: '🧪 Production Debug Test - Combined Notifications',
                emailSubject: '🧪 Production Debug Test',
                emailText: 'This is a test email from production debug script',
                emailHtml: '<h2>🧪 Production Debug Test</h2><p>Email test from production</p>'
            })
        });
        
        console.log('📊 NOTIFICATIONS API RESPONSE:');
        console.log('  - Status:', notificationsTest.status, notificationsTest.statusText);
        console.log('  - Headers:', Object.fromEntries(notificationsTest.headers.entries()));
        
        if (notificationsTest.ok) {
            const notificationsData = await notificationsTest.json();
            console.log('  - Response:', notificationsData);
            
            // Analyze results
            const telegramSuccess = notificationsData.results?.telegram?.success;
            const emailSuccess = notificationsData.results?.email?.success;
            
            console.log('🎯 NOTIFICATION RESULTS:');
            console.log('  - Telegram:', telegramSuccess ? '✅ SUCCESS' : '❌ FAILED');
            console.log('  - Email:', emailSuccess ? '✅ SUCCESS' : '❌ FAILED');
            
            if (!telegramSuccess) {
                console.log('  - Telegram Error:', notificationsData.results?.telegram?.error);
                console.log('  - Telegram Debug:', notificationsData.results?.telegram?.debug);
            }
            
            if (!emailSuccess) {
                console.log('  - Email Error:', notificationsData.results?.email?.error);
                console.log('  - Email Debug:', notificationsData.results?.email?.debug);
            }
            
            const overallStatus = (telegramSuccess || emailSuccess) ? '🟡 PARTIAL' : '🔴 COMPLETE FAILURE';
            console.log('  - Overall:', overallStatus);
            
        } else {
            const errorText = await notificationsTest.text();
            console.log('  - Error:', errorText);
            console.log('❌ NOTIFICATIONS ENDPOINT: FAILED');
        }
    } catch (error) {
        console.error('❌ NOTIFICATIONS API TEST FAILED:', error);
    }
    
    // 3. Test Network Connectivity
    console.log('\n🌐 NETWORK CONNECTIVITY TEST:');
    
    try {
        // Test external API connectivity
        const externalTest = await fetch('https://api.telegram.org/bot8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE/getMe');
        if (externalTest.ok) {
            const botInfo = await externalTest.json();
            console.log('✅ EXTERNAL TELEGRAM API: ACCESSIBLE');
            console.log('  - Bot Info:', botInfo.result?.username || 'Unknown');
        } else {
            console.log('❌ EXTERNAL TELEGRAM API: NOT ACCESSIBLE');
        }
    } catch (error) {
        console.error('❌ EXTERNAL API TEST FAILED:', error);
    }
    
    // 4. Check Browser Capabilities
    console.log('\n🔧 BROWSER CAPABILITIES:');
    console.log('  - Fetch Support:', typeof fetch !== 'undefined');
    console.log('  - AbortController Support:', typeof AbortController !== 'undefined');
    console.log('  - Promise Support:', typeof Promise !== 'undefined');
    console.log('  - Console Support:', typeof console !== 'undefined');
    
    // 5. Simulate Real Order Flow
    console.log('\n🛒 SIMULATING REAL ORDER FLOW:');
    console.log('This simulates exactly what happens when a user places an order...');
    
    try {
        const realOrderData = {
            telegramMessage: `🚀 REAL ORDER TEST

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

🕐 تم الإرسال: ${new Date().toLocaleString('ar-LY')}`,
            
            emailSubject: '🚀 REAL ORDER TEST - Production Debug',
            emailText: 'Real order test from production debug script',
            emailHtml: `<div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
                <h2 style="color: #ff6d00; margin-bottom: 20px;">🚀 REAL ORDER TEST</h2>
                <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="margin: 5px 0;"><strong>Test:</strong> Real order simulation</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('ar-LY')}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> Testing production deployment</p>
                </div>
            </div>`
        };
        
        console.log('📤 SENDING REAL ORDER SIMULATION...');
        const realOrderResponse = await fetch('/api/send-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(realOrderData)
        });
        
        if (realOrderResponse.ok) {
            const realOrderResult = await realOrderResponse.json();
            console.log('✅ REAL ORDER SIMULATION: SUCCESS');
            console.log('📊 RESULT:', realOrderResult);
            
            // Final diagnosis
            const telegramWorked = realOrderResult.results?.telegram?.success;
            const emailWorked = realOrderResult.results?.email?.success;
            
            console.log('\n🎯 FINAL DIAGNOSIS:');
            if (telegramWorked && emailWorked) {
                console.log('✅ EVERYTHING IS WORKING - Issue might be in frontend');
            } else if (telegramWorked && !emailWorked) {
                console.log('🟡 TELEGRAM WORKS, EMAIL FAILS - Check email configuration');
            } else if (!telegramWorked && emailWorked) {
                console.log('🟡 EMAIL WORKS, TELEGRAM FAILS - Check Telegram configuration');
            } else {
                console.log('🔴 BOTH FAIL - Check serverless functions and environment variables');
            }
        } else {
            const errorText = await realOrderResponse.text();
            console.log('❌ REAL ORDER SIMULATION: FAILED');
            console.log('ERROR:', errorText);
        }
    } catch (error) {
        console.error('❌ REAL ORDER SIMULATION FAILED:', error);
    }
    
    console.log('\n🏁 DEBUG SCRIPT COMPLETED');
    console.log('Check the logs above to identify the exact issue');
}

// Auto-run the debug script
debugProductionOrders();
