import { app, Menu, BrowserWindow, Tray, ipcMain, Notification } from "electron";
import { fileURLToPath } from "node:url";
import fs from "fs";
import path from "node:path";
const dataPath = path.join(app.getPath("userData"), "projects.json");
const vehiclesPath = path.join(app.getPath("userData"), "vehicles.json");
const settingsPath = path.join(app.getPath("userData"), "settings.json");
Menu.setApplicationMenu(null);
if (!app.requestSingleInstanceLock()) {
  app.quit();
}
app.on("second-instance", () => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  }
});
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
const sentNotifications = /* @__PURE__ */ new Set();
function loadProjects() {
  if (!fs.existsSync(dataPath)) return [];
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}
function saveProjects(projects) {
  fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
}
function loadVehicles() {
  if (!fs.existsSync(vehiclesPath)) return [];
  return JSON.parse(fs.readFileSync(vehiclesPath, "utf-8"));
}
function saveVehicles(vehicles) {
  fs.writeFileSync(vehiclesPath, JSON.stringify(vehicles, null, 2));
}
function loadSettings() {
  if (!fs.existsSync(settingsPath)) return null;
  return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
}
function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}
const sectionLabels = {
  projekt: "Projekt",
  vyberoveRizeni: "Výběrové řízení",
  dotace: "Dotace",
  zhotovitel: "Zhotovitel"
};
function checkVehicles() {
  if (!fs.existsSync(vehiclesPath)) return;
  const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, "utf-8"));
  const now = /* @__PURE__ */ new Date();
  vehicles.forEach((v) => {
    const checks = [
      { field: "technicka", title: "Vozidlo – Technická prohlídka" },
      { field: "pojisteni", title: "Vozidlo – Pojištění" }
    ];
    for (const { field, title } of checks) {
      if (!v[field] || !v.upozorneni) continue;
      const termín = new Date(v[field]);
      const key = `${v.id}-${field}`;
      const diffMs = termín.getTime() - now.getTime();
      if (diffMs <= v.upozorneni && diffMs > -864e5 * 30 && !sentNotifications.has(key)) {
        sentNotifications.add(key);
        new Notification({
          title,
          body: `${v.nazev} (${v.spz})`
        }).show();
      }
    }
  });
}
function checkProjects() {
  if (!fs.existsSync(dataPath)) return;
  const projects = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const now = /* @__PURE__ */ new Date();
  projects.forEach((p) => {
    var _a;
    for (const sekce of ["projekt", "vyberoveRizeni", "dotace", "zhotovitel"]) {
      const terminy = (_a = p[sekce]) == null ? void 0 : _a.terminy;
      if (!(terminy == null ? void 0 : terminy.upozorneni)) continue;
      const upozorneniDate = new Date(terminy.upozorneni);
      const key = `${p.id}-${sekce}-${terminy.upozorneni}`;
      if (now >= upozorneniDate && !sentNotifications.has(key)) {
        sentNotifications.add(key);
        new Notification({
          title: `Upozornění – ${sectionLabels[sekce]}`,
          body: `${p.nazev}`
        }).show();
      }
    }
  });
}
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let isQuitting = false;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      win == null ? void 0 : win.hide();
    }
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
  ipcMain.handle("load-vehicles", () => loadVehicles());
  ipcMain.handle("save-vehicles", (_event, vehicles) => saveVehicles(vehicles));
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
  checkProjects();
  checkVehicles();
  setInterval(() => {
    checkProjects();
    checkVehicles();
  }, 2 * 60 * 1e3);
  tray = new Tray(path.join(process.env.VITE_PUBLIC, "logo.png"));
  tray.setToolTip("Stavební povolení");
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: "Otevřít", click: () => win == null ? void 0 : win.show() },
    { label: "Ukončit", click: () => app.quit() }
  ]));
  tray.on("click", () => win == null ? void 0 : win.show());
});
app.setAppUserModelId("Starosta - Databáze věcí");
app.on("before-quit", () => {
  isQuitting = true;
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL,
  loadProjects,
  loadSettings,
  loadVehicles,
  saveProjects,
  saveSettings,
  saveVehicles
};
