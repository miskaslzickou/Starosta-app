<script setup>
import { ref, computed } from 'vue';
import StatCard from '../components/StatCard.vue';
import Filters from '../components/Filters.vue';
import { LayoutDashboard, ChartNoAxesColumn, Clock, Check, Funnel } from 'lucide-vue-next'
import ProjectsTable from '../components/ProjectsTable.vue';
import { useVehicleStore } from '../stores/vehicles'
import VehicleTable from '../components/VehicleTable.vue';
import VehicleModal from '../components/VehicleModal.vue';


const store = useVehicleStore()
const vehicleCount = computed(() => store.vehicleCount)

const editModalOpen = ref(false)
const vybraneVozidlo = ref(null)
</script>

<template>
  <main>
    <h1>Vozidla</h1>

    <div class="stats">
      <StatCard :number="vehicleCount" title="Celkem vozidel" color="#c23243"><template #icon><LayoutDashboard /></template></StatCard>
      
    </div>

    <div class="vehicle-wrapper">
     
        <VehicleTable @rowClick="(vozidlo) => { vybraneVozidlo = JSON.parse(JSON.stringify(vozidlo)); editModalOpen = true }" />
    </div>
  </main>

  <VehicleModal :vozidlo="vybraneVozidlo" v-if="editModalOpen" @close="editModalOpen = false" />
</template>

<style scoped>
h1 {
  font-size: 35px;
  margin-bottom: 20px;
  color: var(--text-primary);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.vehicle-wrapper {
  margin-top: 20px;
}

.projects-state-filter {
  color: var(--text-faint);
  margin-bottom: 12px;
}
</style>