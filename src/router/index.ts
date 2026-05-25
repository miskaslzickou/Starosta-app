import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
  history: createWebHashHistory(), // hash history je důležité pro Electron!
  routes: [
    { path: '/', component:() => import('../views/Projekty.vue')},
    { path:'/vozidla',component:()=> import('../views/Vozidla.vue')},
    { path:'/stavby',component:()=>import('../views/Stavby.vue') },
    {path:'/smlouvy',component:()=>import('../views/Smlouvy.vue')},
    { path: '/usneseni', component: () => import('../views/Usneseni.vue') },
    { path: '/upozorneni', component: () => import('../views/Upozorneni.vue') },
    {path:'/nastaveni',component:()=> import('../views/Nastaveni.vue')}
    
  ]
})

export default router