import { useState, useEffect, useRef } from 'react'
import './index.css'
import confirmImg from './assets/10.jpg'
import usdtOfficialLogo from './assets/usdt-official-logo.png'
import buyIcon from './assets/buy-icon.png'
import sellIcon from './assets/sell-icon.png'
import img1 from './assets/images/1.png';
import img2 from './assets/images/2.png';
import img5 from './assets/images/5.png';
import btcIcon from './assets/Btc.png';
import eurIcon from './assets/euro.png';
import usdIcon from './assets/usd.png';
import AdBanner from './AdBanner'
import InstallPrompt from './InstallPrompt'
import Draw from './Draw'

function ProcessingCard() {
  const [timeLeft, setTimeLeft] = React.useState(600);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = (timeLeft / 600) * 100;

  return (
    <div style={{
      marginTop: 20,
      padding: 20,
      borderRadius: 20,
      background: "linear-gradient(135deg, #1e1e1e, #2c2c2c)",
      color: "#fff",
      textAlign: "center"
    }}>
      <h2 style={{ color: "#ffa726" }}>جاري التنفيذ ⏳</h2>

      <p style={{ color: "#aaa" }}>الوقت المتبقي</p>

      <h1 style={{ fontSize: 36, fontWeight: "bold" }}>
        {minutes}:{seconds}
      </h1>

      <div style={{
        height: 6,
        background: "#444",
        borderRadius: 10,
        overflow: "hidden",
        margin: "15px 0"
      }}>
        <div style={{
          height: "100%",
          width: progress + "%",
          background: "#ff6d00",
          transition: "width 1s linear"
        }} />
      </div>

      <p style={{ color: "#ccc" }}>
        يتم الآن معالجة طلبك، يرجى الانتظار
      </p>

      {timeLeft === 0 && (
        <h3 style={{ color: "#4caf50", marginTop: 15 }}>
          تم التنفيذ ✅
        </h3>
      )}
    </div>
  );
}

// Fixed data
const bankData = {
  bank: "مصرف الجمهورية",
  branch: "وكالة البرج",
  account: "104202000002722",
  iban: "LY24007039039011370298010"
};

const walletData = {
  address: "0xf486b33c719ab4d99742f84e5a94d91589403855",
  network: "BEP20"
};

const prices = {
  buy: {
    bank: 12,
    cash: 11
  },
  sell: {
    bank: 10,
    cash: 9
  }
};

