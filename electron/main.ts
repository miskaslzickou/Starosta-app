import { app, BrowserWindow, ipcMain, Menu, Notification, Tray, dialog } from 'electron'
import { fileURLToPath } from 'node:url'

import fs from 'fs'
import path from 'node:path'
const dataPath = path.join(app.getPath('userData'), 'projects.json')
const vehiclesPath = path.join(app.getPath('userData'), 'vehicles.json')
const buildingsPath = path.join(app.getPath('userData'), 'buildings.json')
const smlouvyPath = path.join(app.getPath('userData'), 'smlouvy.json')
const usneseniPath = path.join(app.getPath('userData'), 'usneseni.json')
const settingsPath=path.join(app.getPath('userData'),'settings.json')

Menu.setApplicationMenu(null)

if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('second-instance', () => {
  if (win) {
    if (win.isMinimized()) win.restore()
    win.show()
    win.focus()
  }
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sentNotifications = new Set<string>()
export function loadProjects() {
  if (!fs.existsSync(dataPath)) return []

  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
}

export function saveProjects(projects:any) {
  fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2))
}
export function loadVehicles() {
  if (!fs.existsSync(vehiclesPath)) return []
  return JSON.parse(fs.readFileSync(vehiclesPath, 'utf-8'))
}

export function saveVehicles(vehicles: any) {
  fs.writeFileSync(vehiclesPath, JSON.stringify(vehicles, null, 2))
}

export function loadBuildings() {
  if (!fs.existsSync(buildingsPath)) return []
  return JSON.parse(fs.readFileSync(buildingsPath, 'utf-8'))
}

export function saveBuildings(buildings: any) {
  fs.writeFileSync(buildingsPath, JSON.stringify(buildings, null, 2))
}
export function loadSmlouvy() {
  if (!fs.existsSync(smlouvyPath)) return []
  return JSON.parse(fs.readFileSync(smlouvyPath, 'utf-8'))
}
export function saveSmlouvy(smlouvy: any) {
  fs.writeFileSync(smlouvyPath, JSON.stringify(smlouvy, null, 2))
}
export function loadUsneseni() {
  if (!fs.existsSync(usneseniPath)) return []
  return JSON.parse(fs.readFileSync(usneseniPath, 'utf-8'))
}
export function saveUsneseni(usneseni: any) {
  fs.writeFileSync(usneseniPath, JSON.stringify(usneseni, null, 2))
}

export function loadSettings() {
  if (!fs.existsSync(settingsPath)) return null
  return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
}

export function saveSettings(settings:any) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
}

