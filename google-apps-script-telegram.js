// GOOGLE APPS SCRIPT - onFormSubmit with Telegram Integration
// Replace your existing onFormSubmit function with this code

function onFormSubmit(e) {
  Logger.log("📋 FORM_SUBMIT");
  
  try {
    // DEBUG: Print ALL available namedValues keys before mapping
    Logger.log("🔍 DEBUG: ALL namedValues keys:");
    const namedValues = e.namedValues;
    const allKeys = Object.keys(namedValues);
    for (let i = 0; i < allKeys.length; i++) {
      const key = allKeys[i];
      const value = namedValues[key];
      Logger.log("  - KEY: '" + key + "' -> " + JSON.stringify(value));
    }
    
    // Extract all form data using namedValues ONLY
    const operationType = namedValues["العملية"]?.[0] || namedValues["Operation"]?.[0] || "";
    const currency = namedValues["العملة"]?.[0] || namedValues["Currency"]?.[0] || "";
    const amount = namedValues["المبلغ"]?.[0] || namedValues["Amount"]?.[0] || "";
    const price = namedValues["السعر"]?.[0] || namedValues["Price"]?.[0] || "";
    const total = namedValues["الإجمالي"]?.[0] || namedValues["Total"]?.[0] || "";
    const paymentMethod = namedValues["طريقة الدفع"]?.[0] || namedValues["Payment Method"]?.[0] || "";
    const phone = namedValues["رقم الهاتف"]?.[0] || namedValues["Phone"]?.[0] || "";
    const walletAddress = namedValues["عنوان المحفظة"]?.[0] || namedValues["Wallet Address"]?.[0] || "";
    const network = namedValues["الشبكة"]?.[0] || namedValues["Network"]?.[0] || "";
    
    Logger.log("📊 EXTRACTED_FORM_DATA:");
    Logger.log("  - OPERATION_TYPE: '" + operationType + "'");
    Logger.log("  - CURRENCY: '" + currency + "'");
    Logger.log("  - AMOUNT: '" + amount + "'");
    Logger.log("  - PRICE: '" + price + "'");
    Logger.log("  - TOTAL: '" + total + "'");
    Logger.log("  - PAYMENT_METHOD: '" + paymentMethod + "'");
    Logger.log("  - PHONE: '" + phone + "'");
    Logger.log("  - WALLET_ADDRESS: '" + walletAddress + "'");
    Logger.log("  - NETWORK: '" + network + "'");
    
    // Send notifications with retry logic
    const telegramResult = sendTelegramWithRetry(operationType, currency, amount, price, total, paymentMethod, phone, walletAddress, network);
    const emailResult = sendEmailWithRetry(operationType, currency, amount, price, total, paymentMethod, phone, walletAddress, network);
    
    Logger.log("📊 NOTIFICATION_RESULTS:");
    Logger.log("  - TELEGRAM: " + (telegramResult ? "SUCCESS" : "FAILED"));
    Logger.log("  - EMAIL: " + (emailResult ? "SUCCESS" : "FAILED"));
    
    Logger.log("✅ FORM_SUBMISSION_COMPLETED");
    
  } catch(error) {
    Logger.log("❌ FORM_SUBMISSION_ERROR:");
    Logger.log("ERROR: " + error.toString());
    Logger.log("ERROR_TYPE: " + error.constructor.name);
    Logger.log("ERROR_STACK: " + error.stack);
    Logger.log("EVENT_DATA: " + JSON.stringify(e));
  }
}

