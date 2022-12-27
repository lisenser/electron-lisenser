import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('bridge', {
    activateKey: (key: string) => ipcRenderer.invoke('license:activate', key),
    openBuyURL: () => ipcRenderer.send('license:buy'),
})
