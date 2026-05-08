// TELEGRAM TOKEN VALIDATION SCRIPT
// Run this in browser console to test current token

async function testTelegramToken() {
    console.log('🔍 TESTING TELEGRAM TOKEN');
    console.log('=' .repeat(50));
    
    // Current token from the project
    const token = "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
    
    console.log('🔍 TOKEN ANALYSIS:');
    console.log('  - Token:', token);
    console.log('  - Length:', token.length);
    console.log('  - Has extra spaces:', token !== token.trim());
    console.log('  - Format check:', token.includes(':') ? '✅ Has colon' : '❌ Missing colon');
    console.log('  - Starts with numbers:', /^\d+:/.test(token) ? '✅ Yes' : '❌ No');
    
    // Test 1: getMe endpoint
    console.log('\n📡 TEST 1: getMe endpoint');
    try {
        const getMeUrl = `https://api.telegram.org/bot${token}/getMe`;
        console.log('🔗 URL:', getMeUrl);
        
        const response = await fetch(getMeUrl);
        const data = await response.json();
        
        console.log('📊 RESPONSE STATUS:', response.status);
        console.log('📊 RESPONSE DATA:', data);
        
        if (data.ok) {
            console.log('✅ TOKEN VALID - Bot Info:');
            console.log('  - ID:', data.result.id);
            console.log('  - Username:', data.result.username);
            console.log('  - Name:', data.result.first_name);
            console.log('  - Can send messages:', data.result.can_send_messages !== false);
            
            // Test 2: sendMessage if token is valid
            console.log('\n📤 TEST 2: sendMessage');
            try {
                const sendMessageUrl = `https://api.telegram.org/bot${token}/sendMessage`;
                const messagePayload = {
                    chat_id: "8624852792",
                    text: `✅ Token Test Successful!\n\n🤖 Bot: ${data.result.username}\n🕐 Time: ${new Date().toISOString()}\n🔧 Source: Token Validation Script`
                };
                
                const messageResponse = await fetch(sendMessageUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(messagePayload)
                });
                
                const messageData = await messageResponse.json();
                console.log('📊 MESSAGE RESPONSE STATUS:', messageResponse.status);
                console.log('📊 MESSAGE RESPONSE DATA:', messageData);
                
                if (messageData.ok) {
                    console.log('✅ SEND MESSAGE: SUCCESS');
                    console.log('  - Message ID:', messageData.result.message_id);
                    console.log('  - Chat ID:', messageData.result.chat.id);
                    console.log('🎯 TOKEN IS FULLY WORKING!');
                } else {
                    console.log('❌ SEND MESSAGE: FAILED');
                    console.log('  - Error:', messageData.description);
                    console.log('  - Error Code:', messageData.error_code);
                }
                
            } catch (error) {
                console.error('❌ SEND MESSAGE ERROR:', error);
            }
            
        } else {
            console.log('❌ TOKEN INVALID');
            console.log('  - Error:', data.description);
            console.log('  - Error Code:', data.error_code);
            
            if (data.error_code === 401) {
                console.log('🚨 TOKEN IS DEAD OR REVOKED');
                console.log('📝 SOLUTION: Create new bot from @BotFather');
            }
        }
        
    } catch (error) {
        console.error('❌ getMe ERROR:', error);
    }
    
    console.log('\n🏁 TOKEN TEST COMPLETED');
}

// Auto-run the test
testTelegramToken();
