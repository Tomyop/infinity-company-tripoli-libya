// GOOGLE APPS SCRIPT - testNotification Function
// Copy this entire code into Google Apps Script Editor
// Then click "Run" button and approve permissions

function testNotification() {
  Logger.log("TEST START");
  
  // TELEGRAM TEST
  const token = "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
  const chatId = "8624852792";
  
  const telegramUrl = "https://api.telegram.org/bot" + token + "/sendMessage";
  
  const telegramPayload = {
    chat_id: chatId,
    text: "✅ Telegram test successful from Google Apps Script\n\n🕐 Time: " + new Date().toISOString() + "\n🔧 Source: Google Apps Script Test"
  };
  
  try {
    Logger.log("TELEGRAM TEST STARTING...");
    Logger.log("URL: " + telegramUrl);
    Logger.log("PAYLOAD: " + JSON.stringify(telegramPayload));
    
    const telegramResponse = UrlFetchApp.fetch(telegramUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(telegramPayload),
      muteHttpExceptions: true
    });
    
    Logger.log("TELEGRAM STATUS:");
    Logger.log("Response Code: " + telegramResponse.getResponseCode());
    Logger.log("Response Headers: " + JSON.stringify(telegramResponse.getAllHeaders()));
    
    Logger.log("TELEGRAM RESPONSE:");
    Logger.log("Content: " + telegramResponse.getContentText());
    
    const responseCode = telegramResponse.getResponseCode();
    if (responseCode === 200) {
      Logger.log("✅ TELEGRAM: SUCCESS");
    } else {
      Logger.log("❌ TELEGRAM: FAILED - Status Code: " + responseCode);
    }
    
  } catch(error) {
    Logger.log("TELEGRAM ERROR:");
    Logger.log("Error: " + error.toString());
    Logger.log("Error Stack: " + error.stack);
  }
  
  // EMAIL TEST
  try {
    Logger.log("EMAIL TEST STARTING...");
    Logger.log("Sending to: Elarenha@gmail.com");
    
    GmailApp.sendEmail(
      "Elarenha@gmail.com",
      "🧪 Test Email from Google Apps Script",
      "✅ Email notification successful\n\n🕐 Time: " + new Date().toISOString() + "\n🔧 Source: Google Apps Script Test\n\nThis is a test to verify email notifications work independently."
    );
    
    Logger.log("✅ EMAIL: SENT SUCCESSFULLY");
    
  } catch(error) {
    Logger.log("EMAIL ERROR:");
    Logger.log("Error: " + error.toString());
    Logger.log("Error Stack: " + error.stack);
  }
  
  Logger.log("TEST END");
}

// Additional test function for detailed Telegram API check
function testTelegramAPI() {
  Logger.log("TELEGRAM API DETAILED TEST START");
  
  const token = "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
  
  // Test 1: Get bot info
  try {
    const botInfoUrl = "https://api.telegram.org/bot" + token + "/getMe";
    const botInfoResponse = UrlFetchApp.fetch(botInfoUrl, {
      method: "get",
      muteHttpExceptions: true
    });
    
    Logger.log("BOT INFO TEST:");
    Logger.log("Status: " + botInfoResponse.getResponseCode());
    Logger.log("Response: " + botInfoResponse.getContentText());
  } catch(error) {
    Logger.log("BOT INFO ERROR: " + error.toString());
  }
  
  // Test 2: Send message
  try {
    const sendMessageUrl = "https://api.telegram.org/bot" + token + "/sendMessage";
    const payload = {
      chat_id: "8624852792",
      text: "🧪 Detailed Telegram Test\n\n🤖 Bot Token: " + token.substring(0, 10) + "...\n💬 Chat ID: " + "8624852792" + "\n🕐 Time: " + new Date().toISOString()
    };
    
    const response = UrlFetchApp.fetch(sendMessageUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    Logger.log("SEND MESSAGE TEST:");
    Logger.log("Status: " + response.getResponseCode());
    Logger.log("Response: " + response.getContentText());
    
  } catch(error) {
    Logger.log("SEND MESSAGE ERROR: " + error.toString());
  }
  
  Logger.log("TELEGRAM API DETAILED TEST END");
}

// Test function for email configuration
function testEmailConfig() {
  Logger.log("EMAIL CONFIG TEST START");
  
  try {
    // Get current user
    const currentUser = Session.getActiveUser().getEmail();
    Logger.log("Current User: " + currentUser);
    
    // Test sending email with different configurations
    GmailApp.sendEmail(
      "Elarenha@gmail.com",
      "🔧 Email Configuration Test - " + new Date().toISOString(),
      "Email Configuration Test\n\nFrom: " + currentUser + "\nTo: Elarenha@gmail.com\nTime: " + new Date().toISOString() + "\n\nThis test verifies email configuration is working properly."
    );
    
    Logger.log("✅ EMAIL CONFIG TEST: SUCCESS");
    
  } catch(error) {
    Logger.log("❌ EMAIL CONFIG ERROR:");
    Logger.log("Error: " + error.toString());
    Logger.log("Error Name: " + error.name);
    Logger.log("Error Message: " + error.message);
  }
  
  Logger.log("EMAIL CONFIG TEST END");
}
