export interface Bridge {
    activateKey: (key: string) => Promise<string | void>
    openBuyURL: () => void
    resetLicense: (otp: string) => Promise<boolean>
    resendOtp: () => Promise<void>
}

declare global {
    interface Window {
        bridge: Bridge
    }
}
