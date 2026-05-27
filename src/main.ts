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
    useSettingsStore().init()
    useProjectsStore().init()
    useVehicleStore().init()
    useBuildingStore().init()
    useSmlouvyStore().init()
    useUsneseniStore().init()
  })