function App() {
  const vibrate = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(30);
    }
  };

  const currencyIcons = {
    EUR: "€",
    USD: "$",
    USDT: "T"
  };

  function getCurrencyIcon(currency){
    return currencyIcons[currency] || currency;
  }

  const [operation, setOperation] = useState('buy');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [currency, setCurrency] = useState('usdt');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState({});
  const [imageSelected, setImageSelected] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [currentPaymentSlide, setCurrentPaymentSlide] = useState(0);
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [showConfirmImage, setShowConfirmImage] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [showDraw, setShowDraw] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showPriceNotification, setShowPriceNotification] = useState(true);
  const [showWalletTooltip, setShowWalletTooltip] = useState(false);
  const [tooltipTimer, setTooltipTimer] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState('BEP20');
  const [btcPrice, setBtcPrice] = useState(null);

  const validateNetwork = (network) => {
    const allowedNetworks = ['TRC20', 'ERC20', 'BEP20'];
    return allowedNetworks.includes(network);
  };
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [paymentTermsAccepted, setPaymentTermsAccepted] = useState(false);
  const [showPaymentTermsModal, setShowPaymentTermsModal] = useState(false);
  const [prices, setPrices] = useState({
    buy_cash: 11,
    buy_bank: 12,
    sell_cash: 9,
    sell_bank: 10,
    fee: 0.02
  });

  // User form data
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    walletAddress: '',
    bankAccount: '',
    iban: '',
    transferDate: '',
    transferTime: ''
  });


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNetworkDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'HIDE_DRAW') {
        setShowDraw(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPriceNotification(true);
      setTimeout(() => {
        setShowPriceNotification(false);
      }, 3000);
    }, 6000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const paymentImages = [img1, img2, img5];
    const interval = setInterval(() => {
      setCurrentPaymentSlide((prev) => (prev + 1) % paymentImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSy4Evf9vffihdOQ6rNWSaIstjIl02IZNnXlDeMcvAo4KhqdqzxRl_aThwjcKwZ71S99WZ4We-ueM3-/pub?gid=2014693807&single=true&output=csv&t=' + Date.now(), { cache: "no-store" });
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());
        
        const prices = {}
        
        // Skip first header row, process each data row
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          const [key, value] = row.split(',')
          if (key && value) {
            prices[key.trim()] = Number(value.trim())
          }
        }
        
        console.log("PRICES:", prices)
        
        setPrices({
          // USDT prices (original)
          buy_cash: prices.buy_cash || 11,
          buy_bank: prices.buy_bank || 12,
          sell_cash: prices.sell_cash || 9,
          sell_bank: prices.sell_bank || 10,
          // USD prices
          usd_buy_cash: prices.usd_buy_cash || 5.1,
          usd_buy_bank: prices.usd_buy_bank || 5.2,
          usd_sell_cash: prices.usd_sell_cash || 4.9,
          usd_sell_bank: prices.usd_sell_bank || 5.0,
          // EUR prices
          eur_buy_cash: prices.eur_buy_cash || 5.5,
          eur_buy_bank: prices.eur_buy_bank || 5.6,
          eur_sell_cash: prices.eur_sell_cash || 5.3,
          eur_sell_bank: prices.eur_sell_bank || 5.4,
          // Fee
          fee: prices.fee || 0.02
        });
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-D101BHEN153', { page_path: window.location.pathname });
    }
  }, []);

  useEffect(() => {
    let time = 600;

    const interval = setInterval(() => {
      time--;

      const minutes = String(Math.floor(time / 60)).padStart(2, "0");
      const seconds = String(time % 60).padStart(2, "0");

      const timerEl = document.getElementById("timer");
      const progressEl = document.getElementById("progress");

      if (timerEl) timerEl.innerText = `${minutes}:${seconds}`;
      if (progressEl) progressEl.style.width = (time / 600 * 100) + "%";

      if (time <= 0) {
        clearInterval(interval);
        if (timerEl) timerEl.innerText = "تم التنفيذ ✅";
      }

    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchBTCPrice();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBTCPrice();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text, field) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // modern way
        navigator.clipboard.writeText(text);
      } else {
        // fallback for mobile
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1200);

    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const getCurrentPrice = () => {
    const currencyPrefix = currency === 'usdt' ? '' : `${currency}_`;
    const paymentSuffix = paymentMethod === 'bank' ? 'bank' : 'cash';
    const operationPrefix = operation === 'buy' ? 'buy' : 'sell';
    
    const priceKey = `${currencyPrefix}${operationPrefix}_${paymentSuffix}`;
    return prices[priceKey] || 0;
  };

  const calculateTotal = () => {
    if (!amount) return 0;
    
    if (currency === 'btc') {
      if (!btcPrice) return 0;
      const amountValue = parseFloat(amount) || 0;
      const price = parseFloat(btcPrice) || 0;
      
      console.log("BTC price:", price);
      console.log("BTC amount:", amountValue);
      
      const total = price * amountValue;
      const finalPrice = total * 1.02;
      
      console.log("BTC final:", finalPrice);
      
      return finalPrice;
    }
    
    const price = getCurrentPrice();
    const subtotal = parseFloat(amount) * price;
    const commission = subtotal * prices.fee;
    return subtotal + commission;
  };

  function sendToGoogleSheet(phone, amount, total, currency, network) {
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfrpv4L0GwMM3zQC8OWKv9-iq8Uz0VwHY-l9TcMJdC9AHY5sQ/formResponse";

    const formData = new FormData();
    formData.append("entry.1487754017", phone);
    formData.append("entry.446288420", amount);
    formData.append("entry.1134418766", total);
    formData.append("entry.1134418767", currency.toUpperCase());
    formData.append("entry.1134418768", network);

    fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });
  }

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageSelected(true);
    }
  };

  const fetchBTCPrice = async () => {
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const data = await res.json();
    
    console.log("API DATA:", data);
    
    const price = parseFloat(data.price);
    
    console.log("PRICE:", price);
    
    setBtcPrice(price);
  } catch (error) {
    console.error("ERROR:", error);
  }
};

  const sendTelegramNotification = () => {
    try {
      fetch('https://api.telegram.org/bot8699917719:AAGF7CMMjsHtBK-ISlbCHbs3PRTGHq2Im70/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          chat_id: '8624852792',
          text: '🔔 Infinity Support: New Payment Confirmed'
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Telegram notification sent successfully:', data);
      })
      .catch(error => {
        console.error('Telegram notification failed:', error);
      });
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  };

  const handleConfirm = () => {
    setConfirming(true);
    
    
    // Prepare WhatsApp message based on currency and operation
    let message = `🚀 طلب جديد

📊 تفاصيل العملية:
• العملية: ${operation === 'buy' ? 'شراء' : 'بيع'}
• العملة: ${currency.toUpperCase()}
• المبلغ: ${amount} ${currency.toUpperCase()}
• السعر: ${getCurrentPrice()} د.ل
• الإجمالي: ${calculateTotal().toFixed(2)} د.ل`;

    if (operation === 'buy' && currency !== 'usdt') {
      message += `
• طريقة الدفع: تحويل بنكي
• التاريخ: ${formData.transferDate}
• الوقت: ${formData.transferTime}

📞 رقم الهاتف:
${formData.phone}

👤 بيانات الزبون:
• الاسم بالكامل: ${formData.fullName}

🏦 بياناتنا:
• البنك: مصرف الجمهورية
• الفرع: وكالة البرج
• رقم الحساب: ${bankData.account}
• الآيبان: ${bankData.iban}

✅ لقد قمت بالتحويل`;
    } else if (operation === 'sell' && currency !== 'usdt') {
      message += `

📞 رقم الهاتف:
${formData.phone}

👤 بيانات الزبون:
• الاسم بالكامل: ${formData.fullName}
• الوقت: ${formData.transferTime}

📍 ملاحظة:
يرجى الحضور إلى المكتب لإتمام عملية البيع`;
    } else {
      // USDT logic (original)
      message += `
• طريقة الدفع: ${paymentMethod}

📞 رقم الهاتف:
${formData.phone}

👤 بيانات الزبون:
• عنوان المحفظة: ${formData.walletAddress || walletData.address}
• الشبكة: ${selectedNetwork}

🏦 بياناتنا:
• البنك: مصرف الجمهورية
• الفرع: وكالة البرج
• رقم الحساب: ${bankData.account}
• الآيبان: ${bankData.iban}

💼 محفظتنا:
• العنوان: ${walletData.address}
• الشبكة: ${selectedNetwork}`;
    }

    // Send Telegram notification with full order details
    try {
      fetch('https://api.telegram.org/bot8699917719:AAGF7CMMjsHtBK-ISlbCHbs3PRTGHq2Im70/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          chat_id: '8624852792',
          text: message
        })
      }).catch(() => {});
    } catch (error) {
      // Silent fail - don't interrupt payment flow
    }

    setShowConfirmImage(true);

    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
      
      // Submit to Google Form
      sendToGoogleSheet(formData.phone, amount, calculateTotal().toFixed(2), currency, selectedNetwork);
      
      // Store WhatsApp URL for manual button
      const url = `https://wa.me/393895724547?text=${encodeURIComponent(message)}`;
      setWhatsappUrl(url);
    }, 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F7FB' }}
      onClick={(e) => {
        if (e.target.tagName !== "INPUT") {
          document.activeElement.blur();
        }
      }}
      onTouchMove={() => {
        document.activeElement.blur();
      }}
    >
      
      {/* Draw Page */}
      {showDraw ? (
        <Draw />
      ) : (
        <div id="app">
      <InstallPrompt />
      {showConfirmImage && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          {/* Success Message */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            animation: "fadeInScale 0.5s ease-out"
          }}>
            <div style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#10B981",
              marginBottom: "10px"
            }}>
              ✅ تم تسجيل طلبك بنجاح
            </div>
            <div>
              <h2 style={{color: "#ffa726"}}>جاري التنفيذ ⏳</h2>
              <p style={{color: "#aaa"}}>الوقت المتبقي</p>
              <h1 id="timer" style={{fontSize: "36px"}}>30:00</h1>

              <div style={{
                height: "6px",
                background: "#444",
                borderRadius: "10px",
                overflow: "hidden",
                margin: "15px 0"
              }}>
                <div id="progress" style={{
                  height: "100%",
                  width: "100%",
                  background: "#ff6d00"
                }}></div>
              </div>

              <p style={{color: "#ccc"}}>
                يتم الآن معالجة طلبك، يرجى الانتظار
              </p>
            </div>
            
            {/* Image - Moved to Bottom */}
            <img 
              src={confirmImg}
              alt="Confirmed"
              style={{
                width: "100%",
                maxWidth: "320px",
                borderRadius: "16px",
                marginTop: "25px"
              }}
            />
          </div>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#1F2937",
            borderRadius: "16px",
            padding: "32px",
            margin: "20px",
            maxWidth: "400px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
            textAlign: "right",
            direction: "rtl",
            animation: "fadeInScale 0.3s ease-out"
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "16px"
            }}>
              الشروط والأحكام (Terms & Conditions)
            </h2>
            <div style={{
              fontSize: "14px",
              color: "#D1D5DB",
              lineHeight: "1.6",
              marginBottom: "24px"
            }}>
              <p><strong>1) طبيعة الخدمة</strong><br/>تطبيق Infinity يقدّم خدمة رقمية لعرض الأسعار وتنفيذ طلبات شراء أصول رقمية/عملات عند الطلب. التطبيق ليس بنكًا ولا مؤسسة مالية.</p>
              
              <p><strong>2) إنشاء الطلب</strong><br/>- يختار المستخدم المبلغ وينشئ طلبًا.<br/>- تظهر له بيانات التحويل (رقم الحساب واسم المستفيد).</p>
              
              <p><strong>3) السعر</strong><br/>- السعر يتغير حسب السوق.<br/>- السعر المعروض وقت الطلب هو المعتمد.<br/>- تأكيد الطلب = موافقة على السعر.</p>
              
              <p><strong>4) التحويل</strong><br/>- المستخدم يحوّل المبلغ إلى الحساب المبيّن.<br/>- المستخدم مسؤول عن صحة البيانات والمبلغ.<br/>- يُفضّل أن يكون التحويل من حساب المستخدم نفسه.</p>
              
              <p><strong>5) التحقق</strong><br/>- التنفيذ يتم بعد التأكد من وصول المبلغ ومطابقته.<br/>- يحق طلب إثبات (صورة إيصال) عند الحاجة.</p>
              
              <p><strong>6) التنفيذ</strong><br/>- بعد التحقق، يتم تحويل الأصل/العملة الرقمية إلى العنوان الذي يحدده المستخدم.<br/>- وقت التنفيذ يعتمد على البنك/الشبكة.<br/>- لا يتحمّل التطبيق تأخير الجهات الخارجية.</p>
              
              <p><strong>7) الفاتورة</strong><br/>- يتم إصدار فاتورة إلكترونية لكل عملية بين التطبيق والمستخدم.<br/>- الفاتورة تمثل إثبات العملية المتفق عليها.</p>
              
              <p><strong>8) الإلغاء والاسترجاع</strong><br/>- لا يمكن الإلغاء بعد التحويل.<br/>- في حال خطأ، تتم المراجعة حسب البيانات المتوفرة.<br/>- الاسترجاع (إن وُجد) يكون حسب تقدير الإدارة.</p>
              
              <p><strong>9) مكافحة الاحتيال</strong><br/>- يحق رفض أي عملية مشبوهة أو إيقاف الحساب.<br/>- يتم تسجيل بيانات العملية لأغراض الأمان.</p>
              
              <p><strong>10) حدود الاستخدام</strong><br/>- قد تُفرض حدود على عدد/قيمة العمليات لحماية النظام.</p>
              
              <p><strong>11) المسؤولية</strong><br/>- التطبيق يوفّر تنفيذ الطلبات فقط، ولا يحتفظ بأرصدة (لا توجد محفظة داخل التطبيق).<br/>- المستخدم مسؤول عن التزامه بالقوانين المحلية.</p>
              
              <p><strong>12) التعديلات</strong><br/>- يمكن تعديل هذه الشروط في أي وقت.<br/>- استمرار الاستخدام يعني الموافقة.</p>
              
              <p><strong>13) التواصل</strong><br/>واتساب/هاتف: 00393895724547</p>
              
              <p>باستخدامك للتطبيق، فإنك توافق على هذه الشروط.</p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              style={{
                backgroundColor: "#9333EA",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                width: "100%"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#7C3AED";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#9333EA";
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#1F2937",
            borderRadius: "16px",
            padding: "32px",
            margin: "20px",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            animation: "fadeInScale 0.3s ease-out"
          }}>
            <div style={{
              fontSize: "48px",
              marginBottom: "16px"
            }}>
              {"\ud83d\udd10"}
            </div>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "16px"
            }}>
              Privacy Policy
            </h2>
            <p style={{
              fontSize: "16px",
              color: "#D1D5DB",
              lineHeight: "1.6",
              marginBottom: "24px",
              textAlign: "right",
              direction: "rtl"
            }}>
              نحترم خصوصيتك  