function sendTelegramWithRetry(operationType, currency, amount, price, total, paymentMethod, phone, walletAddress, network) {
  Logger.log("📤 TELEGRAM_START");
  
  const token = "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
  const chatId = "8624852792";
  
  const telegramUrl = "https://api.telegram.org/bot" + token + "/sendMessage";
  
  // Generate random order number
  const randomOrderId = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
  
  // NEW Infinity Company UI Template
  const message = "✨ Infinity Company\n" +
    "📲 WhatsApp: +393895724547\n\n" +
    "🧾 Order #" + randomOrderId + "\n\n" +
    "🚀 طلب جديد\n\n" +
    "━━━━━━━━━━━━━━\n\n" +
    "📊 تفاصيل العملية:\n" +
    "• العملية: " + operationType + "\n" +
    "• العملة: " + currency + "\n" +
    "• المبلغ: " + amount + "\n" +
    "• السعر: " + price + "\n" +
    "• الإجمالي: " + total + "\n" +
    "• طريقة الدفع: " + paymentMethod + "\n\n" +
    "━━━━━━━━━━━━━━\n\n" +
    "📞 رقم الهاتف:\n" +
    phone + "\n\n" +
    "━━━━━━━━━━━━━━\n\n" +
    "👤 بيانات الزبون:\n" +
    "• عنوان المحفظة:\n" +
    walletAddress + "\n\n" +
    "• الشبكة:\n" +
    network + "\n\n" +
    "━━━━━━━━━━━━━━\n\n" +
    "📂 المستندات المطلوبة لإتمام إجراء التحويل\n\n" +
    "🛂 يجب توفير صورة من جواز السفر\n\n" +
    "🏦 يجب توفير صورة من رقم الحساب المصرفي\n\n" +
    "📱 يجب توفير صورة من تطبيق العملة الرقمية لإثبات الملكية للطرف الواحد\n\n" +
    "━━━━━━━━━━━━━━\n\n" +
    "🕐 وقت الطلب: " + new Date().toLocaleString('ar-LY') + "\n" +
    "🔧 المصدر: Google Form Submission";
  
  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML"
  };
  
  // Retry logic - attempt up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      Logger.log("📡 TELEGRAM_ATTEMPT_" + attempt);
      Logger.log("URL: " + telegramUrl);
      Logger.log("CHAT_ID: " + chatId);
      Logger.log("MESSAGE_PREVIEW: " + message.substring(0, 100) + "...");
      
      const response = UrlFetchApp.fetch(telegramUrl, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });
      
      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();
      
      Logger.log("📊 TELEGRAM_RESPONSE_" + attempt + ":");
      Logger.log("  - STATUS_CODE: " + responseCode);
      Logger.log("  - RESPONSE: " + responseText);
      
      if (responseCode === 200) {
        Logger.log("✅ TELEGRAM_SUCCESS");
        
        // Parse response to get message ID
        const responseData = JSON.parse(responseText);
        if (responseData.ok) {
          Logger.log("  - MESSAGE_ID: " + responseData.result.message_id);
          Logger.log("  - CHAT_ID: " + responseData.result.chat.id);
        }
        
        return true; // Success
      } else {
        Logger.log("❌ TELEGRAM_FAILED_ATTEMPT_" + attempt);
        Logger.log("  - ERROR_CODE: " + responseCode);
        
        // Try to parse error details
        try {
          const errorData = JSON.parse(responseText);
          Logger.log("  - ERROR_DESCRIPTION: " + errorData.description);
          Logger.log("  - ERROR_CODE: " + errorData.error_code);
        } catch(parseError) {
          Logger.log("  - RAW_ERROR: " + responseText);
        }
        
        // If last attempt, give up
        if (attempt === 3) {
          Logger.log("🚨 TELEGRAM_ALL_ATTEMPTS_FAILED");
          return false;
        }
        
        // Wait before retry
        Logger.log("⏳ WAITING_BEFORE_RETRY_" + (attempt + 1));
        Utilities.sleep(2000); // Wait 2 seconds
      }
      
    } catch(error) {
      Logger.log("❌ TELEGRAM_ERROR_ATTEMPT_" + attempt + ":");
      Logger.log("ERROR: " + error.toString());
      Logger.log("ERROR_TYPE: " + error.constructor.name);
      Logger.log("ERROR_STACK: " + error.stack);
      
      // Additional error context
      Logger.log("CONTEXT:");
      Logger.log("  - TOKEN_LENGTH: " + token.length);
      Logger.log("  - CHAT_ID: " + chatId);
      Logger.log("  - MESSAGE_LENGTH: " + message.length);
      
      // If last attempt, give up
      if (attempt === 3) {
        Logger.log("🚨 TELEGRAM_ALL_ATTEMPTS_FAILED");
        return false;
      }
      
      // Wait before retry
      Logger.log("⏳ WAITING_BEFORE_RETRY_" + (attempt + 1));
      Utilities.sleep(2000); // Wait 2 seconds
    }
  }
}

