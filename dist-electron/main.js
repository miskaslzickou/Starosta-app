import { app, Menu, BrowserWindow, Tray, ipcMain, Notification } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "fs";
import path from "node:path";
const dataPath = path.join(app.getPath("userData"), "projects.json");
const settingsPath = path.join(app.getPath("userData"), "settings.json");
Menu.setApplicationMenu(null);
createRequire(import.meta.url);
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const sentNotifications = /* @__PURE__ */ new Set();
function loadProjects() {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}
function saveProjects(projects) {
  checkProjects();
  fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
}
function loadSettings() {
  if (!fs.existsSync(settingsPath)) return null;
  return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
}
function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}
function checkProjects() {
  if (!fs.existsSync(dataPath)) return;
  const projects = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const dnes = /* @__PURE__ */ new Date();
  projects.forEach((p) => {
    if (!p.ukonceni || !p.upozorneni) return;
    const ukonceni = new Date(p.ukonceni);
    const rozdil = ukonceni.getTime() - dnes.getTime();
    const key = `${p.id}-${p.upozorneni}`;
    if (rozdil > 0 && rozdil <= Number(p.upozorneni) && !sentNotifications.has(key)) {
      sentNotifications.add(key);
      new Notification({
        title: "Projekt končí brzy",
        body: `${p.nazev} končí ${p.ukonceni}`
      }).show();
    }
  });
}
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.on("close", (e) => {
    e.preventDefault();
    win == null ? void 0 : win.hide();
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  ipcMain.handle("load-projects", () => loadProjects());
  ipcMain.handle("save-projects", (_event, projects) => saveProjects(projects));
  ipcMain.handle("load-settings", () => loadSettings());
  ipcMain.handle("save-settings", (_event, settings) => saveSettings(settings));
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
let tray = null;
app.whenReady().then(() => {
  app.setLoginItemSettings({ openAtLogin: true });
  createWindow();
  tray = new Tray(path.join(process.env.VITE_PUBLIC, "logo.png"));
  tray.setToolTip("Stavební povolení");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Otevřít", click: () => win == null ? void 0 : win.show() },
    { label: "Ukončit", click: () => app.quit() }
  ]));
  tray.on("click", () => win == null ? void 0 : win.show());
});
app.setAppUserModelId("Starosta - Stavební povolení");
app.on("before-quit", () => {
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL,
  loadProjects,
  loadSettings,
  saveProjects,
  saveSettings
};
