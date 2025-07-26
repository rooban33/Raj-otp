import React, { useState, useEffect } from 'react';
import { otpManager } from '../utils/otpManager';

const InputPage = ({
  onSubmit = () => {},
  phoneNumber,
  onReset =()=>{},
  theme = {
    primary: '#007bff',
    primaryDark: '#0056b3',
    text: '#333',
    textSecondary: '#666',
    border: '#ddd',
    borderActive: '#007bff',
    cardBackground: '#fff',
    success: '#28a745'
  },
  isDark = false,
  type1 = 'default'
}) => {
  const dynamicTheme = {
    primary: theme.primary,
    primaryDark: theme.primaryDark,
    text: isDark ? '#ffffff' : theme.text,
    textSecondary: isDark ? '#b3b3b3' : theme.textSecondary,
    border: isDark ? '#404040' : theme.border,
    borderActive: theme.borderActive,
    cardBackground: isDark ? '#2d2d2d' : theme.cardBackground,
    success: theme.success,
    backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0'
  };

  const [inputData, setInputData] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [verified, setVerified] = useState(false);

  // Generate unique ID for this component instance to avoid CSS conflicts
  const componentId = React.useRef(`otp-input-${Math.random().toString(36).substr(2, 9)}`).current;

  useEffect(() => {
    const stored = localStorage.getItem("otpVerified") === "true";
    setVerified(stored);
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input) && input.length <= 10) {
      setInputData(input);
    }
  };

  const handleSubmit = () => {
    const dataToSubmit = inputData || phoneNumber;
    if (dataToSubmit.length === 10) {
      const key = "9D941AF69FAA5E041172D29A8B459BB4";
      otpManager.generateOTP(dataToSubmit, type1);
      setShowPopup(false);
      onSubmit(dataToSubmit);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputData.length === 10) {
      handleSubmit();
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setInputData('');
  };

  const handleResetVerification = () => {
    setVerified(false);
    localStorage.removeItem("otpVerified");
    onReset();
  };

  // Scoped styles using the unique component ID
  const styles = `
    .${componentId}-button-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background-color: ${dynamicTheme.backgroundColor};
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      margin: 0 auto;
    }

    .${componentId}-auth-button {
      padding: 16px 32px;
      font-size: 18px;
      font-weight: 600;
      background-color: ${verified ? theme.success : dynamicTheme.primary};
      color: white;
      border: none;
      border-radius: 12px;
      cursor: ${verified ? 'not-allowed' : 'pointer'};
      box-shadow: 0 6px 20px ${verified ? theme.success : dynamicTheme.primary}40;
      transition: all 0.3s ease;
      opacity: ${verified ? '0.8' : '1'};
    }

    .${componentId}-auth-button:hover:enabled {
      background-color: ${theme.primaryDark};
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${theme.primary}50;
    }

    .${componentId}-auth-button:disabled {
      transform: none;
      cursor: not-allowed;
    }

    .${componentId}-reset-button {
      padding: 8px 16px;
      font-size: 14px;
      background-color: transparent;
      color: ${dynamicTheme.textSecondary};
      border: 1px solid ${dynamicTheme.border};
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .${componentId}-reset-button:hover {
      background-color: ${dynamicTheme.border};
      color: ${dynamicTheme.text};
    }

    .${componentId}-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    }

    .${componentId}-popup-content {
      background-color: ${isDark ? '#1e1e1e' : '#ffffff'};
      border-radius: 16px;
      padding: 48px 32px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
      max-width: 90%;
      width: 400px;
      text-align: center;
      position: relative;
    }

    .${componentId}-close-button {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background-color: transparent;
      color: ${dynamicTheme.textSecondary};
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .${componentId}-close-button:hover {
      background-color: ${dynamicTheme.border};
    }

    .${componentId}-popup-header {
      margin-bottom: 32px;
    }

    .${componentId}-icon-container {
      width: 64px;
      height: 64px;
      background-color: ${theme.primary};
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px auto;
      box-shadow: 0 8px 24px ${theme.primary}40;
    }

    .${componentId}-icon {
      color: white;
      font-size: 28px;
      font-weight: bold;
    }

    .${componentId}-title {
      color: ${dynamicTheme.text};
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }

    .${componentId}-subtitle {
      color: ${dynamicTheme.textSecondary};
      font-size: 16px;
      margin: 0;
      line-height: 1.5;
    }

    .${componentId}-input-section {
      margin-bottom: 32px;
    }

    .${componentId}-digit-input {
      width: 100%;
      max-width: 300px;
      padding: 16px 20px;
      font-size: 18px;
      border: 2px solid ${inputData ? theme.borderActive : theme.border};
      border-radius: 12px;
      text-align: center;
      background: ${theme.cardBackground};
      color: ${theme.text};
      outline: none;
      letter-spacing: 2px;
      font-weight: 500;
      box-sizing: border-box;
    }

    .${componentId}-input-status {
      margin-top: 12px;
      font-size: 14px;
      color: ${dynamicTheme.textSecondary};
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .${componentId}-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${dynamicTheme.border};
    }

    .${componentId}-status-dot.complete {
      background-color: ${dynamicTheme.success};
    }

    .${componentId}-submit-button {
      width: 100%;
      max-width: 300px;
      padding: 16px 24px;
      font-size: 16px;
      font-weight: 600;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .${componentId}-submit-button.enabled {
      background-color: ${theme.primary};
      color: white;
      box-shadow: 0 4px 12px ${theme.primary}40;
    }

    .${componentId}-submit-button.enabled:hover {
      background-color: ${theme.primaryDark};
      transform: translateY(-2px);
      box-shadow: 0 8px 24px ${theme.primary}50;
    }

    .${componentId}-submit-button.disabled {
      background-color: ${dynamicTheme.textSecondary};
      color: white;
      cursor: not-allowed;
      transform: scale(0.98);
    }
  `;

  // ✅ Initial Authenticate Button Screen
  if (!showPopup) {
    return (
      <div className={`${componentId}-button-container`}>
        <button
           onClick={() => {
            if (phoneNumber !== "0000000000") {
              setInputData(phoneNumber);
              handleSubmit(); // This will use the phoneNumber directly
            } else {
              setShowPopup(true);
            }
          }}
          className={`${componentId}-auth-button`}
          disabled={verified}
        >
          {verified ? '✓ Already Authenticated' : 'Authenticate OTP'}
        </button>
        
        {verified && (
          <button
            onClick={handleResetVerification}
            className={`${componentId}-reset-button`}
          >
            Reset Authentication
          </button>
        )}

        <style>{styles}</style>
      </div>
    );
  }

  // ✅ OTP Input Popup
  return (
    <div className={`${componentId}-popup-overlay`}>
      <div className={`${componentId}-popup-content`}>
        <button
          onClick={handleClosePopup}
          className={`${componentId}-close-button`}
        >
          ×
        </button>

        <div className={`${componentId}-popup-header`}>
          <div className={`${componentId}-icon-container`}>
            <span className={`${componentId}-icon`}>🔐</span>
          </div>
          <h1 className={`${componentId}-title`}>Secure Authentication</h1>
          <p className={`${componentId}-subtitle`}>Enter your 10-digit number to generate a secure OTP</p>
        </div>

        <div className={`${componentId}-input-section`}>
          <input
            type="text"
            value={inputData}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            maxLength={10}
            placeholder="Enter 10 digits"
            className={`${componentId}-digit-input`}
          />
          <div className={`${componentId}-input-status`}>
            <div className={`${componentId}-status-dot ${inputData.length === 10 ? 'complete' : ''}`} />
            {inputData.length}/10 digits entered
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={inputData.length !== 10}
          className={`${componentId}-submit-button ${inputData.length === 10 ? 'enabled' : 'disabled'}`}
        >
          Generate Secure OTP →
        </button>
      </div>

      <style>{styles}</style>
    </div>
  );
};

export default InputPage;