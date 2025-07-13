import React, { useEffect, useRef, useState } from 'react';
import QRCodeCanvas from './QRCodeCanvas';
import { otpManager } from '../utils/otpManager';

const QRCodePage = ({ qrData, onBack, onVerificationSuccess, theme, isDark, type1 }) => {
  const [otp, setOtp] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const timerRef = useRef(null);

  // Helper to extract digits and formatType from type1
  const parseType1 = (type1) => {
    let v = type1;
    const logicType = v % 10;
    v = Math.floor(v / 10);
    const formatType = v % 10; // 0=numeric, 1=alpha, 2=alphanumeric, 3=complex
    v = Math.floor(v / 10);
    const digits = v;
    return { digits, formatType, logicType };
  };

  const { digits: expectedLength, formatType } = parseType1(type1);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setVerificationMessage('⏱️ OTP expired. Please go back and generate a new one.');
          setMessageType('error');
          setTimeout(onBack, 3000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const handleOtpChange = (e) => {
    const input = e.target.value;
    // Convert only lowercase letters to uppercase
    const converted = input.replace(/[a-z]/g, (char) => char.toUpperCase());

    if (converted.length <= expectedLength) {
      setOtp(converted);
      setVerificationMessage('');
    }
  };

  const handleOtpSubmit = () => {
    if (otp.length >= expectedLength) {
      const result = otpManager.verifyOTP(otp);
      if (result.success) {
        setVerificationMessage(result.message);
        setMessageType('success');
        setTimeout(onVerificationSuccess, 2000);
      } else {
        setVerificationMessage(result.message);
        setMessageType('error');
        if (result.message.includes('Maximum attempts') || result.message.includes('expired')) {
          setTimeout(onBack, 3000);
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && otp.length >= expectedLength) {
      handleOtpSubmit();
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success': return theme.success;
      case 'error': return theme.danger;
      case 'warning': return theme.warning;
      default: return theme.textSecondary;
    }
  };

  const getFormatLabel = () => {
    switch (formatType) {
      case 0: return 'Numeric (e.g. 12345)';
      case 1: return 'Alphabetic (A–J)';
      case 2: return 'Alphanumeric (e.g. a1b2)';
      case 3: return 'Complex (e.g. a!b@)';
      default: return 'Unknown Format';
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
        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
        borderRadius: '16px',
        padding: '48px 32px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
        maxWidth: '90%',
        width: '480px',
        textAlign: 'center',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: 'transparent',
            color: theme.textSecondary,
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = theme.border;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          ×
        </button>

        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            color: theme.text,
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            Scan & Verify
          </h1>
          <p style={{
            color: theme.textSecondary,
            fontSize: '16px',
            lineHeight: '1.5'
          }}>
            Scan the QR code and enter the OTP to continue
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <QRCodeCanvas
            value={qrData}
            size={200}
            isDark={isDark}
            theme={theme}
            type1={type1}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            onKeyPress={handleKeyPress}
            placeholder={`Enter OTP`}
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '16px 20px',
              fontSize: '20px',
              border: `2px solid ${otp ? theme.borderActive : theme.border}`,
              borderRadius: '12px',
              textAlign: 'center',
              background: theme.cardBackground,
              color: theme.text,
              fontWeight: '600',
              outline: 'none',
              letterSpacing: formatType === 0 || formatType === 1 ? '8px' : '1px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: '500',
          color: timeLeft > 10 ? theme.textSecondary : theme.danger
        }}>
          ⏳ Time left: {timeLeft} seconds
        </div>

        {verificationMessage && (
          <div style={{
            marginBottom: '24px',
            padding: '16px 20px',
            backgroundColor: getMessageColor() + '15',
            color: getMessageColor(),
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            border: `1px solid ${getMessageColor()}30`
          }}>
            {verificationMessage}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleOtpSubmit}
            disabled={otp.length < expectedLength}
            style={{
              width: '100%',
              maxWidth: '240px',
              padding: '16px 24px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: otp.length >= expectedLength ? theme.success : theme.textSecondary,
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: otp.length >= expectedLength ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              transform: otp.length >= expectedLength ? 'none' : 'scale(0.98)',
              boxShadow: otp.length >= expectedLength ? `0 4px 12px ${theme.success}40` : 'none'
            }}
            onMouseEnter={(e) => {
              if (otp.length >= expectedLength) {
                e.target.style.backgroundColor = theme.successDark;
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 8px 24px ${theme.success}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (otp.length >= expectedLength) {
                e.target.style.backgroundColor = theme.success;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = `0 4px 12px ${theme.success}40`;
              }
            }}
          >
            ✓ Verify OTP
          </button>

          <button
            onClick={onBack}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              backgroundColor: 'transparent',
              color: theme.textSecondary,
              border: `1px solid ${theme.border}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = theme.surface;
              e.target.style.color = theme.text;
              e.target.style.borderColor = theme.borderActive;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = theme.textSecondary;
              e.target.style.borderColor = theme.border;
            }}
          >
            ← Back to Input
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;