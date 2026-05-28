import { app, Menu, BrowserWindow, powerMonitor, Tray, ipcMain, dialog, Notification } from "electron";
import { fileURLToPath } from "node:url";
import fs from "fs";
import path from "node:path";
const dataPath = path.join(app.getPath("userData"), "projects.json");
const vehiclesPath = path.join(app.getPath("userData"), "vehicles.json");
const buildingsPath = path.join(app.getPath("userData"), "buildings.json");
const smlouvyPath = path.join(app.getPath("userData"), "smlouvy.json");
const usneseniPath = path.join(app.getPath("userData"), "usneseni.json");
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
function todayKey() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
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
function loadBuildings() {
  if (!fs.existsSync(buildingsPath)) return [];
  return JSON.parse(fs.readFileSync(buildingsPath, "utf-8"));
}
function saveBuildings(buildings) {
  fs.writeFileSync(buildingsPath, JSON.stringify(buildings, null, 2));
}
function loadSmlouvy() {
  if (!fs.existsSync(smlouvyPath)) return [];
  return JSON.parse(fs.readFileSync(smlouvyPath, "utf-8"));
}
function saveSmlouvy(smlouvy) {
  fs.writeFileSync(smlouvyPath, JSON.stringify(smlouvy, null, 2));
}
function loadUsneseni() {
  if (!fs.existsSync(usneseniPath)) return [];
  return JSON.parse(fs.readFileSync(usneseniPath, "utf-8"));
}
function saveUsneseni(usneseni) {
  fs.writeFileSync(usneseniPath, JSON.stringify(usneseni, null, 2));
}
function loadSettings() {
  if (!fs.existsSync(settingsPath)) return null;
  return JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
}
function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}
async function exportData(win2) {
  const { filePath, canceled } = await dialog.showSaveDialog(win2, {
    title: "Exportovat zálohu",
    defaultPath: `zaloha-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`,
    filters: [{ name: "JSON záloha", extensions: ["json"] }]
  });
  if (canceled || !filePath) return { success: false };
  const backup = {};
  const files = {
    projects: dataPath,
    vehicles: vehiclesPath,
    buildings: buildingsPath,
    smlouvy: smlouvyPath,
    usneseni: usneseniPath,
    settings: settingsPath
  };
  for (const [key, p] of Object.entries(files)) {
    backup[key] = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : [];
  }
  fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));
  return { success: true };
}
async function importData(win2) {
  const { filePaths, canceled } = await dialog.showOpenDialog(win2, {
    title: "Importovat zálohu",
    filters: [{ name: "JSON záloha", extensions: ["json"] }],
    properties: ["openFile"]
  });
  if (canceled || !filePaths[0]) return { success: false };
  const backup = JSON.parse(fs.readFileSync(filePaths[0], "utf-8"));
  const files = {
    projects: dataPath,
    vehicles: vehiclesPath,
    buildings: buildingsPath,
    smlouvy: smlouvyPath,
    usneseni: usneseniPath,
    settings: settingsPath
  };
  for (const [key, p] of Object.entries(files)) {
    if (backup[key] !== void 0) {
      fs.writeFileSync(p, JSON.stringify(backup[key], null, 2));
    }
  }
  return { success: true };
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
      { field: "technicka", title: "STK – Brzy vyprší" },
      { field: "pojisteni", title: "Vozidlo – Pojištění" }
    ];
    for (const { field, title } of checks) {
      if (!v[field] || !v.upozorneni) continue;
      const termín = new Date(v[field]);
      const key = `${v.id}-${field}-${todayKey()}`;
      const diffMs = termín.getTime() - now.getTime();
      if (diffMs <= v.upozorneni && diffMs > -864e5 * 30 && !sentNotifications.has(key)) {
        sentNotifications.add(key);
        let body;
        if (field === "technicka") {
          const days = Math.round(Math.abs(diffMs) / 864e5);
          body = diffMs >= 0 ? `${v.nazev} (${v.spz}) – za ${days} dní` : `${v.nazev} (${v.spz}) – vypršela před ${days} dny`;
        } else {
          body = `${v.nazev} (${v.spz})`;
        }
        new Notification({ title, body }).show();
      }
    }
  });
}
function checkSmlouvy() {
  if (!fs.existsSync(smlouvyPath)) return;
  const smlouvy = JSON.parse(fs.readFileSync(smlouvyPath, "utf-8"));
  const now = /* @__PURE__ */ new Date();
  smlouvy.forEach((s) => {
    if (!s.datumUkonceni || !s.upozorneni) return;
    const termin = new Date(s.datumUkonceni);
    const key = `smlouva-${s.id}-ukonceni-${todayKey()}`;
    const diffMs = termin.getTime() - now.getTime();
    if (diffMs <= s.upozorneni && diffMs > -864e5 * 30 && !sentNotifications.has(key)) {
      sentNotifications.add(key);
      const days = Math.round(Math.abs(diffMs) / 864e5);
      const body = diffMs >= 0 ? `${s.najemnik} – za ${days} dní` : `${s.najemnik} – vypršela před ${days} dny`;
      new Notification({ title: "Smlouva – Blíží se ukončení", body }).show();
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
      const key = `${p.id}-${sekce}-${terminy.upozorneni}-${todayKey()}`;
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
    icon: path.join(process.env.VITE_PUBLIC, process.platform === "win32" ? "logo.ico" : "logo.png"),
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
  ipcMain.handle("load-buildings", () => loadBuildings());
  ipcMain.handle("save-buildings", (_event, buildings) => saveBuildings(buildings));
  ipcMain.handle("load-smlouvy", () => loadSmlouvy());
  ipcMain.handle("save-smlouvy", (_event, smlouvy) => saveSmlouvy(smlouvy));
  ipcMain.handle("load-usneseni", () => loadUsneseni());
  ipcMain.handle("save-usneseni", (_event, usneseni) => saveUsneseni(usneseni));
  ipcMain.handle("load-settings", () => loadSettings());
  ipcMain.handle("save-settings", (_event, settings) => saveSettings(settings));
  ipcMain.handle("export-data", () => exportData(win));
  ipcMain.handle("import-data", () => importData(win));
  ipcMain.handle("relaunch", () => {
    app.relaunch();
    app.exit();
  });
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
function runAllChecks() {
  checkProjects();
  checkVehicles();
  checkSmlouvy();
}
app.whenReady().then(() => {
  app.setLoginItemSettings({ openAtLogin: true });
  createWindow();
  runAllChecks();
  setInterval(runAllChecks, 2 * 60 * 1e3);
  powerMonitor.on("resume", runAllChecks);
  tray = new Tray(path.join(process.env.VITE_PUBLIC, process.platform === "win32" ? "logo.ico" : "logo.png"));
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
  exportData,
  importData,
  loadBuildings,
  loadProjects,
  loadSettings,
  loadSmlouvy,
  loadUsneseni,
  loadVehicles,
  saveBuildings,
  saveProjects,
  saveSettings,
  saveSmlouvy,
  saveUsneseni,
  saveVehicles
};
