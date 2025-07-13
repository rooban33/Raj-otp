export default OTPFlow;
declare function OTPFlow({ secretKey, apiEndpoint, onError, onSuccess, onComplete, initialTheme, customTheme, containerStyle, ...props }: {
    [x: string]: any;
    secretKey: any;
    apiEndpoint?: string | undefined;
    onError: any;
    onSuccess: any;
    onComplete: any;
    initialTheme?: string | undefined;
    customTheme: any;
    containerStyle?: {} | undefined;
}): any;
