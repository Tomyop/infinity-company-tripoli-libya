// ENVIRONMENT VARIABLES AND PERMISSIONS CHECK
// Run this script to verify all required configurations

console.log('🔍 ENVIRONMENT VARIABLES CHECK');

// Check frontend environment variables
console.log('📱 FRONTEND ENVIRONMENT:');
console.log('  - NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('  - VERCEL_ENV:', process.env.VERCEL_ENV || 'NOT SET');
console.log('  - VERCEL_REGION:', process.env.VERCEL_ENV || 'NOT SET');

// Check backend environment variables (API functions)
console.log('🔧 BACKEND ENVIRONMENT:');
console.log('  - TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? 'SET' : 'MISSING');
console.log('  - TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID ? 'SET' : 'MISSING');
console.log('  - EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'MISSING');
console.log('  - EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'MISSING');

// Check Google Apps Script permissions
console.log('📜 GOOGLE APPS SCRIPT PERMISSIONS:');
try {
  // Test MailApp access
  MailApp.getAliases();
  console.log('  - MailApp: ✅ ACCESSIBLE');
} catch (error) {
  console.log('  - MailApp: ❌ NO ACCESS -', error.message);
}

try {
  // Test GmailApp access
  GmailApp.getAliases();
  console.log('  - GmailApp: ✅ ACCESSIBLE');
} catch (error) {
  console.log('  - GmailApp: ❌ NO ACCESS -', error.message);
}

try {
  // Test UrlFetchApp access
  UrlFetchApp.fetch('https://httpbin.org/get', { muteHttpExceptions: true });
  console.log('  - UrlFetchApp: ✅ ACCESSIBLE');
} catch (error) {
  console.log('  - UrlFetchApp: ❌ NO ACCESS -', error.message);
}

// Test Telegram API connectivity
console.log('📡 TELEGRAM API CONNECTIVITY:');
try {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (token && chatId) {
    const telegramUrl = `https://api.telegram.org/bot${token}/getMe`;
    const response = UrlFetchApp.fetch(telegramUrl, { muteHttpExceptions: true });
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log('  - getMe API Status:', responseCode);
    console.log('  - getMe API Response:', responseText);
    
    if (responseCode === 200) {
      const botData = JSON.parse(responseText);
      console.log('  - Bot Name:', botData.result.first_name);
      console.log('  - Bot Username:', botData.result.username);
      console.log('  - Bot Can Send Messages:', botData.result.can_send_messages ? '✅ YES' : '❌ NO');
    } else {
      console.log('  - ❌ TELEGRAM API CONNECTION FAILED');
    }
  } else {
    console.log('  - ❌ TELEGRAM TOKEN OR CHAT ID MISSING');
  }
} catch (error) {
  console.log('  - ❌ TELEGRAM API TEST ERROR:', error.message);
}

// Check Google Form connectivity
console.log('📋 GOOGLE FORM CONNECTIVITY:');
try {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSfrpv4L0GwMM3zQC8OWKv9-iq8Uz0VwHY-l9TcMJdC9AHY5sQ/formResponse';
  const response = UrlFetchApp.fetch(formUrl, { muteHttpExceptions: true });
  const responseCode = response.getResponseCode();
  
  console.log('  - Form URL Status:', responseCode);
  console.log('  - Form URL:', formUrl);
  
  if (responseCode === 200) {
    console.log('  - ✅ GOOGLE FORM ACCESSIBLE');
  } else {
    console.log('  - ❌ GOOGLE FORM CONNECTION FAILED');
  }
} catch (error) {
  console.log('  - ❌ GOOGLE FORM TEST ERROR:', error.message);
}

console.log('✅ ENVIRONMENT CHECK COMPLETED');
console.log('');
console.log('📋 SUMMARY:');
console.log('1. Frontend: Check NODE_ENV, VERCEL_ENV');
console.log('2. Backend: Verify TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, EMAIL_USER, EMAIL_PASS');
console.log('3. Google Apps Script: Verify MailApp, GmailApp, UrlFetchApp permissions');
console.log('4. Telegram API: Test bot connectivity and permissions');
console.log('5. Google Form: Test form accessibility');
console.log('');
console.log('🔧 ACTIONS NEEDED:');
console.log('- Set missing environment variables in Vercel dashboard');
console.log('- Authorize Google Apps Script for MailApp/GmailApp access');
console.log('- Verify Telegram bot token validity');
console.log('- Test Google Form trigger connection');
