<script setup>
import { ref, computed, watch } from 'vue'
import { LayoutDashboard, Bell, Moon, Sun, Search, Plus } from 'lucide-vue-next'
import { useProjectsStore } from './stores/projects'
import { useSettingsStore } from './stores/settings'
import ProjectModal from './components/ProjectModal.vue'

const store = useProjectsStore()
const settingsStore = useSettingsStore()
const isDark = computed(() => settingsStore.settings.darkMode)
const modalOpen = ref(false)

watch(isDark, (dark) => {
  document.body.classList.toggle('light', !dark)
}, { immediate: true })

function toggleTheme() {
  settingsStore.settings.darkMode = !settingsStore.settings.darkMode
}
</script>

<template>
  <nav class="sidebar">
    <h2>Menu</h2>
    <router-link class="nav-link" @auxclick.prevent to="/"><LayoutDashboard /> Projekty</router-link>
    <!-- <router-link class="nav-link" @auxclick.prevent to="/upozorneni"><Bell /> Upozornění</router-link> -->
  </nav>

  <div class="main-wrapper">
    <div class="header">
      <div class="search-wrapper">
        <Search class="search-icon" />
        <input v-model="store.search" placeholder="Hledat projekty..." />
      </div>
      <div class="header-actions">
        <button class="new-project" @click="modalOpen = true">
          <Plus :size="16" /> Nový projekt
        </button>
        <button @click="toggleTheme" class="theme-toggle">
          <Moon v-if="isDark" />
          <Sun v-else />
        </button>
      </div>
    </div>

    <main class="content">
      <RouterView />
    </main>
  </div>

  <ProjectModal :projekt="null" v-if="modalOpen" @close="modalOpen = false" />
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
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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