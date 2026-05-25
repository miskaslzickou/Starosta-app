<script setup lang="ts">
import { ref } from 'vue'
import { Download, Upload, Moon, Sun, RotateCcw } from 'lucide-vue-next'
import { useSettingsStore } from '../stores/settings'
import { useProjectsStore } from '../stores/projects'
import { useVehicleStore } from '../stores/vehicles'
import { useBuildingStore } from '../stores/buildings'
import { useSmlouvyStore } from '../stores/smlouvy'
import { useUsneseniStore } from '../stores/usneseni'

const settingsStore = useSettingsStore()
const projectsStore = useProjectsStore()
const vehicleStore = useVehicleStore()
const buildingStore = useBuildingStore()
const smlouvyStore = useSmlouvyStore()
const usneseniStore = useUsneseniStore()

const adresaDialog = ref(false)
const adresaInput = ref('')

const api = (window as any).api



function saveAddress() {
  settingsStore.settings.adresa = adresaInput.value.trim()
  adresaDialog.value = false
}

const exportStatus = ref('')
const importStatus = ref('')

async function doExport() {
  exportStatus.value = 'Exportuji...'
  const result = await api.exportData()
  exportStatus.value = result.success ? 'Exportováno ✓' : 'Zrušeno'
  setTimeout(() => { exportStatus.value = '' }, 3000)
}

async function doImport() {
  importStatus.value = 'Importuji...'
  const result = await api.importData()
  if (result.success) {
    await Promise.all([
      projectsStore.init(),
      vehicleStore.init(),
      buildingStore.init(),
      smlouvyStore.init(),
      usneseniStore.init(),
      settingsStore.init(),
    ])
    importStatus.value = 'Importováno ✓'
    setTimeout(() => { importStatus.value = '' }, 3000)
  } else {
    importStatus.value = 'Zrušeno'
    setTimeout(() => { importStatus.value = '' }, 3000)
  }
}

function restartApp() {
  api.relaunch()
}
</script>

<template>
  <main>
    <h1>Nastavení</h1>

    <div class="settings-grid">

    

      <section class="settings-section">
        <h2>Vzhled</h2>
        <div class="settings-row">
          <div class="settings-row-info">
            <component :is="settingsStore.settings.darkMode ? Moon : Sun" :size="18" class="row-icon" />
            <div>
              <div class="row-label">Tmavý režim</div>
              <div class="row-value">{{ settingsStore.settings.darkMode ? 'Zapnutý' : 'Vypnutý' }}</div>
            </div>
          </div>
          <button class="toggle-btn" :class="{ active: settingsStore.settings.darkMode }" @click="settingsStore.settings.darkMode = !settingsStore.settings.darkMode">
            <span class="toggle-knob" />
          </button>
        </div>
      </section>

      <section class="settings-section">
        <h2>Aplikace</h2>
        <div class="settings-row">
          <div class="settings-row-info">
            <RotateCcw :size="18" class="row-icon" />
            <div>
              <div class="row-label">Restart aplikace</div>
              <div class="row-value">Znovu spustit celou aplikaci</div>
            </div>
          </div>
          <button class="action-btn" @click="restartApp"><RotateCcw :size="14" /> Restartovat</button>
        </div>
      </section>

      <section class="settings-section">
        <h2>Data</h2>
        <div class="settings-row">
          <div class="settings-row-info">
            <Upload :size="18" class="row-icon" />
            <div>
              <div class="row-label">Import dat</div>
              <div class="row-value">Načíst zálohu ze souboru</div>
            </div>
          </div>
          <button class="action-btn" @click="doImport"><Upload :size="14" /> Importovat</button>
          <div v-if="importStatus" class="status-msg">{{ importStatus }}</div>
        </div>
        <div class="settings-row">
          <div class="settings-row-info">
            <Download :size="18" class="row-icon" />
            <div>
              <div class="row-label">Export dat</div>
              <div class="row-value">Uložit zálohu do souboru</div>
            </div>
          </div>
          <button class="action-btn" @click="doExport"><Download :size="14" /> Exportovat</button>
          <div v-if="exportStatus" class="status-msg">{{ exportStatus }}</div>
        </div>
      </section>

    </div>
  </main>

  <div class="dialog-overlay" v-if="adresaDialog" @click.self="adresaDialog = false">
    <div class="dialog">
      <h3>Adresa sídla</h3>
      <input type="text" v-model="adresaInput" placeholder="např. Náměstí 1, 123 45 Obec" @keyup.enter="saveAddress" autofocus />
      <div class="dialog-buttons">
        <button class="btn-cancel" @click="adresaDialog = false">Zrušit</button>
        <button class="btn-save" @click="saveAddress">Uložit</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 { font-size: 35px; margin-bottom: 24px; color: var(--text-primary); }

.settings-grid { display: flex; flex-direction: column; gap: 20px; max-width: 640px; }

.settings-section { background-color: var(--bg-elevated); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; }
.settings-section h2 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); padding: 12px 16px 8px; margin: 0; border-bottom: 1px solid var(--border); }

.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; gap: 12px; }
.settings-row + .settings-row { border-top: 1px solid var(--border); }
.settings-row-info { display: flex; align-items: center; gap: 12px; }

.row-icon { color: var(--accent); flex-shrink: 0; }
.row-label { font-size: 14px; color: var(--text-primary); font-weight: 500; }
.row-value { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

.action-btn { display: flex; align-items: center; gap: 6px; padding: 6px 12px; background: none; border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); cursor: pointer; font-size: 13px; white-space: nowrap; }
.action-btn:hover { border-color: var(--accent); color: var(--accent); }

.toggle-btn { position: relative; width: 44px; height: 24px; background-color: var(--border); border: none; border-radius: 12px; cursor: pointer; transition: background-color 0.2s; flex-shrink: 0; }
.toggle-btn.active { background-color: var(--accent); }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: transform 0.2s; display: block; }
.toggle-btn.active .toggle-knob { transform: translateX(20px); }

.dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.dialog { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 24px; width: 420px; }
.dialog h3 { margin: 0 0 16px; font-size: 16px; color: var(--text-primary); }
.dialog input { width: 100%; padding: 9px 10px; background: var(--bg-input); border: 1px solid var(--border); border-radius: 6px; color: var(--text-input); font-size: 14px; box-sizing: border-box; }
.dialog input:focus { outline: none; border-color: var(--accent); }
.dialog-buttons { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
.btn-cancel { padding: 7px 14px; background: none; border: 1px solid var(--border); border-radius: 6px; color: var(--text-secondary); cursor: pointer; font-size: 13px; }
.btn-save { padding: 7px 14px; background: var(--accent); border: none; border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px; }
.status-msg { font-size: 12px; color: var(--accent); margin-top: 4px; }
</style>