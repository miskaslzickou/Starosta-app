<script setup>
import { ref, computed, watch } from 'vue'
import { Moon, Sun, Search, Plus, Settings, BrickWall, CarFront, Building, Signature, ScrollText } from 'lucide-vue-next'
import {useSearchStore} from './stores/search'
import { useSettingsStore } from './stores/settings'
import ProjectModal from './components/ProjectModal.vue'
import VehicleModal from './components/VehicleModal.vue'
import BuildingModal from './components/BuildingModal.vue'
import SmlouvyModal from './components/SmlouvyModal.vue'
import UsneseniModal from './components/UsneseniModal.vue'
import { useRoute } from 'vue-router'

const searchStore = useSearchStore()
const settingsStore = useSettingsStore()
const route = useRoute()
const modalOpen = ref(false)

const isDark = computed(() => settingsStore.settings.darkMode)
watch(isDark, (dark) => {
  document.body.classList.toggle('light', !dark)
}, { immediate: true })

const pageConfigs = {
  '/': { label: 'Nový projekt', modal: 'projekt' },
  '/vozidla': { label: 'Nové vozidlo', modal: 'vozidlo' },
  '/stavby': { label: 'Nová stavba', modal: 'budova' },
  '/smlouvy': { label: 'Nová smlouva', modal: 'smlouva' },
  '/usneseni': { label: 'Nové usnesení', modal: 'usneseni' },
}

const pageConfig = computed(() => pageConfigs[route.path] ?? null)



</script>

<template>
  <nav class="sidebar">
    <h2>Menu</h2>
    <router-link class="nav-link" @auxclick.prevent to="/"><BrickWall/> Projekty</router-link>
    <router-link class="nav-link" @auxclick.prevent to="/vozidla"><CarFront/> Vozidla</router-link>
    <router-link class="nav-link" @auxclick.prevent to="/stavby"><Building/> Budovy</router-link>
    <router-link class="nav-link" @auxclick.prevent to="/smlouvy"><Signature/>Nájemní + Pachtovní sml. </router-link>
    <router-link class="nav-link" @auxclick.prevent to="/usneseni"><ScrollText/> Usnesení</router-link>
    <!-- <router-link class="nav-link" @auxclick.prevent to="/upozorneni"><Bell /> Upozornění</router-link> -->
     <router-link class="nav-link" @auxclick.prevent to="/nastaveni"><Settings/> Nastavení</router-link>
  </nav>

  <div class="main-wrapper">
    <div class="header" >
      <div class="search-wrapper">
        <Search class="search-icon" />
        <input v-model="searchStore.query" placeholder="Hledat" />
        
      </div>
      <div class="header-actions">
        <button v-if="pageConfig" class="new-project" @click="modalOpen = true">
          <Plus :size="16" /> {{ pageConfig.label }}
        </button>
      </div>
    </div>

    <main class="content">
      <RouterView />
    </main>
  </div>

  <ProjectModal :projekt="null" v-if="modalOpen && pageConfig?.modal === 'projekt'" @close="modalOpen = false" />
  <VehicleModal :vozidlo="null" v-if="modalOpen && pageConfig?.modal === 'vozidlo'" @close="modalOpen = false" />
  <BuildingModal :budova="null" v-if="modalOpen && pageConfig?.modal === 'budova'" @close="modalOpen = false"/>
  <SmlouvyModal :smlouva="null" v-if="modalOpen && pageConfig?.modal === 'smlouva'" @close="modalOpen = false"/>
  <UsneseniModal :usneseni="null" v-if="modalOpen && pageConfig?.modal === 'usneseni'" @close="modalOpen = false"/>

</template>

<style>
body, #app {
  height: 100vh;
  display: flex;
  margin: 0;
}

nav {
  flex-shrink: 0;
  width: 200px;
  height: 100vh;
  padding: 40px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-sidebar);
  border-right: 1px solid var(--border);
}

nav h2 {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0; /* důležité pro flex children */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 40px;
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  background-color: var(--bg-header);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 40px;

  box-sizing: border-box;
  background-color: var(--bg-base);
}

.nav-link svg {
  width: 18px;
  height: 18px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  margin-bottom: 5px;
  color: var(--text-secondary);
  border-radius: 5px;
}

.nav-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-surface);
}

.router-link-active {
  font-weight: bold;
  background-color: var(--bg-elevated);
  color: var(--text-primary);
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
}

input {
  padding: 8px 8px 8px 34px;
  color: var(--text-input);
  background-color: var(--bg-input);
  outline: none;
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 100%;
}

input:focus {
  border: 1px solid var(--accent);
}

.new-project {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--accent);
  border: none;
  border-radius: 8px;
  color: #f8f8fa;
  cursor: pointer;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border);
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  padding: 6px;
  border-radius: 8px;
}
</style>