import React, { useEffect, useState, useCallback } from 'react';
import InputPage from './InputPage';
import QRCodePage from './QRCodePage';
import SuccessPage from './SuccessPage';
import { lightTheme, darkTheme } from '../theme/theme';
import { otpManager } from '../utils/otpManager';

const OTPFlow = ({ 
  secretKey, 
  apiEndpoint = 'http://localhost:3002/api/check-otp-availability',
  onError,
  onSuccess,
  initialTheme = 'light',
  customTheme,
  containerStyle = {},
  onComplete,
  phoneNumber="0000000000",
  ...props 
}) => {
  const [currentPage, setCurrentPage] = useState('input');
  const [submittedData, setSubmittedData] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(initialTheme === 'dark');
  const [otpType, setOtpType] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentTheme = customTheme || (isDarkTheme ? darkTheme : lightTheme);

  // ✅ API Call Logic extracted into reusable function
  const fetchOTPConfig = useCallback(async () => {
    if (!secretKey) {
      const errorMsg = 'Secret key is required';
      setError(errorMsg);
      onError?.(errorMsg);
      onComplete?.({ stage: 'error', error: errorMsg });
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretKey })
      });

      const result = await response.json();

      if (result.success) {
        const otpTypeDetails = {
          otpType: result.data.otpType,
          otpDigits: result.data.otpDigits,
          remainingRequests: result.data.remainingRequests,
          canGenerateOTP: result.data.canGenerateOTP
        };

        const type = result.data.otpType;
        const digits = otpTypeDetails.otpDigits;
        let formatCode = 0;

        if (type === 'numeric') formatCode = 1;
        else if (type === 'alphanumeric') formatCode = 2;
        else if (type === 'complex') formatCode = 3;

        const logicCode = Math.floor(Math.random() * 5);
        const finalType = digits * 100 + formatCode * 10 + logicCode;

        console.log('OTP Config → digits:', digits, 'format:', formatCode, 'logic:', logicCode, '→ type:', finalType);
        setOtpType(finalType);
      } else {
        let errorMsg = 'An error occurred';

        if (response.status === 400 && result.message === 'OTP request limit exhausted') {
          errorMsg = 'OTP request limit has been exhausted. Please contact support.';
        } else if (response.status === 404) {
          errorMsg = 'Invalid authentication key. Please check your configuration.';
        } else if (response.status === 403) {
          errorMsg = 'User account is inactive. Please contact support.';
        } else {
          errorMsg = result.message || 'An error occurred';
        }

        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (error) {
      console.error('Network error:', error);
      const errorMsg = 'Network error occurred. Please try again.';
      setError(errorMsg);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [secretKey, apiEndpoint, onError]);

  // ✅ Initial Load
  useEffect(() => {
    fetchOTPConfig();
  }, [fetchOTPConfig]);

  const handleSubmit = (data) => {
    setSubmittedData(data);
    setCurrentPage('qr');
    onComplete?.({ stage: 'submitted', mobile: data });
  };
  

  const handleBack = () => {
    setCurrentPage('input');
    setSubmittedData('');
    otpManager.clearOTP();
  };

  const handleVerificationSuccess = () => {
    setCurrentPage('success');
    onComplete?.({ stage: 'verified', mobile: submittedData });
  };
  

  const handleSuccessComplete = () => {
    localStorage.setItem("otpVerified", "true");
    setCurrentPage('input');
    setSubmittedData('');
    otpManager.clearOTP();
    onSuccess?.();
  };

  const handleRestart = () => {
    setCurrentPage('input');
    setSubmittedData('');
    otpManager.clearOTP();
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const defaultContainerStyle = {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: currentTheme.cardBackground,
    borderRadius: '20px',
    boxShadow: `0 20px 40px ${currentTheme.shadow}`,
    border: `1px solid ${currentTheme.border}`,
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const finalContainerStyle = {
    ...defaultContainerStyle,
    ...containerStyle
  };

  if (isLoading) {
    return (
      <div style={finalContainerStyle}>
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: currentTheme.textPrimary 
        }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={finalContainerStyle}>
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          color: currentTheme.error || '#ff4444' 
        }}>
          <div>Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: currentTheme.primary,
              color: currentTheme.textPrimary,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={finalContainerStyle} {...props}>
      {currentPage === 'input' &&  (
        <InputPage
          onSubmit={handleSubmit}
          theme={currentTheme}
          isDark={isDarkTheme}
          type1={otpType}
          onToggleTheme={toggleTheme}
          phoneNumber={phoneNumber}
          onReset={fetchOTPConfig} // ✅ This triggers the API call again
        />
      )}
      {currentPage === 'qr' && (
        <QRCodePage
          qrData={submittedData}
          onBack={handleBack}
          onVerificationSuccess={handleVerificationSuccess}
          theme={currentTheme}
          isDark={isDarkTheme}
          type1={otpType}
        />
      )}
      {currentPage === 'success' && (
        <SuccessPage
          onRestart={handleRestart}
          theme={currentTheme}
          onComplete={handleSuccessComplete}
        />
      )}
    </div>
  );
};

export default OTPFlow;