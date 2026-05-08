import TelegramBot from 'node-telegram-bot-api';

export default async function handler(req, res) {
  // Add comprehensive logging at function start
  console.log('🚀 SEND-TELEGRAM FUNCTION STARTED');
  console.log('🔍 REQUEST METHOD:', req.method);
  console.log('🔍 REQUEST HEADERS:', JSON.stringify(req.headers, null, 2));
  console.log('🔍 REQUEST BODY:', JSON.stringify(req.body, null, 2));
  console.log('🔍 ENVIRONMENT CHECK:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_REGION: process.env.VERCEL_REGION,
    TELEGRAM_TOKEN_EXISTS: !!process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID_EXISTS: !!process.env.TELEGRAM_CHAT_ID
  });
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    console.error('❌ METHOD NOT ALLOWED:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowedMethods: ['POST'],
      receivedMethod: req.method
    });
  }

  // Add CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  console.log('✅ CORS HEADERS SET');

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    console.log('🔍 TELEGRAM CONFIGURATION CHECK:');
    console.log('  - BOT TOKEN EXISTS:', TELEGRAM_TOKEN ? '✅ YES' : '❌ NO');
    console.log('  - CHAT ID EXISTS:', TELEGRAM_CHAT_ID ? '✅ YES' : '❌ NO');
    console.log('  - TOKEN LENGTH:', TELEGRAM_TOKEN ? TELEGRAM_TOKEN.length : 0);
    console.log('  - CHAT ID:', TELEGRAM_CHAT_ID || 'NOT SET');
    console.log('  - NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
    console.log('  - VERCEL_ENV:', process.env.VERCEL_ENV || 'NOT SET');

    if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('❌ Missing Telegram configuration');
      console.error('  - TELEGRAM_BOT_TOKEN:', TELEGRAM_TOKEN ? 'PRESENT' : 'MISSING');
      console.error('  - TELEGRAM_CHAT_ID:', TELEGRAM_CHAT_ID ? 'PRESENT' : 'MISSING');
      return res.status(500).json({ 
        success: false, 
        error: 'Telegram not configured',
        debug: {
          tokenExists: !!TELEGRAM_TOKEN,
          chatIdExists: !!TELEGRAM_CHAT_ID,
          nodeEnv: process.env.NODE_ENV,
          vercelEnv: process.env.VERCEL_ENV
        }
      });
    }

    // Initialize bot
    console.log('🤖 Initializing Telegram bot...');
    const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: false });
    
    console.log('📤 Sending Telegram message:');
    console.log('  - CHAT ID:', TELEGRAM_CHAT_ID);
    console.log('  - MESSAGE LENGTH:', message.length);
    console.log('  - MESSAGE PREVIEW:', message.substring(0, 100) + (message.length > 100 ? '...' : ''));
    
    const result = await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    
    console.log('✅ Telegram message sent successfully');
    console.log(`📨 Message ID: ${result.message_id}`);
    console.log(`🕐 Sent at: ${new Date(result.date * 1000).toISOString()}`);
    console.log(`📊 Response:`, JSON.stringify(result, null, 2));
    
    console.log('📤 SENDING RESPONSE:');
    console.log('  - SUCCESS:', true);
    console.log('  - MESSAGE ID:', result.message_id);
    console.log('  - TIMESTAMP:', new Date(result.date * 1000).toISOString());
    
    res.status(200).json({ 
      success: true, 
      messageId: result.message_id,
      timestamp: new Date(result.date * 1000).toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_ENV: process.env.VERCEL_ENV,
        VERCEL_REGION: process.env.VERCEL_REGION
      }
    });
    console.log('✅ RESPONSE SENT SUCCESSFULLY');

  } catch (error) {
    console.error('❌ CATCH BLOCK - FUNCTION ERROR:');
    console.error('  - ERROR:', error.message);
    console.error('  - ERROR TYPE:', error.constructor.name);
    console.error('  - ERROR STACK:', error.stack);
    console.error('  - REQUEST BODY:', req.body);
    console.error('  - REQUEST METHOD:', req.method);
    console.error('  - ENVIRONMENT:', {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION
    });
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      errorType: error.constructor.name,
      timestamp: new Date().toISOString(),
      debug: {
        stack: error.stack,
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_ENV: process.env.VERCEL_ENV,
          VERCEL_REGION: process.env.VERCEL_REGION
        }
      }
    });
    console.log('❌ ERROR RESPONSE SENT');
  }
}
