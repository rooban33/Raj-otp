export default InputPage;
declare function InputPage({ onSubmit, phoneNumber, onReset, theme, isDark, type1 }: {
    onSubmit?: (() => void) | undefined;
    phoneNumber: any;
    onReset?: (() => void) | undefined;
    theme?: {
        primary: string;
        primaryDark: string;
        text: string;
        textSecondary: string;
        border: string;
        borderActive: string;
        cardBackground: string;
        success: string;
    } | undefined;
    isDark?: boolean | undefined;
    type1?: string | undefined;
}): any;
