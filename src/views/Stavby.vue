<script setup>
import { ref, computed } from 'vue'
import StatCard from '../components/StatCard.vue'
import { Building2 } from 'lucide-vue-next'
import BuildingTable from '../components/BuildingTable.vue'
import BuildingModal from '../components/BuildingModal.vue'
import { useBuildingStore } from '../stores/buildings'

const store = useBuildingStore()
const buildingCount = computed(() => store.buildingCount)
const vybranabudova = ref(null)
const editModalOpen = ref(false)
const obdobiOd = ref('')
const obdobiDo = ref('')
</script>

<template>
  <main>
    <h1>Budovy</h1>
    <div class="stats">
      <StatCard :number="buildingCount" title="Celkem budov" color="#3b82f6">
        <template #icon><Building2 /></template>
      </StatCard>
    </div>
    <div class="period-filter">
      <label>Období od</label>
      <input type="month" v-model="obdobiOd" />
      <label>do</label>
      <input type="month" v-model="obdobiDo" />
      <button v-if="obdobiOd || obdobiDo" @click="obdobiOd = ''; obdobiDo = ''" class="reset-btn">Vše</button>
    </div>
    <div class="building-wrapper">
      <BuildingTable :obdobiOd="obdobiOd" :obdobiDo="obdobiDo" @rowClick="(budova) => { vybranabudova = JSON.parse(JSON.stringify(budova)); editModalOpen = true }" />
    </div>
  </main>

  <BuildingModal :budova="vybranabudova" v-if="editModalOpen" @close="editModalOpen = false" />
</template>

<style scoped>
h1 { font-size: 35px; margin-bottom: 20px; color: var(--text-primary); }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.building-wrapper { margin-top: 20px; }
.period-filter { display: flex; align-items: center; gap: 10px; margin: 16px 0 8px; }
.period-filter label { font-size: 13px; color: var(--text-muted); }
.period-filter input { padding: 6px 8px; background-color: var(--bg-input); border: 1px solid var(--border); border-radius: 6px; color: var(--text-input); font-size: 13px; }
.reset-btn { padding: 6px 12px; background: none; border: 1px solid var(--border); border-radius: 6px; color: var(--text-muted); cursor: pointer; font-size: 13px; }
.reset-btn:hover { border-color: var(--accent); color: var(--accent); }
</style>