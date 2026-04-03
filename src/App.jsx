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

  // User form data
  const [formData, setFormData] = useState({
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
    const message = `
طلب جديد 🚀

العملية: ${operation === 'buy' ? 'شراء' : 'بيع'}
العملة: USDT
طريقة الدفع: ${paymentMethod === 'bank' ? 'تحويل بنكي' : 'نقدي'}
المبلغ: ${amount} USDT
السعر: ${getCurrentPrice()} د.ل
الإجمالي: ${calculateTotal().toFixed(2)} د.ل

---

بيانات الزبون:
${operation === 'buy' ? 
  `عنوان المحفظة: ${formData.walletAddress || walletData.address}
الشبكة: BEP20` : 
  `الحساب البنكي: ${formData.bankAccount || bankData.account}
الآيبان: ${formData.iban || bankData.iban}`}

---

بياناتنا:
البنك: ${bankData.bank}
الفرع: ${bankData.branch}
الحساب: ${bankData.account}
الآيبان: ${bankData.iban}

محفظتنا: ${walletData.address}
الشبكة: ${walletData.network}
    `.trim();

    setShowConfirmImage(true);

    setTimeout(() => {
      setConfirming(false);
      setConfirmed(true);
      
      // Send WhatsApp message
      window.open(`https://wa.me/393895724547?text=${encodeURIComponent(message)}`, '_blank');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950">
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
          <img 
            src={confirmImg}
            alt="Confirmed"
            style={{
              width: "80%",
              maxWidth: "350px",
              borderRadius: "20px"
            }}
          />
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
                      <button
                        onClick={() => copyToClipboard(bankData.bank, 'bank')}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copied.bank ? '✔' : '📋'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الفرع:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{bankData.branch}</span>
                      <button
                        onClick={() => copyToClipboard(bankData.branch, 'branch')}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copied.branch ? '✔' : '📋'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الحساب:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{bankData.account}</span>
                      <button
                        onClick={() => copyToClipboard(bankData.account, 'account')}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copied.account ? '✔' : '📋'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الآيبان:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{bankData.iban}</span>
                      <button
                        onClick={() => copyToClipboard(bankData.iban, 'iban')}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copied.iban ? '✔' : '📋'}
                      </button>
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
              {/* Wallet Data (for sell) */}
              <div className="mb-4">
                <label className="block text-white/70 text-sm mb-2">محفظتنا</label>
                <div className="space-y-2">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xs break-all max-w-[70%]">{walletData.address}</span>
                      <button
                        onClick={() => copyToClipboard(walletData.address, 'walletAddress')}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copied.walletAddress ? '✔' : '📋'}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                    <span className="text-white/70 text-xs">الشبكة:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs">{walletData.network}</span>
                      <button
                        onClick={() => copyToClipboard(walletData.network, 'walletNetwork')}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        {copied.walletNetwork ? '✔' : '📋'}
                      </button>
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
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