export async function exportData(win: BrowserWindow) {
  const { filePath, canceled } = await dialog.showSaveDialog(win, {
    title: 'Exportovat zálohu',
    defaultPath: `zaloha-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: 'JSON záloha', extensions: ['json'] }],
  })
  if (canceled || !filePath) return { success: false }

  const backup: Record<string, any> = {}
  const files: Record<string, string> = {
    projects: dataPath,
    vehicles: vehiclesPath,
    buildings: buildingsPath,
    smlouvy: smlouvyPath,
    usneseni: usneseniPath,
    settings: settingsPath,
  }
  for (const [key, p] of Object.entries(files)) {
    backup[key] = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : []
  }
  fs.writeFileSync(filePath, JSON.stringify(backup, null, 2))
  return { success: true }
}

export async function importData(win: BrowserWindow) {
  const { filePaths, canceled } = await dialog.showOpenDialog(win, {
    title: 'Importovat zálohu',
    filters: [{ name: 'JSON záloha', extensions: ['json'] }],
    properties: ['openFile'],
  })
  if (canceled || !filePaths[0]) return { success: false }

  const backup = JSON.parse(fs.readFileSync(filePaths[0], 'utf-8'))
  const files: Record<string, string> = {
    projects: dataPath,
    vehicles: vehiclesPath,
    buildings: buildingsPath,
    smlouvy: smlouvyPath,
    usneseni: usneseniPath,
    settings: settingsPath,
  }
  for (const [key, p] of Object.entries(files)) {
    if (backup[key] !== undefined) {
      fs.writeFileSync(p, JSON.stringify(backup[key], null, 2))
    }
  }
  return { success: true }
}

const sectionLabels: Record<string, string> = {
  projekt: 'Projekt',
  vyberoveRizeni: 'Výběrové řízení',
  dotace: 'Dotace',
  zhotovitel: 'Zhotovitel',
}

function checkVehicles() {
  if (!fs.existsSync(vehiclesPath)) return
  const vehicles = JSON.parse(fs.readFileSync(vehiclesPath, 'utf-8'))
  const now = new Date()

  vehicles.forEach((v: any) => {
    const checks: { field: 'technicka' | 'pojisteni'; title: string }[] = [
      { field: 'technicka', title: 'STK – Brzy vyprší' },
      { field: 'pojisteni', title: 'Vozidlo – Pojištění' },
    ]

    for (const { field, title } of checks) {
      if (!v[field] || !v.upozorneni) continue

      const termín = new Date(v[field])
      const key = `${v.id}-${field}`
      const diffMs = termín.getTime() - now.getTime()

      if (diffMs <= v.upozorneni && diffMs > -86400000 * 30 && !sentNotifications.has(key)) {
        sentNotifications.add(key)
        let body: string
        if (field === 'technicka') {
          const days = Math.round(Math.abs(diffMs) / 86400000)
          body = diffMs >= 0
            ? `${v.nazev} (${v.spz}) – za ${days} dní`
            : `${v.nazev} (${v.spz}) – vypršela před ${days} dny`
        } else {
          body = `${v.nazev} (${v.spz})`
        }
        new Notification({ title, body }).show()
      }
    }
  })
}

function checkSmlouvy() {
  if (!fs.existsSync(smlouvyPath)) return
  const smlouvy = JSON.parse(fs.readFileSync(smlouvyPath, 'utf-8'))
  const now = new Date()
  smlouvy.forEach((s: any) => {
    if (!s.datumUkonceni || !s.upozorneni) return
    const termin = new Date(s.datumUkonceni)
    const key = `smlouva-${s.id}-ukonceni`
    const diffMs = termin.getTime() - now.getTime()
    if (diffMs <= s.upozorneni && diffMs > -86400000 * 30 && !sentNotifications.has(key)) {
      sentNotifications.add(key)
      const days = Math.round(Math.abs(diffMs) / 86400000)
      const body = diffMs >= 0
        ? `${s.najemnik} – za ${days} dní`
        : `${s.najemnik} – vypršela před ${days} dny`
      new Notification({ title: 'Smlouva – Blíží se ukončení', body }).show()
    }
  })
}

function checkProjects() {
  if (!fs.existsSync(dataPath)) return
  const projects = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const now = new Date()

  projects.forEach((p: any) => {
    for (const sekce of ['projekt', 'vyberoveRizeni', 'dotace', 'zhotovitel']) {
      const terminy = p[sekce]?.terminy
      if (!terminy?.upozorneni) continue

      const upozorneniDate = new Date(terminy.upozorneni)
      const key = `${p.id}-${sekce}-${terminy.upozorneni}`

      if (now >= upozorneniDate && !sentNotifications.has(key)) {
        sentNotifications.add(key)
        new Notification({
          title: `Upozornění – ${sectionLabels[sekce]}`,
          body: `${p.nazev}`
        }).show()
      }
    }
  })
}



// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let isQuitting = false
let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })
  
win.on('close', (e) => {
   if (!isQuitting) {
    e.preventDefault()
    win?.hide()
  }
})
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  ipcMain.handle('load-projects', () => loadProjects())
  ipcMain.handle('save-projects', (_event, projects) => saveProjects(projects))
  ipcMain.handle('load-vehicles', () => loadVehicles())
  ipcMain.handle('save-vehicles', (_event, vehicles) => saveVehicles(vehicles))
  ipcMain.handle('load-buildings', () => loadBuildings())
  ipcMain.handle('save-buildings', (_event, buildings) => saveBuildings(buildings))
  ipcMain.handle('load-smlouvy', () => loadSmlouvy())
  ipcMain.handle('save-smlouvy', (_event, smlouvy) => saveSmlouvy(smlouvy))
  ipcMain.handle('load-usneseni', () => loadUsneseni())
  ipcMain.handle('save-usneseni', (_event, usneseni) => saveUsneseni(usneseni))
  ipcMain.handle('load-settings',()=>loadSettings())
  ipcMain.handle('save-settings',(_event,settings)=>saveSettings(settings))
  ipcMain.handle('export-data', () => exportData(win!))
  ipcMain.handle('import-data', () => importData(win!))
  ipcMain.handle('relaunch', () => { app.relaunch(); app.exit() })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
let tray: Tray | null = null
app.whenReady().then(() => {
  app.setLoginItemSettings({ openAtLogin: true })
  createWindow()
  checkProjects()
  checkVehicles()
  checkSmlouvy()
  setInterval(() => { checkProjects(); checkVehicles(); checkSmlouvy() }, 2 * 60 * 1000)
  
  tray = new Tray(path.join(process.env.VITE_PUBLIC, 'logo.png'))
  tray.setToolTip('Stavební povolení')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Otevřít', click: () => win?.show() },
    { label: 'Ukončit', click: () => app.quit() }
  ]))
  tray.on('click', () => win?.show())

 
 
})
app.setAppUserModelId('Starosta - Databáze věcí')
// při zavření minimalizovat do traye místo ukončit
app.on('before-quit', () => { 

   isQuitting = true
 })

