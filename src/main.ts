import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
import { useProjectsStore } from './stores/projects'
import { useSettingsStore } from './stores/settings'
import App from './App.vue'
import router from './router/index'
const pinia = createPinia()


createApp(App)
  .use(router) 
  .use(pinia)
  .mount('#app')
  .$nextTick(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log(message)
        const store = useProjectsStore()
        const settings=useSettingsStore()
        settings.init()
        store.init()
      })
    }
  })