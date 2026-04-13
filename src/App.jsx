import { useState, useEffect } from 'react'
import './index.css'
import welcomeImg from './assets/welcome.jpg'
import confirmImg from './assets/10.jpg'
import usdtOfficialLogo from './assets/usdt-official-logo.png'
import buyIcon from './assets/buy-icon.png'
import sellIcon from './assets/sell-icon.png'
import AdBanner from './AdBanner'
import InstallPrompt from './InstallPrompt'
import Draw from './Draw'

// Fixed data
const bankData = {
  bank: "مصرف الجمهورية",
  branch: "وكالة البرج",
  account: "104202000002722",
  iban: "LY95002104104202000002722"
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

  const [showWelcome, setShowWelcome] = useState(true);
  const [operation, setOperation] = useState('buy');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [currency, setCurrency] = useState('usdt');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState({});
  const [imageSelected, setImageSelected] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [showConfirmImage, setShowConfirmImage] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [showDraw, setShowDraw] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
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
    setTimeout(() => {
      const el = document.getElementById("welcome-screen");
      if (el) {
        el.classList.add("hidden");
      }
    }, 2000);
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
    const price = getCurrentPrice();
    const subtotal = parseFloat(amount) * price;
    const commission = subtotal * prices.fee;
    return subtotal + commission;
  };

  function sendToGoogleSheet(phone, amount, total, currency) {
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfrpv4L0GwMM3zQC8OWKv9-iq8Uz0VwHY-l9TcMJdC9AHY5sQ/formResponse";

    const formData = new FormData();
    formData.append("entry.1487754017", phone);
    formData.append("entry.446288420", amount);
    formData.append("entry.1134418766", total);
    formData.append("entry.1134418767", currency.toUpperCase());

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
• الشبكة: ${walletData.network}

🏦 بياناتنا:
• البنك: مصرف الجمهورية
• الفرع: وكالة البرج
• رقم الحساب: ${bankData.account}
• الآيبان: ${bankData.iban}

💼 محفظتنا:
• العنوان: ${walletData.address}
• الشبكة: ${walletData.network}`;
    }

    setShowConfirmImage(true);

    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
      
      // Submit to Google Form
      sendToGoogleSheet(formData.phone, amount, calculateTotal().toFixed(2), currency);
      
      // Store WhatsApp URL for manual button
      const url = `https://wa.me/393895724547?text=${encodeURIComponent(message)}`;
      setWhatsappUrl(url);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950"
      onClick={(e) => {
        if (e.target.tagName !== "INPUT") {
          document.activeElement.blur();
        }
      }}
      onTouchMove={() => {
        document.activeElement.blur();
      }}
    >
      {/* Welcome Screen */}
      {showWelcome && (
        <div id="welcome-screen" style={{ margin: 0, padding: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
          <img 
            src={welcomeImg}
            alt="Welcome"
            style={{
              width: '100%',
              height: '100vh',
              objectFit: 'cover',
              display: 'block',
              margin: 0,
              padding: 0
            }}
          />
        </div>
      )}
      
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
            <div style={{
              fontSize: "14px",
              color: "#9CA3AF",
              marginBottom: "20px"
            }}>
              📲 اضغط الزر بالأسفل لإرسال الطلب عبر واتساب
            </div>
            
            {/* WhatsApp Button */}
            <button
              onClick={() => window.location.href = whatsappUrl}
              style={{
                width: "100%",
                maxWidth: "300px",
                backgroundColor: "#25D366",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "16px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "all 0.2s ease",
                marginBottom: "10px"
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#128C7E";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#25D366";
                e.target.style.transform = "scale(1)";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              إرسال الطلب عبر واتساب
            </button>
            
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
              {"\u0646\u062d\u062a\u0631\u0645 \u062e\u0635\u0648\u0635\u064a\u062a\u0643\u0621 \u064a\u062a\u0645 \u062a\u062e\u0632\u064a\u0646 \u0628\u064a\u0627\u0646\u0627\u062a\u0643 \u0628\u0634\u0643\u0644 \u0622\u0645\u0646\u0621 \u0644\u0627 \u064a\u062a\u0645 \u062a\u0646\u0641\u064a\u0630 \u0623\u064a \u0639\u0645\u0644\u064a\u0629 \u0625\u0644\u0627 \u0628\u0639\u062f \u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646 \u0625\u064a\u0635\u0627\u0644 \u0627\u0644\u062a\u062d\u0648\u064a\u0644 \u0648\u0631\u0628\u0637\u0647 \u0628\u0631\u0642\u0645 \u0639\u0645\u0644\u064a\u0629\u0621 \u0646\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0641\u0642\u0637 \u0644\u062a\u0623\u0645\u064a\u0646 \u0627\u0644\u0639\u0645\u0644\u064a\u0627\u062a \u0648\u0645\u0646\u0639 \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644\u0622"}
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
      
      <div className="max-w-mobile mx-auto px-4 py-6 pb-20">
        {/* Ad Banner */}
        <AdBanner />
        
        {/* Operation Selection */}
        <div className="card-primary mb-6">
          <h2 className="text-xl font-bold text-white mb-4">اختر العملية</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                vibrate();
                setOperation('buy');
              }}
              className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center ${
                operation === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <img src={buyIcon} alt="Buy" width="16" height="16" />
                <span>شراء</span>
              </div>
              <span className="text-xs opacity-75">BUY</span>
            </button>
            <button
              onClick={() => {
                vibrate();
                setOperation('sell');
              }}
              className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center ${
                operation === 'sell'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ transform: 'scaleX(-1)' }}>
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
                <span>بيع</span>
              </div>
              <span className="text-xs opacity-75">SELL</span>
            </button>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="card-primary mb-6">
          <h3 className="text-lg font-bold text-white mb-4">العملة</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => {
                vibrate();
                setCurrency('usdt');
              }}
              className={`py-4 px-3 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center ${
                currency === 'usdt'
                  ? 'bg-gradient-to-br from-purple-700 to-purple-800 text-white shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
              style={{
                boxShadow: currency === 'usdt' ? '0 4px 15px rgba(147, 51, 234, 0.4), 0 0 15px rgba(147, 51, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: currency === 'usdt' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <img 
                src={usdtOfficialLogo} 
                alt="USDT" 
                width="32" 
                height="32" 
                style={{ borderRadius: '50%', marginBottom: '8px' }}
              />
              <div className="currency-label" style={{ textAlign: 'center', animation: 'fadeInUp 0.3s ease-out' }}>
                <div className="title" style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '2px' }}>USDT</div>
                <div className="subtitle" style={{ fontSize: '12px', opacity: 0.7, color: '#ddd' }}>Tether</div>
              </div>
            </button>
            <button
              onClick={() => {
                vibrate();
                setCurrency('usd');
              }}
              className={`py-4 px-3 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center ${
                currency === 'usd'
                  ? 'bg-gradient-to-br from-purple-700 to-purple-800 text-white shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
              style={{
                boxShadow: currency === 'usd' ? '0 4px 15px rgba(147, 51, 234, 0.4), 0 0 15px rgba(147, 51, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: currency === 'usd' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>$</span>
              <div className="currency-label" style={{ textAlign: 'center', animation: 'fadeInUp 0.3s ease-out' }}>
                <div className="title" style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '2px' }}>USD</div>
                <div className="subtitle" style={{ fontSize: '12px', opacity: 0.7, color: '#ddd' }}>US Dollar</div>
              </div>
            </button>
            <button
              onClick={() => {
                vibrate();
                setCurrency('eur');
              }}
              className={`py-4 px-3 rounded-xl font-bold transition-all duration-200 flex flex-col items-center justify-center ${
                currency === 'eur'
                  ? 'bg-gradient-to-br from-purple-700 to-purple-800 text-white shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
              style={{
                boxShadow: currency === 'eur' ? '0 4px 15px rgba(147, 51, 234, 0.4), 0 0 15px rgba(147, 51, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: currency === 'eur' ? 'scale(1.02)' : 'scale(1)'
              }}
            >
              <span style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>€</span>
              <div className="currency-label" style={{ textAlign: 'center', animation: 'fadeInUp 0.3s ease-out' }}>
                <div className="title" style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '2px' }}>EUR</div>
                <div className="subtitle" style={{ fontSize: '12px', opacity: 0.7, color: '#ddd' }}>Euro</div>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card-primary mb-6">
          <h3 className="text-lg font-bold text-white mb-3">طريقة الدفع</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                vibrate();
                setPaymentMethod('bank');
              }}
              className={`py-3 px-3 rounded-xl font-medium transition-all duration-300 flex flex-col items-center justify-center ${
                paymentMethod === 'bank'
                  ? 'bg-gradient-to-br from-purple-700 to-purple-800 text-white shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30 opacity-60'
              }`}
              style={{
                boxShadow: paymentMethod === 'bank' ? '0 4px 15px rgba(147, 51, 234, 0.4), 0 0 15px rgba(147, 51, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: paymentMethod === 'bank' ? 'scale(1.01)' : 'scale(1)'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ marginBottom: '4px' }}>
                <rect x="6" y="14" width="20" height="12" stroke="#FFD700" strokeWidth="1.2" fill="none"/>
                <line x1="8" y1="16" x2="8" y2="24" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="11" y1="16" x2="11" y2="24" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="14" y1="16" x2="14" y2="24" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="17" y1="16" x2="17" y2="24" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="20" y1="16" x2="20" y2="24" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="24" y1="16" x2="24" y2="24" stroke="#FFD700" strokeWidth="0.8"/>
                <polygon points="6,14 16,8 26,14" stroke="#FFD700" strokeWidth="1.2" fill="none"/>
              </svg>
              <span className="text-xs font-bold">تحويل بنكي</span>
              <span className="text-xs opacity-75 mt-0.5">BANK</span>
            </button>
            <button
              onClick={() => {
                vibrate();
                setPaymentMethod('cash');
              }}
              className={`py-3 px-3 rounded-xl font-medium transition-all duration-300 flex flex-col items-center justify-center ${
                paymentMethod === 'cash'
                  ? 'bg-gradient-to-br from-purple-700 to-purple-800 text-white shadow-lg'
                  : 'bg-white/20 text-white/70 hover:bg-white/30 opacity-60'
              }`}
              style={{
                boxShadow: paymentMethod === 'cash' ? '0 4px 15px rgba(147, 51, 234, 0.4), 0 0 15px rgba(147, 51, 234, 0.2)' : '0 2px 8px rgba(0,0,0,0.1)',
                transform: paymentMethod === 'cash' ? 'scale(1.01)' : 'scale(1)'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ marginBottom: '4px' }}>
                <rect x="5" y="10" width="22" height="16" rx="2" stroke="#FFD700" strokeWidth="1.2" fill="none"/>
                <line x1="7" y1="13" x2="25" y2="13" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="7" y1="16" x2="25" y2="16" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="7" y1="19" x2="25" y2="19" stroke="#FFD700" strokeWidth="0.8"/>
                <line x1="7" y1="22" x2="19" y2="22" stroke="#FFD700" strokeWidth="0.8"/>
                <circle cx="22" cy="22" r="1.2" stroke="#FFD700" strokeWidth="0.8" fill="none"/>
                <path d="M5 10 L5 7 L27 7 L27 10" stroke="#FFD700" strokeWidth="1.2" fill="none"/>
              </svg>
              <span className="text-xs font-bold">نقدي</span>
              <span className="text-xs opacity-75 mt-0.5">CASH</span>
            </button>
          </div>
          <div className="mt-3">
            <div 
              className="financial-price-display"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontWeight: '500',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                السعر الحالي
              </div>
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'center',
                  gap: '6px',
                  flexDirection: 'row-reverse',
                  direction: 'rtl'
                }}
              >
                <span 
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontWeight: '400',
                    alignSelf: 'flex-end',
                    marginBottom: '4px'
                  }}
                >
                  دينار
                </span>
                <span 
                  style={{
                    fontSize: '32px',
                    color: '#10b981',
                    fontWeight: '700',
                    lineHeight: '1',
                    textShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}
                >
                  {getCurrentPrice()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Input - Only show for USDT */}
        {currency === 'usdt' && (
          <div className="card-primary mb-6">
            <label className="block text-white font-medium mb-2">
              المبلغ (USDT)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ"
              className="input-field w-full"
            />
          </div>
        )}

        {/* Amount Input - Only show for USD */}
        {currency === 'usd' && (
          <div className="card-primary mb-6">
            <label className="block text-white font-medium mb-2">
              المبلغ (USD)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ (USD)"
              className="input-field w-full"
            />
          </div>
        )}

        {/* Amount Input - Only show for EUR */}
        {currency === 'eur' && (
          <div className="card-primary mb-6">
            <label className="block text-white font-medium mb-2">
              المبلغ (EUR)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="أدخل المبلغ (EUR)"
              className="input-field w-full"
            />
          </div>
        )}

        {/* Total Card */}
        {amount && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 mb-6 shadow-xl">
            <div className="text-center">
              <p className="text-white/80 text-sm mb-1">الإجمالي بالدينار الليبي</p>
              <p className="text-white text-3xl font-bold mb-2">
                {calculateTotal().toFixed(2)} د.ل
              </p>
              <p className="text-white/70 text-xs">يشمل عمولة 2%</p>
            </div>
          </div>
        )}

        {/* Dynamic Form */}
        <div className="card-primary mb-6">
          <h3 className="text-lg font-bold text-white mb-4">
            {operation === 'buy' ? 'بيانات الشراء' : 'بيانات البيع'}
          </h3>

          {operation === 'buy' ? (
            <>
              {currency === 'usdt' ? (
                <>
                  {/* Bank Data (for USDT buy) */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">بياناتنا البنكية</label>
                    <div className="space-y-2">
                      <div className="bg-white/5 p-2 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70 text-xs">البنك:</span>
                          <span className="text-white text-xs">{bankData.bank}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-white text-xs block">ONEPAY / LYPAY</span>
                        </div>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg overflow-hidden">
                        <span 
                          className="text-white text-xs block whitespace-nowrap"
                          style={{
                            animation: 'slideRightToLeft 3s linear infinite',
                            display: 'inline-block'
                          }}
                        >
                          يدعم جميع المصارف
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                        <span className="text-white/70 text-xs">الحساب:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs">{bankData.account}</span>
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(bankData.account);
                              setCopiedField('account');
                              setTimeout(() => setCopiedField(null), 1200);
                            }}
                            style={{ cursor: 'pointer' }}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                          >
                            {copiedField === 'account' ? '✅' : '📋'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                        <span className="text-white/70 text-xs">الآيبان:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs">{bankData.iban}</span>
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(bankData.iban);
                              setCopiedField('iban');
                              setTimeout(() => setCopiedField(null), 1200);
                            }}
                            style={{ cursor: 'pointer' }}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                          >
                            {copiedField === 'iban' ? '✅' : '📋'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Wallet Data */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">عنوان المحفظة</label>
                    <input
                        type="text"
                        value={formData.walletAddress}
                        onChange={(e) => setFormData(prev => ({ ...prev, walletAddress: e.target.value }))}
                        placeholder={walletData.address}
                        className="input-field w-full"
                      />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">الشبكة</label>
                    <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white">
                      BEP20
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Bank Data (for USD/EUR buy) */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">بياناتنا البنكية</label>
                    <div className="space-y-2">
                      <div className="bg-white/5 p-2 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70 text-xs">البنك:</span>
                          <span className="text-white text-xs">{bankData.bank}</span>
                        </div>
                        <div className="text-left">
                          <span className="text-white text-xs block">LYPAY-ONEPAY</span>
                        </div>
                      </div>
                      <div className="bg-white/5 p-2 rounded-lg overflow-hidden">
                        <span 
                          className="text-white text-xs block whitespace-nowrap"
                          style={{
                            animation: 'slideRightToLeft 3s linear infinite',
                            display: 'inline-block'
                          }}
                        >
                          يدعم جميع المصارف
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                        <span className="text-white/70 text-xs">رقم الحساب:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs">{bankData.account}</span>
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(bankData.account);
                              setCopiedField('account');
                              setTimeout(() => setCopiedField(null), 1200);
                            }}
                            style={{ cursor: 'pointer' }}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                          >
                            {copiedField === 'account' ? '✅' : '📋'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                        <span className="text-white/70 text-xs">IBAN:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white text-xs">{bankData.iban}</span>
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(bankData.iban);
                              setCopiedField('iban');
                              setTimeout(() => setCopiedField(null), 1200);
                            }}
                            style={{ cursor: 'pointer' }}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                          >
                            {copiedField === 'iban' ? '✅' : '📋'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User Full Name */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">الاسم بالكامل</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      className="input-field w-full"
                      style={{ textAlign: 'right', direction: 'rtl' }}
                      required
                    />
                  </div>

                  {/* Transfer Date */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">حدد التاريخ</label>
                    <input
                      type="date"
                      value={formData.transferDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, transferDate: e.target.value }))}
                      className="input-field w-full"
                      required
                    />
                  </div>

                  {/* Transfer Time */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">حدد الوقت</label>
                    <input
                      type="time"
                      value={formData.transferTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, transferTime: e.target.value }))}
                      className="input-field w-full"
                      required
                    />
                  </div>
                </>
              )}

              {/* Phone Number (common for all currencies) */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="09XXXXXXXX"
                  className="input-field w-full"
                  style={{ textAlign: 'right', direction: 'rtl' }}
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
                    <label className="block text-white/70 text-sm mb-2">محفظتنا</label>
                    <div className="space-y-2">
                      <div className="bg-white/5 p-2 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-white text-xs break-all max-w-[70%]">{walletData.address}</span>
                          <span
                            onClick={() => {
                              navigator.clipboard.writeText(walletData.address);
                              setCopiedField('wallet');
                              setTimeout(() => setCopiedField(null), 1200);
                            }}
                            style={{ cursor: 'pointer' }}
                            className="text-purple-400 hover:text-purple-300 text-xs"
                          >
                            {copiedField === 'wallet' ? '✅' : '📋'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                        <span className="text-white/70 text-xs">الشبكة:</span>
                        <span className="text-white text-xs">{walletData.network}</span>
                      </div>
                    </div>
                  </div>

                  {/* User Bank Data */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">الحساب البنكي</label>
                    <input
                      type="text"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                      placeholder="أدخل رقم الحساب"
                      className="input-field w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">الآيبان</label>
                    <input
                      type="text"
                      value={formData.iban}
                      onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                      placeholder="أدخل الآيبان"
                      className="input-field w-full"
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
                    <label className="block text-white/70 text-sm mb-2">الاسم بالكامل</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="أدخل اسمك الكامل"
                      className="input-field w-full"
                      style={{ textAlign: 'right', direction: 'rtl' }}
                      required
                    />
                  </div>

                  {/* Transfer Time */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">حدد الوقت</label>
                    <input
                      type="time"
                      value={formData.transferTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, transferTime: e.target.value }))}
                      className="input-field w-full"
                      required
                    />
                  </div>

                  {/* Amount Input */}
                  <div className="mb-4">
                    <label className="block text-white/70 text-sm mb-2">المبلغ</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`أدخل المبلغ (${currency.toUpperCase()})`}
                      className="input-field w-full"
                      required
                    />
                  </div>
                </>
              )}

              {/* Phone Number (common for all currencies) */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="09XXXXXXXX"
                  className="input-field w-full"
                  style={{ textAlign: 'right', direction: 'rtl' }}
                  required
                />
              </div>
            </>
          )}
        </div>

        {/* Payment Proof - Only show for USDT */}
        {currency === 'usdt' && (
          <div className="card-primary mb-6">
            <label className="block text-white font-medium mb-3">
              إثبات الدفع
            </label>
            <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="cursor-pointer block"
              >
                {imageSelected ? (
                  <div className="text-green-400">
                    <span className="text-2xl mb-2">📷</span>
                    <p className="text-sm">تم اختيار الصورة ✔</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-2xl mb-2">📤</span>
                    <p className="text-white/70 text-sm">اضغط لرفع الصورة</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={
            (currency === 'usdt' ? (!amount || !imageSelected) : !amount) || 
            confirming || 
            confirmed
          }
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {confirming ? 'جاري التأكيد...' : confirmed ? 'تمت العملية بنجاح ✅' : (operation === 'buy' ? 'تأكيد الدفع' : 'تأكيد البيع')}
        </button>

        {/* Success Message */}
        {confirmed && (
          <div className="bg-green-600/20 border border-green-600/50 rounded-xl p-4 text-center mb-6 animate-fade-in">
            <p className="text-green-400 font-medium">طلبك تحت المراجعة</p>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900 via-purple-900/95 to-purple-800/90 backdrop-blur-xl border-t border-white/10 rounded-t-3xl shadow-2xl">
          <div className="max-w-mobile mx-auto px-6 py-4">
            <div className="flex justify-around items-center">
              {/* WhatsApp */}
              <a
                href="https://wa.me/393895724547"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21l1.65-3.75a11 11 0 012.2-12.4 11 11 0 0115.6 0 11 0 011.3 16.3 11 11 0 01-12.4 2.2L3 21"/>
                  <path d="M9 10a.5.5 0 011 0c0 2 1 3 3 3a.5.5 0 010 1c-2.5 0-4-1.5-4-4z"/>
                </svg>
                <span className="text-xs font-medium">WhatsApp</span>
              </a>

              {/* Market - Active */}
              <a
                href="https://coinmarketcap.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 py-3 px-4 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 relative"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 4px 12px rgba(147,51,234,0.2)'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M3 3v18h18"/>
                  <path d="M7 16l4-8 4 6 4-4"/>
                </svg>
                <span className="text-xs font-medium text-white">Market</span>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/1CHFuXq3zt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
                <span className="text-xs font-medium">Facebook</span>
              </a>

              {/* Privacy */}
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-gray-400 hover:text-white"
              >
                <span className="text-xl">🔐</span>
                <span className="text-xs font-medium">Privacy</span>
              </button>

              {/* Mail */}
              <a
                href="mailto:elarenha@gmail.com"
                className="flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-gray-400 hover:text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-10 5L2 7"/>
                </svg>
                <span className="text-xs font-medium">Mail</span>
              </a>
            </div>
          </div>
      </div>
    </div>
        
        {/* Floating Draw Button */}
        <button
        onClick={() => setShowDraw(true)}
        style={{
          position: 'fixed',
          bottom: '90px',
          left: '20px',
          width: '65px',
          height: '65px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #6d28d9 100%)',
          border: 'none',
          boxShadow: '0 8px 32px rgba(147, 51, 234, 0.4), 0 4px 12px rgba(147, 51, 234, 0.2)',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          zIndex: 9999,
          transition: 'all 0.3s ease',
          animation: 'shake 1.2s infinite'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 40px rgba(147, 51, 234, 0.6), 0 6px 16px rgba(147, 51, 234, 0.3)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 32px rgba(147, 51, 234, 0.4), 0 4px 12px rgba(147, 51, 234, 0.2)';
        }}
      >
        <div style={{ fontSize: '20px' }}>{"\ud83c\udf81"}</div>
        <div style={{ fontSize: '8px', color: 'white', fontWeight: 'bold', lineHeight: '1' }}>{"\u0633\u062d\u0628 \u0623\u0633\u0628\u0648\u0639\u064a"}</div>
        <div style={{ fontSize: '8px', color: 'white', fontWeight: 'bold' }}>1 USDT</div>
      </button>
        </div>
      )}
    </div>
  );
}

export default App;
