import { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if already shown in this session
    const sessionShown = sessionStorage.getItem('installPromptShown');
    if (sessionShown) {
      setHasBeenShown(true);
    }

    // Detect iOS
    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsIOS(isAppleDevice && !isStandalone);

    // Listen for beforeinstallprompt (Android)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt only if not already shown
      if (!hasBeenShown && !sessionShown) {
        setTimeout(() => {
          setShowPrompt(true);
          sessionStorage.setItem('installPromptShown', 'true');
        }, 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show instructions after delay if not standalone
    if (isAppleDevice && !isStandalone && !hasBeenShown && !sessionShown) {
      setTimeout(() => {
        setShowPrompt(true);
        sessionStorage.setItem('installPromptShown', 'true');
      }, 5000); // Show after 5 seconds for iOS
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [hasBeenShown]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #1a0142 0%, #4a1a8c 50%, #6a2dc9 100%)',
        padding: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        animation: 'slideUp 0.5s ease-out',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ color: 'white', marginBottom: '12px', fontSize: '14px' }}>
          {isIOS ? (
            <>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                Install Infinity App
              </div>
              <div style={{ marginBottom: '12px', lineHeight: '1.4' }}>
                Tap <strong>Share</strong> button below, then <strong>Add to Home Screen</strong>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px',
                marginBottom: '12px',
                fontSize: '12px',
                opacity: '0.8'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                Share icon is at the bottom of your screen
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
                Install Infinity App
              </div>
              <div style={{ marginBottom: '12px', lineHeight: '1.4' }}>
                Get instant access to USDT exchange rates
              </div>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              Install App
            </button>
          )}
          
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 'medium',
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
            Maybe Later
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default InstallPrompt;
