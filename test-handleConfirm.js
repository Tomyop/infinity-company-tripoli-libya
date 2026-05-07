console.log('=== TESTING handleConfirm FUNCTION DIRECTLY ===');

// Test the same data that would be sent from frontend
const testOrderData = {
    amount: '100',
    currency: 'usdt',
    operation: 'buy',
    paymentMethod: 'bank',
    selectedNetwork: 'BEP20',
    formData: {
        fullName: 'Test User',
        phone: '0912345678',
        walletAddress: '0xf486b33c719ab4d99742f84e5a94d91589403855',
        transferDate: '07/05/2026',
        transferTime: '16:30'
    }
};

async function testHandleConfirm() {
    try {
        console.log('🚀 Testing handleConfirm function with test data...');
        
        // Simulate the exact API call that handleConfirm makes
        const message = `🚀 طلب جديد

📊 تفاصيل العملية:
• العملية: شراء
• العملة: USDT
• المبلغ: 100 USDT
• السعر: 8.50 د.ل
• الإجمالي: 867.00 د.ل
• طريقة الدفع: تحويل بنكي
• التاريخ: 07/05/2026
• الوقت: 16:30

📞 رقم الهاتف:
0912345678

👤 بيانات الزبون:
• الاسم بالكامل: Test User

🏦 بياناتنا:
• البنك: مصرف الجمهورية
• الفرع: وكالة البرج
• رقم الحساب: 104202000002722
• الآيبان: LY24007039039011370298010

✅ لقد قمت بالتحويل`;

        console.log('📤 Sending notification API call...');
        
        const response = await fetch('http://localhost:3001/api/send-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegramMessage: message,
                emailSubject: '🚀 New Order - شراء USDT',
                emailText: message,
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
            })
        });
        
        const data = await response.json();
        console.log('📨 Response received:', data);
        
        if (data.success) {
            console.log('✅ handleConfirm simulation: SUCCESS');
            console.log('Telegram:', data.results.telegram?.success ? '✅ SENT' : '❌ FAILED');
            console.log('Email:', data.results.email?.success ? '✅ SENT' : '❌ FAILED');
        } else {
            console.log('❌ handleConfirm simulation: FAILED');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testHandleConfirm();
