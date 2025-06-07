import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('bridge', {
    resetLicense: (otp: string): Promise<boolean> => ipcRenderer.invoke('license:reset', otp),
    resendOtp: (): Promise<void> => ipcRenderer.invoke('license:otp:resend'),
})
