import { app, BrowserWindow, ipcMain, Menu,Notification,Tray } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

import fs from 'fs'
import path from 'node:path'
const dataPath = path.join(app.getPath('userData'), 'projects.json')
const settingsPath=path.join(app.getPath('userData'),'settings.json')

Menu.setApplicationMenu(null)
const require = createRequire(import.meta.url)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sentNotifications = new Set<string>()
export function loadProjects() {
  if (!fs.existsSync(dataPath)) return []

  return JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
}

export function saveProjects(projects) {
  checkProjects()
  fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2))
}
export function loadSettings() {
  if (!fs.existsSync(settingsPath)) return null
  return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'))
}

export function saveSettings(settings) {
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))
}
function checkProjects() {
  if (!fs.existsSync(dataPath)) return
  const projects = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const dnes = new Date()

  projects.forEach(p => {
    if (!p.ukonceni || !p.upozorneni) return
    const ukonceni = new Date(p.ukonceni)
    const rozdil = ukonceni.getTime() - dnes.getTime()
    const key = `${p.id}-${p.upozorneni}`
    
    if (rozdil > 0 && rozdil <= Number(p.upozorneni) && !sentNotifications.has(key)) {
      sentNotifications.add(key)
      new Notification({
        title: 'Projekt končí brzy',
        body: `${p.nazev} končí ${p.ukonceni}`
      }).show()
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


let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })
  // v createWindow:
win.on('close', (e) => {
  e.preventDefault()
  win?.hide()
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
  ipcMain.handle('load-settings',()=>loadSettings())
  ipcMain.handle('save-settings',(_event,settings)=>saveSettings(settings))
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
  
  tray = new Tray(path.join(process.env.VITE_PUBLIC, 'logo.png'))
  tray.setToolTip('Stavební povolení')
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: 'Otevřít', click: () => win?.show() },
    { label: 'Ukončit', click: () => app.quit() }
  ]))
  tray.on('click', () => win?.show())

 
 
})
app.setAppUserModelId('Starosta - Stavební povolení')
// při zavření minimalizovat do traye místo ukončit
app.on('before-quit', () => { /* nechej ukončit */ })

