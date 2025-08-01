declare function OTPFlow({ secretKey, apiEndpoint, onError, onSuccess, initialTheme, customTheme, containerStyle, onComplete, phoneNumber, ...props }: {
    [x: string]: any;
    secretKey: any;
    apiEndpoint?: string | undefined;
    onError: any;
    onSuccess: any;
    initialTheme?: string | undefined;
    customTheme: any;
    containerStyle?: {} | undefined;
    onComplete: any;
    phoneNumber?: string | undefined;
}): any;

export { OTPFlow as default };
