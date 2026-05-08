// GOOGLE FORMS TRIGGER SETUP INSTRUCTIONS
// Run this in Google Apps Script to ensure onFormSubmit is connected properly

function setupFormTrigger() {
  Logger.log("🔧 SETTING UP FORM TRIGGER");
  
  try {
    // Get the spreadsheet
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log("📊 SPREADSHEET: " + spreadsheet.getName());
    
    // Get the form (if it exists)
    const form = FormApp.openByUrl("https://docs.google.com/forms/d/e/1FAIpQLSfrpv4L0GwMM3zQC8OWKv9-iq8Uz0VwHY-l9TcMJdC9AHY5sQ/viewform");
    Logger.log("📋 FORM: " + form.getTitle());
    
    // Check existing triggers
    const existingTriggers = ScriptApp.getProjectTriggers();
    Logger.log("🔍 EXISTING TRIGGERS:");
    
    let formTriggerExists = false;
    existingTriggers.forEach(trigger => {
      Logger.log("  - Type: " + trigger.getHandlerFunction());
      Logger.log("  - Source: " + trigger.getTriggerSource());
      Logger.log("  - Event: " + trigger.getEventType());
      
      if (trigger.getHandlerFunction() === "onFormSubmit") {
        formTriggerExists = true;
        Logger.log("✅ FORM TRIGGER ALREADY EXISTS");
      }
    });
    
    // Create trigger if it doesn't exist
    if (!formTriggerExists) {
      Logger.log("🔧 CREATING NEW FORM TRIGGER");
      
      const trigger = ScriptApp.newTrigger("onFormSubmit")
        .forForm(form)
        .onFormSubmit()
        .create();
      
      Logger.log("✅ TRIGGER CREATED: " + trigger.getUniqueId());
    }
    
    // Test the trigger
    Logger.log("🧪 TESTING TRIGGER CONNECTION");
    const testResult = testFormConnection();
    Logger.log("📊 TEST RESULT: " + testResult);
    
    Logger.log("✅ FORM TRIGGER SETUP COMPLETED");
    
  } catch(error) {
    Logger.log("❌ TRIGGER SETUP ERROR:");
    Logger.log("ERROR: " + error.toString());
    Logger.log("ERROR TYPE: " + error.constructor.name);
    Logger.log("ERROR STACK: " + error.stack);
  }
}

function testFormConnection() {
  try {
    // Test if we can access the form
    const form = FormApp.openByUrl("https://docs.google.com/forms/d/e/1FAIpQLSfrpv4L0GwMM3zQC8OWKv9-iq8Uz0VwHY-l9TcMJdC9AHY5sQ/viewform");
    const title = form.getTitle();
    const items = form.getItems();
    
    Logger.log("📋 FORM TITLE: " + title);
    Logger.log("📋 FORM ITEMS COUNT: " + items.length);
    
    // Check if required fields exist
    const hasPhone = items.some(item => item.getTitle().includes("الهاتف") || item.getTitle().includes("Phone"));
    const hasAmount = items.some(item => item.getTitle().includes("المبلغ") || item.getTitle().includes("Amount"));
    const hasCurrency = items.some(item => item.getTitle().includes("العملة") || item.getTitle().includes("Currency"));
    const hasNetwork = items.some(item => item.getTitle().includes("الشبكة") || item.getTitle().includes("Network"));
    
    Logger.log("📋 FIELD CHECK:");
    Logger.log("  - Phone field: " + (hasPhone ? "✅ Found" : "❌ Missing"));
    Logger.log("  - Amount field: " + (hasAmount ? "✅ Found" : "❌ Missing"));
    Logger.log("  - Currency field: " + (hasCurrency ? "✅ Found" : "❌ Missing"));
    Logger.log("  - Network field: " + (hasNetwork ? "✅ Found" : "❌ Missing"));
    
    return hasPhone && hasAmount && hasCurrency && hasNetwork ? "SUCCESS" : "MISSING_FIELDS";
    
  } catch(error) {
    Logger.log("❌ FORM CONNECTION ERROR: " + error.toString());
    return "CONNECTION_ERROR";
  }
}

// Function to manually trigger form submission test
function manualFormTest() {
  Logger.log("🧪 MANUAL FORM TEST STARTING");
  
  // Simulate form submission data
  const testEvent = {
    namedValues: {
      "رقم الهاتف": ["0912345678"],
      "المبلغ": ["100"],
      "الإجمالي": ["867.00"],
      "العملة": ["USDT"],
      "الشبكة": ["BEP20"]
    },
    range: {
      getRow: 2,
      getColumn: 1
    },
    source: SpreadsheetApp.getActiveSpreadsheet()
  };
  
  // Call the actual onFormSubmit function
  onFormSubmit(testEvent);
  
  Logger.log("🧪 MANUAL FORM TEST COMPLETED");
}

// Function to check all triggers
function listAllTriggers() {
  Logger.log("🔍 LISTING ALL TRIGGERS");
  
  const triggers = ScriptApp.getProjectTriggers();
  
  if (triggers.length === 0) {
    Logger.log("❌ NO TRIGGERS FOUND");
    return;
  }
  
  triggers.forEach((trigger, index) => {
    Logger.log("🔧 TRIGGER #" + (index + 1) + ":");
    Logger.log("  - ID: " + trigger.getUniqueId());
    Logger.log("  - Function: " + trigger.getHandlerFunction());
    Logger.log("  - Source Type: " + trigger.getTriggerSource());
    Logger.log("  - Event Type: " + trigger.getEventType());
    Logger.log("  - Enabled: " + !trigger.isDisabled());
  });
}

// Function to delete all form triggers (for cleanup)
function deleteFormTriggers() {
  Logger.log("🗑️ DELETING FORM TRIGGERS");
  
  const triggers = ScriptApp.getProjectTriggers();
  let deletedCount = 0;
  
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === "onFormSubmit") {
      ScriptApp.deleteTrigger(trigger);
      deletedCount++;
      Logger.log("🗑️ DELETED TRIGGER: " + trigger.getUniqueId());
    }
  });
  
  Logger.log("✅ DELETED " + deletedCount + " TRIGGERS");
}
