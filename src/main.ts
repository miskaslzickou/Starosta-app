import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'
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
      })
    }
  })