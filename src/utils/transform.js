import { otpManager } from './otpManager';

export const convertDigitsToAlphabets = (digitString) => {
  const digitToAlphabetMap = {
    '0': 'A', '1': 'B', '2': 'C', '3': 'D', '4': 'E',
    '5': 'F', '6': 'G', '7': 'H', '8': 'I', '9': 'J'
  };

  return digitString
    .split('')
    .map(digit => digitToAlphabetMap[digit])
    .join('');
};

export const transformDigitsForQR = (digitString, type1) => {
  const generateRandomDigits = () => {
    return Math.floor(Math.random() * 900) + 100; // 3-digit random number
  };

  otpManager.type1 = type1;
  console.log("Got 2:",otpManager.type1);

  const first3 = digitString.slice(0, 3);
  const middle4 = digitString.slice(3, 7);
  const last3 = digitString.slice(7, 10);

  let random1 = generateRandomDigits().toString().slice(0, 2);
  const random2 = generateRandomDigits().toString();

  const transformedData =
    last3 + otpManager.type1.toString() + middle4 + random2 + first3;
    console.log("Transformed Data:", transformedData);
  return transformedData;
};

export const completeTransformation = (digitString, type1) => {
  const transformedDigits = transformDigitsForQR(digitString, type1);
  const alphabetData = convertDigitsToAlphabets(transformedDigits);
  return { transformedDigits, alphabetData };
};