import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import { useProjectsStore } from './stores/projects'
import { useVehicleStore } from './stores/vehicles'
import { useSettingsStore } from './stores/settings'
import { useBuildingStore } from './stores/buildings'

import App from './App.vue'
import router from './router/index'
import { useUsneseniStore } from './stores/usneseni'
import { useSmlouvyStore } from './stores/smlouvy'
const pinia = createPinia()


createApp(App)
  .use(router) 
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.once('main-process-message', (_event, message) => {
        console.log(message)
        const store = useProjectsStore()
        const settings=useSettingsStore()
        const vehicles=useVehicleStore()
        const buildings=useBuildingStore()
        const agreements=useSmlouvyStore()
        const resolution= useUsneseniStore()
        settings.init()
        store.init()
        vehicles.init()
        buildings.init()
        agreements.init()
        resolution.init()
      })
    }
  })