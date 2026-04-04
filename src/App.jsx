import { useState, useEffect } from 'react'
import './index.css'
import welcomeImg from './assets/welcome.jpg'
import confirmImg from './assets/10.jpg'

// Fixed data
const bankData = {
  bank: "مصرف الجمهورية",
  branch: "وكالة البرج",
  account: "1042020000002722",
  iban: "LY950021041042020000002722"
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
  const [showWelcome, setShowWelcome] = useState(true);
  const [operation, setOperation] = useState('buy');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState({});
  const [imageSelected, setImageSelected] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [showConfirmImage, setShowConfirmImage] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  // User form data
  const [formData, setFormData] = useState({
    phone: '',
    walletAddress: '',
    bankAccount: '',
    iban: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timer);
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
    return prices[operation][paymentMethod];
  };

  const calculateTotal = () => {
    if (!amount) return 0;
    const price = getCurrentPrice();
    const subtotal = parseFloat(amount) * price;
    const commission = subtotal * 0.02;
    return subtotal + commission;
  };

  function sendToGoogleSheet(phone, usdt, total) {
    const formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfrpv4L0GwMM3zQC8OWKv9-iq8Uz0VwHY-l9TcMJdC9AHY5sQ/formResponse";

    const formData = new FormData();
    formData.append("entry.1487754017", phone);
    formData.append("entry.446288420", usdt);
    formData.append("entry.1134418766", total);

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
    
    // Prepare WhatsApp message
    const message = `🚀 طلب جديد

📊 تفاصيل العملية:
• العملية: ${operation}
• العملة: USDT
• المبلغ: ${amount} USDT
• السعر: ${getCurrentPrice()} د.ل
• الإجمالي: ${calculateTotal().toFixed(2)} د.ل
• طريقة الدفع: ${paymentMethod}

📞 رقم الهاتف:
${formData.phone}

👤 بيانات الزبون:
• عنوان المحفظة: ${formData.walletAddress || walletData.address}
• الشبكة: ${walletData.network}

🏦 بياناتنا:
• البنك: مصرف الجمهورية
• الفرع: وكالة البرج
• رقم الحساب: 1042020000002722
• الآيبان: LY950021041042020000002722

💼 محفظتنا:
• العنوان: ${walletData.address}
• الشبكة: ${walletData.network}`;

    setShowConfirmImage(true);

    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
      
      // Submit to Google Form
      sendToGoogleSheet(formData.phone, amount, calculateTotal().toFixed(2));
      
      // Store WhatsApp URL for manual button
      const url = `https://wa.me/393895724547?text=${encodeURIComponent(message)}`;
      setWhatsappUrl(url);
    }, 2000);
  };

  // Welcome Screen
  if (showWelcome) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden"
      }}>
        <img 
          src={welcomeImg}
          alt="Welcome"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      </div>
    );
  }

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
      
      <div className="max-w-mobile mx-auto px-4 py-6 pb-20">
        {/* Operation Selection */}
        <div className="card-primary mb-6">
          <h2 className="text-xl font-bold text-white mb-4">اختر العملية</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setOperation('buy')}
              className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                operation === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              🟢 شراء
            </button>
            <button
              onClick={() => setOperation('sell')}
              className={`py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                operation === 'sell'
                  ? 'bg-red-600 text-white'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              🔴 بيع
            </button>
          </div>
        </div>

        {/* Currency Info */}
        <div className="card-primary mb-6">
          <div className="flex justify-between items-center">
            <span className="text-white/70">العملة</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-2xl">₮</span>
                <span className="text-white font-bold">USDT</span>
              </div>
              <span className="text-white/50 text-xs mt-1">1 USDT = 1 USD</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="card-primary mb-6">
          <h3 className="text-lg font-bold text-white mb-3">طريقة الدفع</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPaymentMethod('bank')}
              className={`py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                paymentMethod === 'bank'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              تحويل بنكي
            </button>
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                paymentMethod === 'cash'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              نقدي
            </button>
          </div>
          <div className="mt-3 text-center">
            <span className="text-white/70 text-sm">السعر الحالي: </span>
            <span className="text-white font-bold">{getCurrentPrice()} د.ل</span>
          </div>
        </div>

        {/* Amount Input */}
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
              {/* Bank Data (for buy) */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">بياناتنا البنكية</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">البنك:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{bankData.bank}</span>
                      <span onClick={() => handleCopy(bankData.bank, 'bank')} style={{ cursor: 'pointer' }} className="text-purple-400 hover:text-purple-300 text-xs">
                        {copiedField === 'bank' ? '✔' : '📋'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الفرع:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{bankData.branch}</span>
                      <span onClick={() => handleCopy(bankData.branch, 'branch')} style={{ cursor: 'pointer' }} className="text-purple-400 hover:text-purple-300 text-xs">
                        {copiedField === 'branch' ? '✔' : '📋'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الحساب:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{bankData.account}</span>
                      <span onClick={() => handleCopy(bankData.account, 'account')} style={{ cursor: 'pointer' }} className="text-purple-400 hover:text-purple-300 text-xs">
                        {copiedField === 'account' ? '✔' : '📋'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الآيبان:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{bankData.iban}</span>
                      <span onClick={() => handleCopy(bankData.iban, 'iban')} style={{ cursor: 'pointer' }} className="text-purple-400 hover:text-purple-300 text-xs">
                        {copiedField === 'iban' ? '✔' : '📋'}
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
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">ادخل رقمك لاستلام تأكيد الطلب</label>
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
              {/* Wallet Data (for sell) */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">محفظتنا</label>
                <div className="space-y-2">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs break-all max-w-[70%]">{walletData.address}</span>
                      <span
                        onClick={() => handleCopy(walletData.address, 'walletAddress')}
                        style={{ cursor: 'pointer' }}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copiedField === 'walletAddress' ? '✔' : '📋'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الشبكة:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{walletData.network}</span>
                      <span
                        onClick={() => handleCopy(walletData.network, 'walletNetwork')}
                        style={{ cursor: 'pointer' }}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copiedField === 'walletNetwork' ? '✔' : '📋'}
                      </span>
                    </div>
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
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">ادخل رقمك لاستلام تأكيد الطلب</label>
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

        {/* Payment Proof */}
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

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          disabled={!amount || !imageSelected || confirming || confirmed}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mb-8"
        >
          {confirming ? 'جاري التأكيد...' : confirmed ? 'تمت العملية بنجاح ✅' : 'تأكيد الدفع'}
        </button>

        {/* Success Message */}
        {confirmed && (
          <div className="bg-green-600/20 border border-green-600/50 rounded-xl p-4 text-center mb-6 animate-fade-in">
            <p className="text-green-400 font-medium">طلبك تحت المراجعة</p>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-purple-900/90 backdrop-blur-lg border-t border-white/20">
          <div className="max-w-mobile mx-auto px-4 py-3">
            <div className="grid grid-cols-4 gap-2">
              <a
                href="#"
                className="flex flex-col items-center py-2 text-purple-300 hover:text-white transition-colors"
              >
                <span className="text-lg mb-1">🏠</span>
                <span className="text-xs">Home</span>
              </a>
              <a
                href="https://coinmarketcap.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center py-2 text-purple-300 hover:text-white transition-colors"
              >
                <span className="text-lg mb-1">📊</span>
                <span className="text-xs">Market</span>
              </a>
              <a
                href="https://www.facebook.com/share/1CHFuXq3zt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center py-2 text-purple-300 hover:text-white transition-colors"
              >
                <span className="text-lg mb-1 text-blue-500">f</span>
                <span className="text-xs">Facebook</span>
              </a>
              <a
                href="mailto:elarenha@gmail.com"
                className="flex flex-col items-center py-2 text-purple-300 hover:text-white transition-colors"
              >
                <span className="text-lg mb-1">📧</span>
                <span className="text-xs">Gmail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Floating WhatsApp Button */}
        {showWhatsApp && (
          <a
            href="https://wa.me/393895724547"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-24 right-4 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 transform hover:scale-110 z-50"
          >
            <span className="text-xl">💬</span>
          </a>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