function sendEmailWithRetry(operationType, currency, amount, price, total, paymentMethod, phone, walletAddress, network) {
  Logger.log("📧 EMAIL_START");
  
  // Generate random order number
  const randomOrderId = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
  
  // Email configuration
  const emailTo = "Elarenha@gmail.com";
  const emailSubject = "🚀 طلب جديد - Order #" + randomOrderId;
  
  // Create HTML email content with new layout
  const emailHtml = `<div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
    <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #ff6d00; margin-bottom: 20px;">✨ Infinity Company</h2>
      <p style="color: #666; margin-bottom: 20px;">📲 WhatsApp: +393895724547</p>
      
      <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
        <h3 style="color: #2e7d32; margin: 0; font-size: 18px;">🧾 Order #${randomOrderId}</h3>
        <p style="color: #2e7d32; margin: 5px 0 0 0; font-size: 14px;">🚀 طلب جديد</p>
      </div>
      
      <h3 style="color: #333; margin-bottom: 15px; border-bottom: 2px solid #ff6d00; padding-bottom: 5px;">📊 تفاصيل العملية:</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>العملية:</strong> ${operationType}</p>
        <p style="margin: 5px 0;"><strong>العملة:</strong> ${currency}</p>
        <p style="margin: 5px 0;"><strong>المبلغ:</strong> ${amount}</p>
        <p style="margin: 5px 0;"><strong>السعر:</strong> ${price}</p>
        <p style="margin: 5px 0;"><strong>الإجمالي:</strong> ${total}</p>
        <p style="margin: 5px 0;"><strong>طريقة الدفع:</strong> ${paymentMethod}</p>
      </div>
      
      <h3 style="color: #333; margin-bottom: 15px;">📞 رقم الهاتف:</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 16px; font-weight: bold; color: #ff6d00;">${phone}</p>
      </div>
      
      <h3 style="color: #333; margin-bottom: 15px;">👤 بيانات الزبون:</h3>
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 5px 0;"><strong>عنوان المحفظة:</strong><br><span style="font-family: monospace; background: #fff; padding: 5px; border-radius: 3px; display: inline-block;">${walletAddress}</span></p>
        <p style="margin: 5px 0;"><strong>الشبكة:</strong> ${network}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ff6d00;">
        <h3 style="color: #333; margin-bottom: 10px; font-size: 14px;">📂 المستندات المطلوبة لإتمام إجراء التحويل</h3>
        <ul style="margin: 0; padding-right: 20px; color: #666; font-size: 13px;">
          <li style="margin-bottom: 5px;">🛂 يجب توفير صورة من جواز السفر</li>
          <li style="margin-bottom: 5px;">🏦 يجب توفير صورة من رقم الحساب المصرفي</li>
          <li style="margin-bottom: 5px;">📱 يجب توفير صورة من تطبيق العملة الرقمية لإثبات الملكية للطرف الواحد</li>
        </ul>
      </div>
      
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
        🕐 تم الإرسال: ${new Date().toLocaleString('ar-LY')}<br>
        🔧 المصدر: Google Form Submission
      </p>
    </div>
  </div>`;
  
  // Retry logic - attempt up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      Logger.log("📧 EMAIL_ATTEMPT_" + attempt);
      Logger.log("TO: " + emailTo);
      Logger.log("SUBJECT: " + emailSubject);
      
      const mailOptions = {
        to: emailTo,
        subject: emailSubject,
        htmlBody: emailHtml,
        name: "Infinity Company"
      };
      
      MailApp.sendEmail(mailOptions);
      
      Logger.log("✅ EMAIL_SUCCESS_ATTEMPT_" + attempt);
      return true; // Success
      
    } catch(error) {
      Logger.log("❌ EMAIL_ERROR_ATTEMPT_" + attempt + ":");
      Logger.log("ERROR: " + error.toString());
      Logger.log("ERROR_TYPE: " + error.constructor.name);
      Logger.log("ERROR_STACK: " + error.stack);
      
      // Additional error context
      Logger.log("CONTEXT:");
      Logger.log("  - EMAIL_TO: " + emailTo);
      Logger.log("  - SUBJECT: " + emailSubject);
      Logger.log("  - MESSAGE_LENGTH: " + emailHtml.length);
      
      // If last attempt, give up
      if (attempt === 3) {
        Logger.log("🚨 EMAIL_ALL_ATTEMPTS_FAILED");
        return false;
      }
      
      // Wait before retry
      Logger.log("⏳ WAITING_BEFORE_RETRY_" + (attempt + 1));
      Utilities.sleep(2000); // Wait 2 seconds
    }
  }
}

