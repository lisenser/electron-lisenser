export interface Bridge {
    activateKey: (key: string) => Promise<string | void>
    openBuyURL: () => void
    resetLicense: (otp: string) => Promise<string | void>
    resendOtp: () => Promise<void>
}

declare global {
    interface Window {
        bridge: Bridge
    }
}
