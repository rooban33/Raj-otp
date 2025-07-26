export default OTPFlow;
declare function OTPFlow({ secretKey, apiEndpoint, onError, onSuccess, initialTheme, customTheme, containerStyle, phoneNumber, ...props }: {
    [x: string]: any;
    secretKey: any;
    apiEndpoint?: string | undefined;
    onError: any;
    onSuccess: any;
    initialTheme?: string | undefined;
    customTheme: any;
    containerStyle?: {} | undefined;
    phoneNumber?: string | undefined;
}): any;
