"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("api", {
  loadProjects: () => electron.ipcRenderer.invoke("load-projects"),
  saveProjects: (projects) => electron.ipcRenderer.invoke("save-projects", projects),
  loadSettings: () => electron.ipcRenderer.invoke("load-settings"),
  saveSettings: (settings) => electron.ipcRenderer.invoke("save-settings", settings),
  loadVehicles: () => electron.ipcRenderer.invoke("load-vehicles"),
  saveVehicles: (vehicles) => electron.ipcRenderer.invoke("save-vehicles", vehicles),
  loadBuildings: () => electron.ipcRenderer.invoke("load-buildings"),
  saveBuildings: (buildings) => electron.ipcRenderer.invoke("save-buildings", buildings),
  loadSmlouvy: () => electron.ipcRenderer.invoke("load-smlouvy"),
  saveSmlouvy: (smlouvy) => electron.ipcRenderer.invoke("save-smlouvy", smlouvy),
  loadUsneseni: () => electron.ipcRenderer.invoke("load-usneseni"),
  saveUsneseni: (usneseni) => electron.ipcRenderer.invoke("save-usneseni", usneseni),
  exportData: () => electron.ipcRenderer.invoke("export-data"),
  importData: () => electron.ipcRenderer.invoke("import-data"),
  relaunch: () => electron.ipcRenderer.invoke("relaunch")
});
