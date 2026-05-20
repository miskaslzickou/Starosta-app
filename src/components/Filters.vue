<script setup>
import { useProjectsStore } from '../stores/projects'
const store = useProjectsStore()
</script>

<template>
  <div class="filters">
    <button
      v-for="state in ['Vše', 'Probíhá', 'Stavba zahájena', 'Hotovo']"
      :class="{ active: store.activeFilter === state }"
      @click="store.activeFilter = state"
    >
      {{ state }}
    </button>
  </div>
</template>

<style scoped>
button {
  color: var(--text-faint);
  background-color: transparent;
  border: 1px solid var(--border);
  padding: 5px 12px;
  border-radius: 15px;
  cursor: pointer;
}

button.active {
  color: var(--accent);
  background-color: #e8192e18;
  border-color: var(--accent);
}

button:focus {
  outline: none;
}

.filters {
  display: flex;
  gap: 8px;
}
</style>