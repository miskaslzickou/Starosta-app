<script setup>
import { ref, computed } from 'vue'
import StatCard from '../components/StatCard.vue'
import { ScrollText } from 'lucide-vue-next'
import UsneseniTable from '../components/UsneseniTable.vue'
import UsneseniModal from '../components/UsneseniModal.vue'
import { useUsneseniStore } from '../stores/usneseni'

const store = useUsneseniStore()
const usneseniCount = computed(() => store.usneseniCount)
const selectedResolution = ref(null)
const editModalOpen = ref(false)
</script>

<template>
  <main>
    <h1>Usnesení</h1>
    <div class="stats">
      <StatCard :number="usneseniCount" title="Celkem usnesení" color="#f59e0b">
        <template #icon><ScrollText /></template>
      </StatCard>
    </div>
    <div class="usneseni-wrapper">
      <UsneseniTable @rowClick="(u) => { selectedResolution = JSON.parse(JSON.stringify(u)); editModalOpen = true }" />
    </div>
  </main>
  <UsneseniModal :usneseni="selectedResolution" v-if="editModalOpen" @close="editModalOpen = false" />
</template>

<style scoped>
h1 { font-size: 35px; margin-bottom: 20px; color: var(--text-primary); }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.usneseni-wrapper { margin-top: 20px; }
</style>
