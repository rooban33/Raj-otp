export const otpManager: SecureOTPManager;
declare class SecureOTPManager {
    otpData: string | null;
    type1: number;
    generatedAt: Date | null;
    attempts: number;
    maxAttempts: number;
    expiryMinutes: number;
    generateOTP(digitString: any, type1: any): string;
    verifyOTP(inputOTP: any): {
        success: boolean;
        message: string;
    };
    clearOTP(): void;
}
export {};
