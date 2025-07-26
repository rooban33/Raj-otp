class SecureOTPManager {
  constructor() {
    this.otpData = null;
    this.type1 = 0;
    this.generatedAt = null;
    this.attempts = 0;
    this.maxAttempts = 3;
    this.expiryMinutes = 5;
  }

  generateOTP(digitString, type1) {
    // Decode type1
    let v = type1;
    const getType = v % 10;
    v = Math.floor(v / 10);
    const formatType = v % 10;
    v = Math.floor(v / 10);
    const digits = v;
  
    // Step 1: Break digitString into 2-char pairs
    const pairs = [];
    for (let i = 0; i < digitString.length; i += 2) {
      pairs.push(digitString.slice(i, i + 2));
    }
  
    // Step 2: Reduce each pair to a single digit (digit sum reduction)
    const singleDigits = pairs.map(pair => {
      let sum = parseInt(pair[0]) + parseInt(pair[1]);
      while (sum >= 10) {
        sum = Math.floor(sum / 10) + (sum % 10);
      }
      return sum;
    });
  
    // Step 3: Transformation logic (getType)
    let transformedDigits = [];
  
    switch (getType) {
      case 0: {
        let reversed = singleDigits.slice().reverse();
        const firstTwo = reversed.slice(0, 2);
        const remaining = reversed.slice(2);
        let shifted = remaining.concat(firstTwo);
        if (shifted.length > 3) [shifted[1], shifted[3]] = [shifted[3], shifted[1]];
        transformedDigits = shifted;
        break;
      }
      case 1: {
        const key = 'DECAF';
        const keyAscii = Array.from(key).map(c => c.charCodeAt(0));
        transformedDigits = singleDigits.map((digit, i) => digit & (keyAscii[i % keyAscii.length] % 10));
        break;
      }
      case 2: {
        transformedDigits = singleDigits.map(d => d >> 1);
        break;
      }
      case 3: {
        transformedDigits = singleDigits.map((d, i) => {
          let product = d * singleDigits[(i + 1) % singleDigits.length];
          while (product >= 10) {
            product = Math.floor(product / 10) + (product % 10);
          }
          return product;
        });
        break;
      }
      default: {
        transformedDigits = singleDigits.map((d, i) => {
          let product = d * singleDigits[(i - 1 + singleDigits.length) % singleDigits.length];
          while (product >= 10) {
            product = Math.floor(product / 10) + (product % 10);
          }
          return product;
        });
      }
    }
  
    // Step 4: Create digitOtp and apply Flutter-style digit length logic
    let digitOtp = transformedDigits.join('');
  
    // Flutter-style digit adjustment
    if (digits === 4) {
      digitOtp = digitOtp.slice(0, -1);
    } else if (digits === 6) {
      const last = parseInt(digitOtp[digitOtp.length - 1]);
      digitOtp += (last >> 1).toString();
    } else if (digits === 7) {
      const last = parseInt(digitOtp[digitOtp.length - 1]);
      const s1 = last >> 1;
      const s2 = s1 >> 1;
      digitOtp += s1.toString() + s2.toString();
    }
  
    // Truncate to correct length: base digits + any appended shift
    digitOtp = digitOtp.slice(0, digits + (digits === 6 ? 1 : 0) + (digits === 7 ? 2 : 0));
  
    // Step 5: Apply format type
    let finalOtp = '';
  
    if (formatType === 0) {
      finalOtp = digitOtp;
    } else if (formatType === 1) {
      finalOtp = digitOtp.split('').map(d => String.fromCharCode('A'.charCodeAt(0) + parseInt(d))).join('');
    } else if (formatType === 2) {
      const chars = digitOtp.split('');
      let formatted = '';
      for (let i = 0; i < chars.length; i += 2) {
        formatted += chars[i]; // digit
        if (i + 1 < chars.length) {
          const nextDigit = parseInt(chars[i + 1]);
          formatted += String.fromCharCode('A'.charCodeAt(0) + nextDigit);
        }
      }
      finalOtp = formatted;
    } else if (formatType === 3) {
      const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];
      const chars = digitOtp.split('');
      let formatted = '';
      for (let i = 0; i < chars.length; i += 3) {
        if (i < chars.length) formatted += chars[i]; // digit
        if (i + 1 < chars.length) {
          const d = parseInt(chars[i + 1]);
          formatted += String.fromCharCode('A'.charCodeAt(0) + d); // letter
        }
        if (i + 2 < chars.length) {
          const d = parseInt(chars[i + 2]);
          formatted += specialChars[d]; // special char
        }
      }
      finalOtp = formatted;
    }
  
    // Optional tracking
    this.otpData = finalOtp;
    this.generatedAt = new Date();
    this.attempts = 0;

    console.log("Final OTP:",finalOtp);
  
    return finalOtp;
  }


  verifyOTP(inputOTP) {
    if (!this.otpData) {
      return { success: false, message: 'No OTP generated' };
    }

    if (this.attempts >= this.maxAttempts) {
      this.clearOTP();
      return { success: false, message: 'Maximum attempts exceeded. Please generate a new OTP.' };
    }

    this.attempts++;

    if (this.otpData === inputOTP) {
      this.clearOTP();
      return { success: true, message: 'OTP verified successfully!' };
    } else {
      const remainingAttempts = this.maxAttempts - this.attempts;
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      };
    }
  }

  clearOTP() {
    this.otpData = null;
    this.generatedAt = null;
    this.attempts = 0;
  }
}

// export const otpManager = new SecureOTPManager();
export const otpManager = new SecureOTPManager();
