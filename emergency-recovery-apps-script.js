// EMERGENCY RECOVERY - Google Apps Script
// PURPOSE: Restore basic Frontend → Apps Script → Telegram flow
// DISABLED: Email sending, retry logic, advanced cleanup

function doPost(e) {
  Logger.log("🚨 EMERGENCY RECOVERY - doPost STARTED");
  Logger.log("📥 RAW EVENT DATA: " + JSON.stringify(e));
  
  try {
    // Parse JSON from frontend
    const data = JSON.parse(e.postData.contents);
    
    Logger.log("📊 PARSED ORDER DATA:");
    Logger.log("  - operationType: " + data.operationType);
    Logger.log("  - currency: " + data.currency);
    Logger.log("  - amount: " + data.amount);
    Logger.log("  - total: " + (data.total || "NOT_PROVIDED"));
    Logger.log("  - paymentMethod: " + (data.paymentMethod || "NOT_PROVIDED"));
    Logger.log("  - customerPhone: " + data.customerPhone);
    Logger.log("  - walletAddress: " + data.walletAddress);
    Logger.log("  - network: " + data.network);
    Logger.log("  - timestamp: " + (data.timestamp || "NOT_PROVIDED"));
    
    // SIMPLE TELEGRAM TEST MESSAGE FIRST
    sendSimpleTelegramTest();
    
    // After test succeeds, send full order
    sendOrderTelegram(data);
    
    Logger.log("✅ EMERGENCY RECOVERY - doPost COMPLETED");
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Emergency recovery processed successfully",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    Logger.log("❌ EMERGENCY RECOVERY ERROR:");
    Logger.log("ERROR: " + error.toString());
    Logger.log("ERROR_TYPE: " + error.constructor.name);
    Logger.log("ERROR_STACK: " + error.stack);
    Logger.log("EVENT_DATA: " + JSON.stringify(e));
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
      errorType: error.constructor.name,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendSimpleTelegramTest() {
  Logger.log("🧪 SENDING SIMPLE TELEGRAM TEST");
  
  const token = "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
  const chatId = "8624852792";
  const telegramUrl = "https://api.telegram.org/bot" + token + "/sendMessage";
  
  const testMessage = "TEST MESSAGE RECEIVED\n\n🕐 Time: " + new Date().toISOString() + "\n🔧 Source: Emergency Recovery Test";
  
  const payload = {
    chat_id: chatId,
    text: testMessage
  };
  
  try {
    Logger.log("📡 SENDING TEST MESSAGE...");
    Logger.log("URL: " + telegramUrl);
    Logger.log("CHAT_ID: " + chatId);
    Logger.log("MESSAGE: " + testMessage);
    
    const response = UrlFetchApp.fetch(telegramUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log("📊 TEST RESPONSE:");
    Logger.log("  - STATUS_CODE: " + responseCode);
    Logger.log("  - RESPONSE: " + responseText);
    
    if (responseCode === 200) {
      Logger.log("✅ SIMPLE TELEGRAM TEST SUCCESS");
    } else {
      Logger.log("❌ SIMPLE TELEGRAM TEST FAILED");
    }
    
  } catch(error) {
    Logger.log("❌ SIMPLE TELEGRAM TEST ERROR:");
    Logger.log("ERROR: " + error.toString());
    Logger.log("ERROR_TYPE: " + error.constructor.name);
    Logger.log("ERROR_STACK: " + error.stack);
  }
}

function sendOrderTelegram(data) {
  Logger.log("📤 SENDING ORDER TELEGRAM");
  
  const token = "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
  const chatId = "8624852792";
  const telegramUrl = "https://api.telegram.org/bot" + token + "/sendMessage";
  
  // Simple order message (no fancy formatting for emergency recovery)
  const message = "🚀 EMERGENCY ORDER RECEIVED\n\n" +
    "📊 Order Details:\n" +
    "• Operation: " + (data.operationType || "N/A") + "\n" +
    "• Currency: " + (data.currency || "N/A") + "\n" +
    "• Amount: " + (data.amount || "N/A") + "\n" +
    "• Total: " + (data.total || "NOT_PROVIDED") + "\n" +
    "• Payment: " + (data.paymentMethod || "NOT_PROVIDED") + "\n" +
    "• Phone: " + (data.customerPhone || "N/A") + "\n" +
    "• Wallet: " + (data.walletAddress || "N/A") + "\n" +
    "• Network: " + (data.network || "N/A") + "\n" +
    "• Timestamp: " + (data.timestamp || "NOT_PROVIDED") + "\n\n" +
    "🕐 Processed: " + new Date().toISOString() + "\n" +
    "🔧 Source: Emergency Recovery";
  
  const payload = {
    chat_id: chatId,
    text: message
  };
  
  try {
    Logger.log("📡 SENDING ORDER MESSAGE...");
    
    const response = UrlFetchApp.fetch(telegramUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log("📊 ORDER RESPONSE:");
    Logger.log("  - STATUS_CODE: " + responseCode);
    Logger.log("  - RESPONSE: " + responseText);
    
    if (responseCode === 200) {
      Logger.log("✅ ORDER TELEGRAM SUCCESS");
    } else {
      Logger.log("❌ ORDER TELEGRAM FAILED");
    }
    
  } catch(error) {
    Logger.log("❌ ORDER TELEGRAM ERROR:");
    Logger.log("ERROR: " + error.toString());
    Logger.log("ERROR_TYPE: " + error.constructor.name);
    Logger.log("ERROR_STACK: " + error.stack);
  }
}

// Test function for emergency recovery
function testEmergencyRecovery() {
  Logger.log("🧪 TESTING EMERGENCY RECOVERY");
  
  // Simulate frontend POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        operationType: "شراء",
        currency: "USDT",
        amount: "100",
        total: "867.00",
        paymentMethod: "بنك",
        customerPhone: "0912345678",
        walletAddress: "TXYZ123...",
        network: "BEP20"
      })
    }
  };
  
  // Call doPost with mock data
  const result = doPost(mockEvent);
  
  Logger.log("🧪 EMERGENCY RECOVERY TEST COMPLETED");
  Logger.log("RESULT: " + result.getContentText());
  
  return result;
}
