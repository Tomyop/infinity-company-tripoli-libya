import { useState } from 'react';

const Draw = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    paymentProof: null
  });
  const [imageSelected, setImageSelected] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        paymentProof: file
      }));
      setImageSelected(true);
    }
  };

  const handleSubmit = () => {
    const message = `اشتراك في السحب الأسبوعي 🎁
الاسم: ${formData.fullName}
رقم الهاتف: ${formData.phoneNumber}
الشبكة: TRC20
تم الدفع: 1 USDT`;

    const whatsappUrl = `https://wa.me/393895724547?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-950">
      {/* Back Button */}
      <button
        onClick={() => window.parent.postMessage({ type: 'HIDE_DRAW' }, '*')}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ transform: 'rotate(180deg)' }}>
          <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
        </svg>
      </button>
      <div className="max-w-mobile mx-auto px-4 py-6 pb-20">
        {/* Form Fields */}
        <div className="card-primary mb-6">
          <h2 className="text-xl font-bold text-white mb-4">بيانات السحب الأسبوعي</h2>
          
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-white/70 text-sm mb-2">الاسم بالكامل</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="أدخل اسمك الكامل"
              className="input-field w-full"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-white/70 text-sm mb-2">رقم الهاتف</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="09XXXXXXXX"
              className="input-field w-full"
              style={{ textAlign: 'right', direction: 'rtl' }}
              required
            />
          </div>

          {/* Payment Proof */}
          <div className="mb-4">
            <label className="block text-white/70 text-sm mb-2">رفع صورة (إثبات الدفع)</label>
            <div className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="draw-payment-proof"
              />
              <label
                htmlFor="draw-payment-proof"
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
        </div>

        {/* Payment Info Card */}
        <div className="card-primary mb-6">
          <h3 className="text-lg font-bold text-white mb-4">بيانات الدفع</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
              <span className="text-white/70 text-sm">الشبكة:</span>
              <span className="text-white text-sm font-medium">TRC20</span>
            </div>
            
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="text-white/70 text-sm mb-1">عنوان المحفظة:</div>
              <div className="text-white text-sm break-all font-mono">
                TMm56VcNaD5bcWCu7wGJvySEZNgrdUz5Ly
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="text-center mb-6">
          <span className="text-white/80 text-sm">قيمة الاشتراك: </span>
          <span className="text-white font-bold">1 USDT</span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!formData.fullName || !formData.phoneNumber || !imageSelected}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          تأكيد الاشتراك
        </button>
      </div>
    </div>
  );
};

export default Draw;
