<script setup>

import { LayoutDashboard, Bell, BarChart2, Settings } from 'lucide-vue-next'


</script>


<template>

   <nav class="sidebar"> 
    <h2>Menu</h2>
    <router-link class="nav-link" @auxclick.prevent to="/">   <LayoutDashboard/> Projekty</router-link>
       <router-link class="nav-link" @auxclick.prevent to="/upozorneni"> <Bell/> Upozornění</router-link>
  
    </nav>
    <main class="content">
        <RouterView />
    </main>


  <div class="app">
    
   
  </div>
</template>
<style>
nav h2 {
  text-align: center;
}
  nav    {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    background-color:#111118 ;
    padding-top: 40px;
  }
  .nav-link svg {
  
  width: 18px;
  height: 18px;
  }
  .nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0px;
  }


  .nav-link {
     padding: 5px;
    margin-bottom: 3px;
    color: #c5c5c7;
    border-radius: 5px;
    margin-bottom: 5px;
  }
  .nav-link:hover {
       color: var(--color-primary);
        background-color: #1a1a21;
  }
  .router-link-active {
    font-weight: bold;
    background-color: #24242a;
   
    color: var(--color-primary);
   
  }
  .content {
  margin-left: 200px;
  padding: 40px;
  height: 100vh;
  box-sizing: border-box;
}

</style>