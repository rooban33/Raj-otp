import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { completeTransformation } from '../utils/transform';

const QRCodeCanvas = ({ value, size = 100, isDark = false, theme, type1 }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (!value) return;

    const { alphabetData } = completeTransformation(value, type1);

    QRCode.toDataURL(alphabetData, {
      width: size,
      margin: 1,
      color: {
        dark: isDark ? '#ffffff' : '#000000',
        light: isDark ? '#1e293b' : '#ffffff'
      }
    })
    .then(setQrCodeUrl)
    .catch(err => {
      console.error('QR generation failed:', err);
      setQrCodeUrl(null);
    });
  }, [value, type1]); // Only runs when `value` or `type1` changes — not after

  if (!qrCodeUrl) {
    return (
      <div style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.surface,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        color: theme.textSecondary,
        fontSize: '14px'
      }}>
        Loading QR...
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px',
      backgroundColor: theme.cardBackground,
      borderRadius: '12px',
      boxShadow: `0 4px 12px ${theme.shadow}`,
      border: `1px solid ${theme.border}`,
      display: 'flex',
      justifyContent: 'center'
    }}>
      <img
        src={qrCodeUrl}
        alt="QR Code"
        style={{
          width: size,
          height: size,
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default QRCodeCanvas;