يتم تحديث الأسعار حسب الأسواق  
لا يتم تنفيذ أي عملية إلا بعد التحقق من إيصال التحويل وربطه برقم العملية داخل التطبيق  
نستخدم البيانات فقط لتأمين العمليات ومنع الاحتيال.
            </p>
            <button
              onClick={() => setShowPrivacyModal(false)}
              style={{
                backgroundColor: "#9333EA",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                width: "100%"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#7C3AED";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#9333EA";
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Payment Terms Modal */}
      {showPaymentTermsModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#1F2937",
            borderRadius: "16px",
            padding: "32px",
            margin: "20px",
            maxWidth: "400px",
            width: "100%",
            maxHeight: "80vh",
            overflowY: "auto",
            textAlign: "right",
            direction: "rtl",
            animation: "fadeInScale 0.3s ease-out"
          }}>
            <h2 style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
              marginBottom: "16px"
            }}>
              ⚠️ شروط الدفع:
            </h2>
            
            <div style={{
              fontSize: "14px",
              color: "#D1D5DB",
              lineHeight: "1.6",
              marginBottom: "16px"
            }}>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>يجب أن يكون الحساب البنكي المستخدم في التحويل هو نفسه لصاحب الطلب.</li>
                <li style={{ marginBottom: '8px' }}>يجب أن تكون المحفظة الرقمية المستلمة مملوكة لنفس الشخص.</li>
                <li style={{ marginBottom: '8px' }}>يُمنع منعاً باتاً التحويل من طرف ثالث.</li>
              </ul>
            </div>

            <div style={{
              background: 'rgba(217, 119, 6, 0.1)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '16px',
              border: '1px solid rgba(217, 119, 6, 0.3)'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#d97706',
                marginBottom: '8px',
                textAlign: 'center'
              }}>
                📹 التحقق الإجباري:
              </div>
              <div style={{
                fontSize: '13px',
                color: '#D1D5DB',
                lineHeight: '1.5'
              }}>
                يجب إرسال فيديو حديث (10–15 ثانية) يتضمن:
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
                  <li>ظهور الوجه بوضوح</li>
                  <li>ذكر الاسم الكامل</li>
                  <li>ذكر التاريخ والوقت الحالي</li>
                  <li>ذكر قيمة المبلغ</li>
                  <li>ذكر رقم الطلب</li>
                  <li>ذكر آخر 4 أرقام من الحساب البنكي المستخدم</li>
                  <li>تأكيد أنك صاحب الحساب البنكي والمحفظة</li>
                </ul>
              </div>
            </div>

            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#dc2626',
              textAlign: 'center',
              marginBottom: '16px',
              padding: '8px',
              background: 'rgba(220, 38, 38, 0.1)',
              borderRadius: '8px'
            }}>
              ❗ لن يتم إعطاء بيانات الدفع أو تنفيذ العملية بدون هذا الفيديو.
            </div>

            <div style={{
              fontSize: '12px',
              color: '#D1D5DB',
              lineHeight: '1.4',
              textAlign: 'center',
              padding: '10px',
              background: 'rgba(146, 64, 14, 0.05)',
              borderRadius: '8px',
              border: '1px solid rgba(146, 64, 14, 0.2)',
              marginBottom: '24px'
            }}>
              ⚖️ إخلاء مسؤولية:<br/>
              بإتمام عملية التحويل، أقرّ بأنني صاحب الحساب البنكي والمحفظة الرقمية، وأتحمل كامل المسؤولية في حال مخالفة هذه الشروط، ولا أحق لي المطالبة بأي تعويض.
            </div>

            <button
              onClick={() => {
                setShowPaymentTermsModal(false);
                setPaymentTermsAccepted(true);
              }}
              style={{
                backgroundColor: "#9333EA",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease",
                width: "100%"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#7C3AED";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#9333EA";
              }}
            >
              أوافق
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-mobile mx-auto px-4 py-6 pb-20">
        {/* Ad Banner */}
        <AdBanner />
        
        {/* Operation Selection */}
        <div className="mb-6" style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '16px', textAlign: 'right' }}>اختر العملية</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                vibrate();
                setOperation('sell');
              }}
              style={{
                backgroundColor: operation === 'sell' ? 'rgba(108, 62, 255, 0.1)' : '#FFFFFF',
                border: operation === 'sell' ? '2px solid #6C3EFF' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: operation === 'sell' ? '0px 8px 20px rgba(108, 62, 255, 0.15)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '20px 16px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: operation === 'sell' ? '#6C3EFF' : 'rgba(108, 62, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={operation === 'sell' ? '#FFFFFF' : '#6C3EFF'}>
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: operation === 'sell' ? '#6C3EFF' : '#1A1A1A', display: 'block', marginBottom: '2px' }}>بيع</span>
                  <span style={{ fontSize: '12px', color: operation === 'sell' ? '#6C3EFF' : '#6B7280' }}>SELL</span>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                vibrate();
                setOperation('buy');
              }}
              style={{
                backgroundColor: operation === 'buy' ? '#00C853' : '#FFFFFF',
                border: operation === 'buy' ? '2px solid #00C853' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: operation === 'buy' ? '0px 8px 20px rgba(0, 200, 83, 0.15)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '20px 16px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: operation === 'buy' ? '#FFFFFF' : 'rgba(0, 200, 83, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill={operation === 'buy' ? '#00C853' : '#00C853'}>
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: operation === 'buy' ? '#FFFFFF' : '#1A1A1A', display: 'block', marginBottom: '2px' }}>شراء</span>
                  <span style={{ fontSize: '12px', color: operation === 'buy' ? '#FFFFFF' : '#6B7280' }}>BUY</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="mb-6" style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A' }}>العملة</h3>
            {showPriceNotification && (
              <span 
                className="text-xs font-medium"
                style={{
                  background: 'none',
                  boxShadow: 'none',
                  color: '#000',
                  padding: '0',
                  animation: 'fadeInScale 0.4s ease-in-out',
                  transition: 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out'
                }}
              >
                تم تحديث الأسعار حسب السوق 🔥 
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            <button
              onClick={() => {
                vibrate();
                setCurrency('usdt');
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: currency === 'usdt' ? '2px solid #6C3EFF' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: currency === 'usdt' ? '0px 8px 20px rgba(108, 62, 255, 0.15), 0 0 30px rgba(108, 62, 255, 0.4)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '16px 12px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="currency-icon">
                  <img 
                    src={usdtOfficialLogo} 
                    alt="USDT" 
                    width="24" 
                    height="24" 
                    style={{ borderRadius: '50%' }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '2px' }}>USDT</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Tether</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                vibrate();
                setCurrency('usd');
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: currency === 'usd' ? '2px solid #6C3EFF' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: currency === 'usd' ? '0px 8px 20px rgba(108, 62, 255, 0.15), 0 0 20px rgba(108, 62, 255, 0.3)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '16px 12px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="currency-icon currency-usd">
                  <img src={usdIcon} alt="USD" className="currency-img" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '2px' }}>USD</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>US Dollar</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                vibrate();
                setCurrency('eur');
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: currency === 'eur' ? '2px solid #6C3EFF' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: currency === 'eur' ? '0px 8px 20px rgba(108, 62, 255, 0.15), 0 0 20px rgba(108, 62, 255, 0.3)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '16px 12px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="currency-icon">
                  <img src={eurIcon} alt="EUR" className="currency-img" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '2px' }}>EUR</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Euro</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                console.log("BTC clicked");
                vibrate();
                setCurrency('btc');
                fetchBTCPrice();
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: currency === 'btc' ? '2px solid #6C3EFF' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: currency === 'btc' ? '0px 8px 20px rgba(108, 62, 255, 0.15), 0 0 20px rgba(108, 62, 255, 0.3)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '16px 12px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer'
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="currency-icon">
                  <img src={btcIcon} alt="BTC" className="btc-img" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '2px' }}>BTC</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>Bitcoin</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6" style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
          borderRadius: '16px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '16px' }}>طريقة الدفع</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                vibrate();
                setPaymentMethod('bank');
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: paymentMethod === 'bank' ? '2px solid #6C3EFF' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: paymentMethod === 'bank' ? '0px 8px 20px rgba(108, 62, 255, 0.15), 0 0 20px rgba(108, 62, 255, 0.3)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '16px 12px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer',
                opacity: paymentMethod === 'bank' ? 1 : 0.5
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: paymentMethod === 'bank' ? '#6C3EFF' : 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                    <rect x="6" y="14" width="20" height="12" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="1.2" fill="none"/>
                    <line x1="8" y1="16" x2="8" y2="24" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="11" y1="16" x2="11" y2="24" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="14" y1="16" x2="14" y2="24" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="17" y1="16" x2="17" y2="24" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="20" y1="16" x2="20" y2="24" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="24" y1="16" x2="24" y2="24" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <polygon points="6,14 16,8 26,14" stroke={paymentMethod === 'bank' ? '#FFFFFF' : '#6B7280'} strokeWidth="1.2" fill="none"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: paymentMethod === 'bank' ? '#6C3EFF' : '#1A1A1A', marginBottom: '2px' }}>تحويل مصرفي</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>BANK</div>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                vibrate();
                setPaymentMethod('cash');
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: paymentMethod === 'cash' ? '2px solid #6C3EFF' : '1px solid rgba(0,0,0,0.05)',
                boxShadow: paymentMethod === 'cash' ? '0px 8px 20px rgba(108, 62, 255, 0.15), 0 0 20px rgba(108, 62, 255, 0.3)' : '0px 8px 20px rgba(0,0,0,0.05)',
                borderRadius: '16px',
                padding: '16px 12px',
                transition: 'all 0.2s ease',
                transform: 'scale(1)',
                cursor: 'pointer',
                opacity: paymentMethod === 'cash' ? 1 : 0.5
              }}
              onMouseDown={(e) => {
                e.target.style.transform = 'scale(0.98)';
              }}
              onMouseUp={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: paymentMethod === 'cash' ? '#6C3EFF' : 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                    <rect x="5" y="10" width="22" height="16" rx="2" stroke={paymentMethod === 'cash' ? '#FFFFFF' : '#6B7280'} strokeWidth="1.2" fill="none"/>
                    <line x1="7" y1="13" x2="25" y2="13" stroke={paymentMethod === 'cash' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="7" y1="16" x2="25" y2="16" stroke={paymentMethod === 'cash' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="7" y1="19" x2="25" y2="19" stroke={paymentMethod === 'cash' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <line x1="7" y1="22" x2="19" y2="22" stroke={paymentMethod === 'cash' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8"/>
                    <circle cx="22" cy="22" r="1.2" stroke={paymentMethod === 'cash' ? '#FFFFFF' : '#6B7280'} strokeWidth="0.8" fill="none"/>
                    <path d="M5 10 L5 7 L27 7 L27 10" stroke={paymentMethod === 'cash' ? '#FFFFFF' : '#6B7280'} strokeWidth="1.2" fill="none"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: paymentMethod === 'cash' ? '#6C3EFF' : '#1A1A1A', marginBottom: '2px' }}>نقدي</div>
                  <div style={{ fontSize: '11px', color: '#6B7280' }}>CASH</div>
                </div>
              </div>
            </button>
          </div>
          <div className="mt-3">
            <div 
              className="current-price"
              style={{
                background: 'linear-gradient(135deg, #6C2EFF, #A855F7)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0px 8px 20px rgba(108, 46, 255, 0.15)',
                textAlign: 'center'
              }}
            >
              <div 
                style={{
                  textAlign: 'center',
                  marginBottom: '8px'
                }}
              >
                <div 
                  style={{
                    fontSize: '12px',
                    color: '#E0E0E0',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '2px'
                  }}
                >
                  السعر الحالي
                </div>
                <div 
                  style={{
                    fontSize: '10px',
                    color: '#E0E0E0',
                    fontWeight: '400'
                  }}
                >
                  Currency Price
                </div>
              </div>
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  direction: 'rtl',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span 
                  style={{
                    fontSize: '28px',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    lineHeight: '1',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    marginLeft: '8px'
                  }}
                >
                  {(() => { console.log("Rendered price:", currency === 'btc' ? btcPrice : getCurrentPrice()); return currency === 'btc' ? (btcPrice ? btcPrice.toFixed(2) : 'Loading...') : getCurrentPrice(); })()}
                </span>
                <span 
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    lineHeight: '1',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  د.ل
                </span>
              </div>
              <p className="note" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '8px' }}>يشمل عمولة 2%</p>
            </div>
          </div>
        </div>

        {/* Amount Input - Only show for USDT */}
        {currency === 'usdt' && (
          <div className="mb-6" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <label style={{ 
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#111111',
              marginBottom: '12px'
            }}>
              المبلغ (USDT)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#6C3EFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFFFFF' }}>T</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 52px',
                  border: '2px solid #6C3EFF',
                  borderRadius: '14px',
                  fontSize: '16px',
                  color: '#111111',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6C3EFF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Amount Input - Only show for USD */}
        {currency === 'usd' && (
          <div className="mb-6" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <label style={{ 
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#111111',
              marginBottom: '12px'
            }}>
              المبلغ (USD)
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#6C3EFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#FFFFFF' }}>$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ (USD)"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 52px',
                  border: '2px solid #6C3EFF',
                  borderRadius: '14px',
                  fontSize: '16px',
                  color: '#111111',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6C3EFF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Amount Input - Only show for EUR */}
        {currency === 'eur' && (
          <div className="mb-6" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <label style={{ 
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#111111',
              marginBottom: '12px'
            }}>
              المبلغ (EUR)
            </label>
            <div className="currency-eur" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#6C3EFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}>
                <div className="input-icon">
                  <img src={eurIcon} alt="EUR" className="currency-img" />
                </div>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ (EUR)"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 52px',
                  border: '2px solid #6C3EFF',
                  borderRadius: '14px',
                  fontSize: '16px',
                  color: '#111111',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6C3EFF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Amount Input - Only show for BTC */}
        {currency === 'btc' && (
          <div className="mb-6" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.05)',
            boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
            borderRadius: '16px',
            padding: '20px'
          }}>
            <label style={{ 
              display: 'block',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#111111',
              marginBottom: '12px'
            }}>
              المبلغ (BTC)
            </label>
            <div className="currency-btc" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#6C3EFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}>
                <div className="input-icon">
                  <img src={btcIcon} alt="BTC" className="btc-img" />
                </div>
              </div>
              <input
                type="number"
                step="0.00000001"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="أدخل المبلغ (BTC)"
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 52px',
                  border: '2px solid #6C3EFF',
                  borderRadius: '14px',
                  fontSize: '16px',
                  color: '#111111',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6C3EFF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(0,0,0,0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Total Card */}
        {amount && (
          <div style={{
            background: 'linear-gradient(135deg, #6C2EFF, #A855F7)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0px 8px 20px rgba(108, 46, 255, 0.15)',
            textAlign: 'center'
          }}>
            <div>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', marginBottom: '8px' }}>Currency Price</p>
              <div 
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  direction: 'rtl',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span 
                  style={{
                    fontSize: '28px',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    lineHeight: '1',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    marginLeft: '8px'
                  }}
                >
                  {calculateTotal().toFixed(2)}
                </span>
                <span 
                  style={{
                    fontSize: '18px',
                    color: '#FFFFFF',
                    fontWeight: '700',
                    lineHeight: '1',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  د.ل
                </span>
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginTop: '8px' }}>يشمل عمولة 2%</p>
            </div>
          </div>
        )}

        {/* Dynamic Form */}
        <div className="card-primary mb-6">
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111111', marginBottom: '16px' }}>
            {operation === 'buy' ? 'بيانات الشراء' : 'بيانات البيع'}
          </h3>

          {operation === 'buy' ? (
            <>
              {currency === 'usdt' ? (
                <>
                  {/* Payment Methods (for USDT buy) */}
                  <div className="mb-4">
                    <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                      <p style={{ color: '#111111', fontSize: '13px', textAlign: 'right', marginBottom: '12px' }}>طريقة الدفع</p>
                      <div className="payment-auto-slider" style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        padding: '0px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* نظام عرض صورة واحدة متغيرة تلقائياً */}
                        {[img1, img2, img5].map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Payment ${index + 1}`}
                            style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                              padding: '0px',
                              opacity: currentPaymentSlide === index ? 1 : 0,
                              transition: 'opacity 0.5s ease-in-out',
                              position: currentPaymentSlide === index ? 'relative' : 'absolute'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simple Terms Acceptance */}
                  <div style={{
                    marginBottom: '15px',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#111111'
                      }}>
                        <input
                          type="checkbox"
                          checked={paymentTermsAccepted}
                          onChange={(e) => setPaymentTermsAccepted(e.target.checked)}
                          style={{
                            marginLeft: '10px',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        أوافق على الشروط وأتعهد بالالتزام بها
                      </label>
                      <button
                        onClick={() => setShowPaymentTermsModal(true)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#111111',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        عرض الشروط
                      </button>
                    </div>
                  </div>

                  {/* IBAN Field */}
                  <div style={{
                    background: paymentTermsAccepted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '15px',
                    padding: '15px',
                    marginBottom: '15px',
                    border: paymentTermsAccepted ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: paymentTermsAccepted ? 1 : 0.5
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block' }}>الآيبان:</span>
                      <code style={{ fontSize: '13px', color: '#fff' }}>{paymentTermsAccepted ? 'LY24007039039011370298010' : '••••••••••••••••••••••'}</code>
                    </div>
                    <button 
                      onClick={() => {
                        if (paymentTermsAccepted) {
                          navigator.clipboard.writeText(bankData.iban);
                          setCopiedField('iban');
                          setTimeout(() => setCopiedField(null), 1200);
                        }
                      }}
                      disabled={!paymentTermsAccepted}
                      style={{ 
                        background: paymentTermsAccepted ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        color: paymentTermsAccepted ? '#fff' : 'rgba(255,255,255,0.3)', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        cursor: paymentTermsAccepted ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {copiedField === 'iban' ? '✅' : 'نسخ'}
                    </button>
                  </div>

                  {/* Account Number Field */}
                  <div style={{
                    background: paymentTermsAccepted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '15px',
                    padding: '15px',
                    marginBottom: '15px',
                    border: paymentTermsAccepted ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: paymentTermsAccepted ? 1 : 0.5
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block' }}>رقم الحساب:</span>
                      <code style={{ fontSize: '13px', color: '#fff' }}>{paymentTermsAccepted ? '039011370298010' : '•••••••••••••••'}</code>
                    </div>
                    <button 
                      onClick={() => {
                        if (paymentTermsAccepted) {
                          navigator.clipboard.writeText('039011370298010');
                          setCopiedField('account');
                          setTimeout(() => setCopiedField(null), 1200);
                        }
                      }}
                      disabled={!paymentTermsAccepted}
                      style={{ 
                        background: paymentTermsAccepted ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        color: paymentTermsAccepted ? '#fff' : 'rgba(255,255,255,0.3)', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        cursor: paymentTermsAccepted ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {copiedField === 'account' ? '✅' : 'نسخ'}
                    </button>
                  </div>

                  {/* User Wallet Data */}
                  <div className="mb-4 relative">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>عنوان المحفظة</label>
                    <input
                        type="text"
                        value={formData.walletAddress}
                        placeholder={walletData.address}
                        style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                    setShowWalletTooltip(true);
                    const timer = setTimeout(() => {
                      setShowWalletTooltip(false);
                    }, 3000);
                    setTooltipTimer(timer);
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                    setShowWalletTooltip(false);
                    if (tooltipTimer) {
                      clearTimeout(tooltipTimer);
                    }
                  }}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, walletAddress: e.target.value }));
                          setShowWalletTooltip(false);
                          if (tooltipTimer) {
                            clearTimeout(tooltipTimer);
                          }
                        }}
                        onClick={() => {
                          setShowWalletTooltip(true);
                          if (tooltipTimer) {
                            clearTimeout(tooltipTimer);
                          }
                          const timer = setTimeout(() => {
                            setShowWalletTooltip(false);
                          }, 3000);
                          setTooltipTimer(timer);
                        }}
                      />
                    
                    {/* Tooltip */}
                    {showWalletTooltip && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '-60px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'white',
                          color: '#333',
                          padding: '12px 16px',
                          borderRadius: '14px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          zIndex: 1000,
                          minWidth: '280px',
                          textAlign: 'center',
                          direction: 'rtl',
                          animation: 'fadeIn 0.3s ease-in-out',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <div style={{ marginBottom: '4px' }}>{"\ud83d\udca1"}</div>
                        <div>هذا هو عنوانك لاستقبال USDT، تأكد من نسخها بدقة.</div>
                        {/* Arrow */}
                        <div 
                          style={{
                            position: 'absolute',
                            bottom: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '0',
                            height: '0',
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid white'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-4 relative" ref={dropdownRef} style={{ zIndex: 9999 }}>
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>اختار الشبكة</label>
                    <div 
                      onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white cursor-pointer"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #6C3EFF',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        color: '#111111',
                        fontSize: '14px',
                        position: 'relative',
                        zIndex: 9999,
                        boxShadow: '0 0 12px rgba(108,62,255,0.25)'
                      }}
                    >
                      <span>{selectedNetwork === 'TRC20' ? 'TRC20 (TRON)' : selectedNetwork === 'ERC20' ? 'ERC20 (Ethereum)' : 'BEP20 (BSC)'}</span>
                      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>▼</span>
                    </div>
                    {showNetworkDropdown && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '14px',
                          marginTop: '4px',
                          zIndex: 9998,
                          overflow: 'hidden',
                          boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3)'
                        }}
                      >
                        <div 
                          onClick={() => { setSelectedNetwork('TRC20'); setShowNetworkDropdown(false); }}
                          style={{
                            padding: '12px 16px',
                            color: '#111111',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: selectedNetwork === 'TRC20' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedNetwork !== 'TRC20') {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedNetwork !== 'TRC20') {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          TRC20 (TRON)
                        </div>
                        <div 
                          onClick={() => { setSelectedNetwork('ERC20'); setShowNetworkDropdown(false); }}
                          style={{
                            padding: '12px 16px',
                            color: '#111111',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: selectedNetwork === 'ERC20' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedNetwork !== 'ERC20') {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedNetwork !== 'ERC20') {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          ERC20 (Ethereum)
                        </div>
                        <div 
                          onClick={() => { setSelectedNetwork('BEP20'); setShowNetworkDropdown(false); }}
                          style={{
                            padding: '12px 16px',
                            color: '#111111',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: selectedNetwork === 'BEP20' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedNetwork !== 'BEP20') {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedNetwork !== 'BEP20') {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          BEP20 (BSC)
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Payment Methods (for USD/EUR buy) */}
                  <div className="mb-4">
                    <div style={{ marginTop: '10px', marginBottom: '20px' }}>
                      <p style={{ color: '#111111', fontSize: '13px', textAlign: 'right', marginBottom: '12px' }}>DEENAR</p>
                      <div className="payment-auto-slider" style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '15px',
                        padding: '0px',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* نظام عرض صورة واحدة متغيرة تلقائياً */}
                        {[img1, img2, img5].map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Payment ${index + 1}`}
                            style={{
                              width: '100%',
                              height: 'auto',
                              objectFit: 'contain',
                              padding: '0px',
                              opacity: currentPaymentSlide === index ? 1 : 0,
                              transition: 'opacity 0.5s ease-in-out',
                              position: currentPaymentSlide === index ? 'relative' : 'absolute'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Simple Terms Acceptance */}
                  <div style={{
                    marginBottom: '15px',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px'
                    }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#111111'
                      }}>
                        <input
                          type="checkbox"
                          checked={paymentTermsAccepted}
                          onChange={(e) => setPaymentTermsAccepted(e.target.checked)}
                          style={{
                            marginLeft: '10px',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        أوافق على الشروط وأتعهد بالالتزام بها
                      </label>
                      <button
                        onClick={() => setShowPaymentTermsModal(true)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#111111',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                      >
                        عرض الشروط
                      </button>
                    </div>
                  </div>

                  {/* IBAN Field */}
                  <div style={{
                    background: paymentTermsAccepted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '15px',
                    padding: '15px',
                    marginBottom: '15px',
                    border: paymentTermsAccepted ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: paymentTermsAccepted ? 1 : 0.5
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block' }}>الآيبان:</span>
                      <code style={{ fontSize: '13px', color: '#fff' }}>{paymentTermsAccepted ? 'LY24007039039011370298010' : '••••••••••••••••••••••'}</code>
                    </div>
                    <button 
                      onClick={() => {
                        if (paymentTermsAccepted) {
                          navigator.clipboard.writeText(bankData.iban);
                          setCopiedField('iban');
                          setTimeout(() => setCopiedField(null), 1200);
                        }
                      }}
                      disabled={!paymentTermsAccepted}
                      style={{ 
                        background: paymentTermsAccepted ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        color: paymentTermsAccepted ? '#fff' : 'rgba(255,255,255,0.3)', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        cursor: paymentTermsAccepted ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {copiedField === 'iban' ? '✅' : 'نسخ'}
                    </button>
                  </div>

                  {/* Account Number Field */}
                  <div style={{
                    background: paymentTermsAccepted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '15px',
                    padding: '15px',
                    marginBottom: '15px',
                    border: paymentTermsAccepted ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'none',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: paymentTermsAccepted ? 1 : 0.5
                  }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', display: 'block' }}>رقم الحساب:</span>
                      <code style={{ fontSize: '13px', color: '#fff' }}>{paymentTermsAccepted ? '039011370298010' : '•••••••••••••••'}</code>
                    </div>
                    <button 
                      onClick={() => {
                        if (paymentTermsAccepted) {
                          navigator.clipboard.writeText('039011370298010');
                          setCopiedField('account2');
                          setTimeout(() => setCopiedField(null), 1200);
                        }
                      }}
                      disabled={!paymentTermsAccepted}
                      style={{ 
                        background: paymentTermsAccepted ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        color: paymentTermsAccepted ? '#fff' : 'rgba(255,255,255,0.3)', 
                        padding: '5px 10px', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        cursor: paymentTermsAccepted ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {copiedField === 'account2' ? '✅' : 'نسخ'}
                    </button>
                  </div>

                  {/* User Full Name */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>الاسم بالكامل</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

                  {/* Transfer Date */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>حدد التاريخ</label>
                    <input
                      type="date"
                      value={formData.transferDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, transferDate: e.target.value }))}
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

                  {/* Transfer Time */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>حدد الوقت</label>
                    <input
                      type="time"
                      value={formData.transferTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, transferTime: e.target.value }))}
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
                </>
              )}

              {/* Phone Number (common for all currencies) */}
              <div className="mb-4">
                <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="09XXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    textAlign: 'right',
                    direction: 'rtl',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}
                  required
                />
              </div>

                          </>
          ) : (
            <>
              {currency === 'usdt' ? (
                <>
                  {/* Wallet Data (for USDT sell) */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>محفظتنا</label>
                    <div className="space-y-2">
                      <div style={{ position: 'relative', width: '100%' }}>
                        <input
                        type="text"
                        value={walletData.address}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '14px 45px 14px 14px',
                          border: '2px solid #6C3EFF',
                          borderRadius: '14px',
                          fontSize: '16px',
                          color: '#111111',
                          backgroundColor: '#FFFFFF',
                          outline: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      />
                      
                      {/* Copy Icon Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(walletData.address);
                            setCopiedField('sellWallet');
                            setTimeout(() => {
                              setCopiedField(null);
                            }, 1200);
                          } catch (err) {
                            console.error('Failed to copy:', err);
                          }
                        }}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          borderRadius: '8px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(108, 62, 255, 0.1)';
                          e.target.style.transform = 'translateY(-50%) scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.transform = 'translateY(-50%) scale(1)';
                        }}
                        title={copiedField === 'sellWallet' ? 'تم النسخ' : 'نسخ العنوان'}
                        aria-label={copiedField === 'sellWallet' ? 'تم النسخ' : 'نسخ العنوان'}
                      >
                        {copiedField === 'sellWallet' ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#22C55E' }}>
                            <path d="M9 12L11 14L15 10" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="2"/>
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: '#6C3EFF' }}>
                            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                      </button>
                      </div>
                      <div style={{ position: 'relative' }}>
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>اختيار الشبكة</label>
                    <div 
                      onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                      className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white cursor-pointer"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid #6C3EFF',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        color: '#111111',
                        fontSize: '14px',
                        position: 'relative',
                        zIndex: 9999,
                        boxShadow: '0 0 12px rgba(108,62,255,0.25)'
                      }}
                    >
                      <span>{selectedNetwork === 'TRC20' ? 'TRC20 (TRON)' : selectedNetwork === 'ERC20' ? 'ERC20 (Ethereum)' : 'BEP20 (BSC)'}</span>
                      <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>▼</span>
                    </div>
                    {showNetworkDropdown && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(135deg, #6d28d9, #9333ea)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '14px',
                          marginTop: '4px',
                          zIndex: 9998,
                          overflow: 'hidden',
                          boxShadow: '0 4px 20px rgba(147, 51, 234, 0.3)'
                        }}
                      >
                        <div 
                          onClick={() => { setSelectedNetwork('TRC20'); setShowNetworkDropdown(false); }}
                          style={{
                            padding: '12px 16px',
                            color: '#111111',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: selectedNetwork === 'TRC20' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedNetwork !== 'TRC20') {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedNetwork !== 'TRC20') {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          TRC20 (TRON)
                        </div>
                        <div 
                          onClick={() => { setSelectedNetwork('ERC20'); setShowNetworkDropdown(false); }}
                          style={{
                            padding: '12px 16px',
                            color: '#111111',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: selectedNetwork === 'ERC20' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedNetwork !== 'ERC20') {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedNetwork !== 'ERC20') {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          ERC20 (Ethereum)
                        </div>
                        <div 
                          onClick={() => { setSelectedNetwork('BEP20'); setShowNetworkDropdown(false); }}
                          style={{
                            padding: '12px 16px',
                            color: '#111111',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: selectedNetwork === 'BEP20' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedNetwork !== 'BEP20') {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedNetwork !== 'BEP20') {
                              e.target.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          BEP20 (BSC)
                        </div>
                      </div>
                    )}
                  </div>
                    </div>
                  </div>

                  {/* User Bank Data */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>الحساب البنكي</label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                      placeholder="أدخل رقم الحساب"
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                    />
                  </div>
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>الآيبان</label>
                    <input
                      type="text"
                      value={formData.iban}
                      onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                      placeholder="أدخل الآيبان"
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Office Message for USD/EUR sell */}
                  <div className="bg-blue-600/20 border border-blue-600/50 rounded-xl p-4 text-center mb-6">
                    <p className="text-blue-400 font-medium">يرجى الحضور إلى المكتب لإتمام عملية البيع</p>
                  </div>

                  {/* User Full Name */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>الاسم بالكامل</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

                  {/* Transfer Time */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>حدد الوقت</label>
                    <input
                      type="time"
                      value={formData.transferTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, transferTime: e.target.value }))}
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

                  {/* Amount Input */}
                  <div className="mb-4">
                    <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>المبلغ</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`أدخل المبلغ (${currency.toUpperCase()})`}
                      style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
                </>
              )}

              {/* Phone Number (common for all currencies) */}
              <div className="mb-4">
                <label style={{ display: 'block', color: '#111111', fontSize: '14px', marginBottom: '8px' }}>رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="09XXXXXXXX"
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '2px solid #6C3EFF',
                    borderRadius: '14px',
                    fontSize: '16px',
                    color: '#111111',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    textAlign: 'right',
                    direction: 'rtl',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 0 0 3px rgba(108, 62, 255, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#6C3EFF';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                  }}
                  required
                />
              </div>
            </>
          )}
        </div>

        {/* Terms & Conditions Checkbox */}
        {(currency === 'usdt' || currency === 'usd' || currency === 'eur' || currency === 'btc') && (
          <div className="mb-6" style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '14px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#333333',
              fontSize: '14px'
            }}>
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => setIsAccepted(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  cursor: 'pointer'
                }}
              />
              <span>أوافق على </span>
              <span
                onClick={() => setShowTermsModal(true)}
                style={{
                  color: '#9333EA',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                الشروط والأحكام
              </span>
            </label>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={
            (!amount || !isAccepted) || 
            confirming || 
            confirmed
          }
          className={`w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-8 ${isAccepted ? 'terms-accepted' : ''}`}
        >
          {confirming ? 'جاري التأكيد...' : confirmed ? 'تمت العملية بنجاح ✅' : (operation === 'buy' ? (isAccepted ? 'تأكيد الطلب الآن' : 'تأكيد الدفع') : 'تأكيد البيع')}
        </button>

        {/* Success Message */}
        {confirmed && (
          <div className="bg-green-600/20 border border-green-600/50 rounded-xl p-4 text-center mb-6 animate-fade-in">
            <p className="text-green-400 font-medium">طلبك تحت المراجعة</p>
          </div>
        )}

        {/* Bottom Navigation */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.05)',
          borderRadius: '16px 16px 0 0',
          padding: '16px 0'
        }}>
          <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              {/* Weekly Draw */}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDraw(true);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  color: '#6B7280'
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '24px' }}>🎁</div>
                <span style={{ fontSize: '11px', fontWeight: 'medium' }}>سحب أسبوعي</span>
              </a>

              {/* Market - Active */}
              <a
                href="https://coinmarketcap.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  backgroundColor: 'rgba(108, 62, 255, 0.1)',
                  color: '#6C3EFF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(108, 62, 255, 0.2)'
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/>
                  <path d="M7 16l4-8 4 6 4-4"/>
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 'medium' }}>Market</span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1CHFuXq3zt/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  color: '#6B7280'
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 'medium' }}>Facebook</span>
              </a>

              {/* Privacy */}
              <button
                onClick={() => setShowPrivacyModal(true)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#6B7280',
                  cursor: 'pointer'
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 'medium' }}>Privacy</span>
              </button>

              {/* Mail */}
              <a
                href="mailto:elarenha@gmail.com"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 12px',
                  borderRadius: '14px',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  color: '#6B7280'
                }}
                onMouseDown={(e) => {
                  e.target.style.transform = 'scale(0.98)';
                }}
                onMouseUp={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-10 5L2 7"/>
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 'medium' }}>Mail</span>
              </a>
            </div>
          </div>
      </div>
    </div>
        
        {/* Floating WhatsApp Button */}
        <a
        href="https://wa.me/393895724547"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '90px',
          left: '20px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%)',
          border: 'none',
          boxShadow: 'none',
          filter: 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          zIndex: 9998,
          transition: 'all 0.3s ease',
          animation: 'shake 1.2s infinite',
          textDecoration: 'none'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <div style={{ fontSize: '6px', color: 'white', fontWeight: 'bold', lineHeight: '1' }}>WhatsApp</div>
      </a>
        </div>
      )}
    </div>
  );
}

export default App;
