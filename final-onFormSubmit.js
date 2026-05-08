// FINAL COMPLETE CODE - Copy this entire code into Google Apps Script
// Replace your existing code completely

function onFormSubmit(e) {
  Logger.log("📋 FORM SUBMISSION STARTED");
  
  try {
    // Extract form data
    const namedValues = e.namedValues;
    Logger.log("📊 FORM DATA RECEIVED:");
    Logger.log(namedValues);
    
    // Get the specific fields (try multiple possible field names)
    const phone = namedValues["رقم الهاتف"] ? namedValues["رقم الهاتف"][0] : 
                 namedValues["Phone"] ? namedValues["Phone"][0] : 
                 namedValues["entry.1487754017"] ? namedValues["entry.1487754017"][0] : "Unknown";
                 
    const amount = namedValues["المبلغ"] ? namedValues["المبلغ"][0] : 
                 namedValues["Amount"] ? namedValues["Amount"][0] : 
                 namedValues["entry.446288420"] ? namedValues["entry.446288420"][0] : "Unknown";
                 
    const total = namedValues["الإجمالي"] ? namedValues["الإجمالي"][0] : 
                namedValues["Total"] ? namedValues["Total"][0] : 
                namedValues["entry.1134418766"] ? namedValues["entry.1134418766"][0] : "Unknown";
                
    const currency = namedValues["العملة"] ? namedValues["العملة"][0] : 
                  namedValues["Currency"] ? namedValues["Currency"][0] : 
                  namedValues["entry.1134418767"] ? namedValues["entry.1134418767"][0] : "Unknown";
                  
    const network = namedValues["الشبكة"] ? namedValues["الشبكة"][0] : 
                 namedValues["Network"] ? namedValues["Network"][0] : 
                 namedValues["entry.1134418768"] ? namedValues["entry.1134418768"][0] : "Unknown";
    
    Logger.log("📤 EXTRACTED DATA:");
    Logger.log("  - Phone: " + phone);
    Logger.log("  - Amount: " + amount);
    Logger.log("  - Total: " + total);
    Logger.log("  - Currency: " + currency);
    Logger.log("  - Network: " + network);
    
    // Send Telegram notification
    sendTelegramNotification(phone, amount, total, currency, network);
    
    Logger.log("✅ FORM SUBMISSION COMPLETED SUCCESSFULLY");
    
  } catch(error) {
    Logger.log("❌ FORM SUBMISSION ERROR:");
    Logger.log("Error: " + error.toString());
    Logger.log("Error Stack: " + error.stack);
    Logger.log("Event Data: " + JSON.stringify(e));
  }
}

function sendTelegramNotification(phone, amount, total, currency, network) {
  Logger.log("📤 SENDING TELEGRAM NOTIFICATION");
  
  const token = "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
  const chatId = "8624852792";
  
  const telegramUrl = "https://api.telegram.org/bot" + token + "/sendMessage";
  
  // Create message with order details
  const message = "🚀 طلب جديد من Google Form\n\n" +
    "📊 تفاصيل الطلب:\n" +
    "• 📞 رقم الهاتف: " + phone + "\n" +
    "• 💰 المبلغ: " + amount + " " + currency + "\n" +
    "• 💳 الإجمالي: " + total + " د.ل\n" +
    "• 🌐 الشبكة: " + network + "\n\n" +
    "🕐 وقت الطلب: " + new Date().toLocaleString('ar-LY') + "\n" +
    "🔧 المصدر: Google Form Submission";
  
  const payload = {
    chat_id: chatId,
    text: message
  };
  
  try {
    Logger.log("📡 SENDING TO TELEGRAM...");
    Logger.log("URL: " + telegramUrl);
    Logger.log("CHAT ID: " + chatId);
    Logger.log("MESSAGE PREVIEW: " + message.substring(0, 100) + "...");
    
    const response = UrlFetchApp.fetch(telegramUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log("📊 TELEGRAM RESPONSE:");
    Logger.log("  - Status Code: " + responseCode);
    Logger.log("  - Response: " + responseText);
    
    if (responseCode === 200) {
      Logger.log("✅ TELEGRAM NOTIFICATION SENT SUCCESSFULLY");
      
      // Parse response to get message ID
      const responseData = JSON.parse(responseText);
      if (responseData.ok) {
        Logger.log("  - Message ID: " + responseData.result.message_id);
        Logger.log("  - Chat ID: " + responseData.result.chat.id);
      }
    } else {
      Logger.log("❌ TELEGRAM NOTIFICATION FAILED");
      Logger.log("  - Error Code: " + responseCode);
      
      // Try to parse error details
      try {
        const errorData = JSON.parse(responseText);
        Logger.log("  - Error Description: " + errorData.description);
        Logger.log("  - Error Code: " + errorData.error_code);
      } catch(parseError) {
        Logger.log("  - Raw Error Response: " + responseText);
      }
    }
    
  } catch(error) {
    Logger.log("❌ TELEGRAM SEND ERROR:");
    Logger.log("Error: " + error.toString());
    Logger.log("Error Type: " + error.constructor.name);
    Logger.log("Error Stack: " + error.stack);
    
    // Additional error context
    Logger.log("CONTEXT:");
    Logger.log("  - Token Length: " + token.length);
    Logger.log("  - Chat ID: " + chatId);
    Logger.log("  - Message Length: " + message.length);
  }
}

// Test function - run this to test the integration
function testTelegramFromForm() {
  Logger.log("🧪 TESTING TELEGRAM FROM FORM FUNCTION");
  
  // Simulate form submission data
  const testEvent = {
    namedValues: {
      "رقم الهاتف": ["0912345678"],
      "المبلغ": ["100"],
      "الإجمالي": ["867.00"],
      "العملة": ["USDT"],
      "الشبكة": ["BEP20"]
    }
  };
  
  // Call the actual function
  onFormSubmit(testEvent);
  
  Logger.log("🧪 TEST COMPLETED");
}
