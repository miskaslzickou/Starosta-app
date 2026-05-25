import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})
// preload.ts
contextBridge.exposeInMainWorld('api', {
  loadProjects: () => ipcRenderer.invoke('load-projects'),
  saveProjects: (projects:any) => ipcRenderer.invoke('save-projects', projects),
  loadSettings: () => ipcRenderer.invoke('load-settings'),
  saveSettings: (settings:any) => ipcRenderer.invoke('save-settings', settings),
  loadVehicles: () => ipcRenderer.invoke('load-vehicles'),
  saveVehicles: (vehicles: any) => ipcRenderer.invoke('save-vehicles', vehicles),
  loadBuildings: () => ipcRenderer.invoke('load-buildings'),
  saveBuildings: (buildings: any) => ipcRenderer.invoke('save-buildings', buildings),
  loadSmlouvy: () => ipcRenderer.invoke('load-smlouvy'),
  saveSmlouvy: (smlouvy: any) => ipcRenderer.invoke('save-smlouvy', smlouvy),
  loadUsneseni: () => ipcRenderer.invoke('load-usneseni'),
  saveUsneseni: (usneseni: any) => ipcRenderer.invoke('save-usneseni', usneseni),
  exportData: () => ipcRenderer.invoke('export-data'),
  importData: () => ipcRenderer.invoke('import-data'),
  relaunch: () => ipcRenderer.invoke('relaunch'),
})