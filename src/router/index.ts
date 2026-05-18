import { createRouter, createWebHashHistory } from 'vue-router'
import Projekty from '../views/Projekty.vue'

const router = createRouter({
  history: createWebHashHistory(), // hash history je důležité pro Electron!
  routes: [
    { path: '/', component: Projekty },
    { path: '/upozorneni', component: () => import('../views/Upozorneni.vue') },
   
    
  ]
})

export default router