export interface Bridge {
    activateKey: (key: string) => Promise<string | void>
    openBuyURL: () => void
}

declare global {
    interface Window {
        bridge: Bridge
    }
}