// Test function to verify Telegram integration
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

// Function to handle direct POST requests from frontend
function doPost(e) {
  Logger.log("📥 doPost received from frontend");
  
  try {
    // Parse JSON from frontend
    const orderData = JSON.parse(e.postData.contents);
    
    Logger.log("📊 RECEIVED ORDER DATA:");
    Logger.log("  - OPERATION_TYPE: " + orderData.operationType);
    Logger.log("  - CURRENCY: " + orderData.currency);
    Logger.log("  - AMOUNT: " + orderData.amount);
    Logger.log("  - WALLET_ADDRESS: " + orderData.walletAddress);
    Logger.log("  - NETWORK: " + orderData.network);
    Logger.log("  - CUSTOMER_PHONE: " + orderData.customerPhone);
    
    // Convert to namedValues format for onFormSubmit
    const mockEvent = {
      namedValues: {
        "العملية": [orderData.operationType || ""],
        "العملة": [orderData.currency || ""],
        "المبلغ": [orderData.amount || ""],
        "عنوان المحفظة": [orderData.walletAddress || ""],
        "الشبكة": [orderData.network || ""],
        "رقم الهاتف": [orderData.customerPhone || ""]
      }
    };
    
    // Call existing onFormSubmit with mock event
    const result = onFormSubmit(mockEvent);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Order processed successfully",
      data: orderData
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    Logger.log("❌ doPost ERROR: " + error.toString());
    Logger.log("ERROR_TYPE: " + error.constructor.name);
    Logger.log("ERROR_STACK: " + error.stack);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString(),
      errorType: error.constructor.name
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to update the bot token if needed
function updateTelegramToken(newToken) {
  Logger.log("🔄 UPDATING TELEGRAM TOKEN");
  Logger.log("New Token: " + newToken.substring(0, 10) + "...");
  
  // Store the new token (you might want to use PropertiesService for this)
  PropertiesService.getScriptProperties().setProperty('TELEGRAM_BOT_TOKEN', newToken);
  
  Logger.log("✅ TOKEN UPDATED SUCCESSFULLY");
}

// Function to get current token
function getCurrentTelegramToken() {
  // Try to get from PropertiesService first, fallback to hardcoded
  const token = PropertiesService.getScriptProperties().getProperty('TELEGRAM_BOT_TOKEN') || 
               "8699917719:AAF7dZzAN6pYZMDdGXWvZ36AU9eTTWSCxSE";
  
  Logger.log("🔑 CURRENT TOKEN: " + token.substring(0, 10) + "...");
  return token;
}
