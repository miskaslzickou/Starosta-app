<script setup>
import { ref, computed } from 'vue';
import StatCard from '../components/StatCard.vue';
import Filters from '../components/Filters.vue';
import { LayoutDashboard, ChartNoAxesColumn, Clock, Check, Funnel } from 'lucide-vue-next'
import ProjectsTable from '../components/ProjectsTable.vue';
import { useProjectsStore } from '../stores/projects'
import ProjectModal from '../components/ProjectModal.vue';

const store = useProjectsStore()
const projectCount = computed(() => store.projectCount)
const continousCount = computed(() => store.continousCount)
const buildingStartedCount = computed(() => store.buildingStartedCount)
const completedCount = computed(() => store.completedCount)
const editModalOpen = ref(false)
const vybranyProjekt = ref(null)
</script>

<template>
  <main>
    <h1>Projekty</h1>

    <div class="stats">
      <StatCard :number="projectCount" title="Celkem projektů" color="#c23243"><template #icon><LayoutDashboard /></template></StatCard>
      <StatCard :number="continousCount" title="Probíhající" color="#3b82f6"><template #icon><Clock /></template></StatCard>
      <StatCard :number="buildingStartedCount" title="Stavba Zahájena" color="#f59e0b"><template #icon><ChartNoAxesColumn /></template></StatCard>
      <StatCard :number="completedCount" title="Dokončené" color="#10b981"><template #icon><Check /></template></StatCard>
    </div>

    <div class="projects-wrapper">
      <div class="projects-state-filter">
        <div style="display: flex; align-items: center; gap: 6px;">
          <Funnel :size="16" />
          <p>Stav:</p>
          <Filters />
        </div>
      </div>
      <ProjectsTable @rowClick="(projekt) => { vybranyProjekt = JSON.parse(JSON.stringify(projekt)); editModalOpen = true }" />
    </div>
  </main>

  <ProjectModal :projekt="vybranyProjekt" v-if="editModalOpen" @close="editModalOpen = false" />
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

.projects-wrapper {
  margin-top: 20px;
}

.projects-state-filter {
  color: var(--text-faint);
  margin-bottom: 12px;
}
</style>