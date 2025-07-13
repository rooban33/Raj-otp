import React from 'react';

const SuccessPage = ({ onComplete = () => {}, theme = {}, onRestart }) => {
  const handleCompleteClick = () => {
    console.log("✅ Authentication completed successfully");
    // Mark as verified and close all popups
    if (typeof onComplete === "function") {
      onComplete(true);
    }
    // Also call onRestart if available (for OTPFlow component)
    if (typeof onRestart === "function") {
      onRestart();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: theme.cardBackground || '#fff',
        borderRadius: '16px',
        padding: '48px 32px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
        textAlign: 'center',
        width: '400px',
        maxWidth: '90%',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: theme.success || '#28a745',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px auto',
          boxShadow: `0 8px 24px ${(theme.success || '#28a745')}40`,
        }}>
          <span style={{ color: 'white', fontSize: '36px' }}>✓</span>
        </div>

        <h1 style={{
          color: theme.text || '#000',
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 12px 0',
          letterSpacing: '-0.5px',
        }}>
          Verification Complete!
        </h1>

        <p style={{
          color: theme.textSecondary || '#444',
          fontSize: '16px',
          margin: '0 0 32px',
          lineHeight: '1.5',
        }}>
          Your OTP has been verified successfully. You can now close this window.
        </p>

        <button
          onClick={handleCompleteClick}
          style={{
            padding: '16px 32px',
            backgroundColor: theme.primary || '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: `0 4px 12px ${(theme.primary || '#007bff')}40`,
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.primaryDark || '#0056b3';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = `0 8px 24px ${(theme.primary || '#007bff')}50`;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = theme.primary || '#007bff';
            e.target.style.transform = 'none';
            e.target.style.boxShadow = `0 4px 12px ${(theme.primary || '#007bff')}40`;
          }}
        >
          Complete Authentication
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;