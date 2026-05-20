import { defineStore } from 'pinia'
import { watch, ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref({ darkMode: true })

  async function init() {
    if ((window as any).api) {
      const loaded = await (window as any).api.loadSettings()
      if (loaded) settings.value = loaded
    } else {
      const saved = localStorage.getItem('settings')
      if (saved) settings.value = JSON.parse(saved)
    }
  }

  watch(settings, (val) => {
    const plain = JSON.parse(JSON.stringify(val))
    if ((window as any).api) {
      (window as any).api.saveSettings(plain)
    } else {
      localStorage.setItem('settings', JSON.stringify(plain))
    }
  }, { deep: true })

  return { settings, init }
})