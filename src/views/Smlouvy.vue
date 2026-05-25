<script setup>
import { ref, computed } from 'vue'
import StatCard from '../components/StatCard.vue'
import { FileText } from 'lucide-vue-next'
import SmlouvyTable from '../components/SmlouvyTable.vue'
import SmlouvyModal from '../components/SmlouvyModal.vue'
import { useSmlouvyStore } from '../stores/smlouvy'

const store = useSmlouvyStore()
const smlouvyCount = computed(() => store.smlouvyCount)
const selectedContract = ref(null)
const editModalOpen = ref(false)
</script>

<template>
  <main>
    <h1>Nájemní + pachtovní smlouvy</h1>
    <div class="stats">
      <StatCard :number="smlouvyCount" title="Celkem smluv" color="#8b5cf6">
        <template #icon><FileText /></template>
      </StatCard>
    </div>
    <div class="smlouvy-wrapper">
      <SmlouvyTable @rowClick="(s) => { selectedContract = JSON.parse(JSON.stringify(s)); editModalOpen = true }" />
    </div>
  </main>
  <SmlouvyModal :smlouva="selectedContract" v-if="editModalOpen" @close="editModalOpen = false" />
</template>

<style scoped>
h1 { font-size: 35px; margin-bottom: 20px; color: var(--text-primary); }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.smlouvy-wrapper { margin-top: 20px; }
</style>
