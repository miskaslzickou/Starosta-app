<script setup>
import { ref, computed } from 'vue';
import StatCard from '../components/StatCard.vue';
import Filters from '../components/Filters.vue';
import { Plus, Search, LayoutDashboard, ChartNoAxesColumn, Clock, Check, Funnel } from 'lucide-vue-next'
import ProjectsTable from '../components/ProjectsTable.vue';
import { useProjectsStore } from '../stores/projects'

const store = useProjectsStore()
const projectCount = computed(() => store.projectCount)
const vybranyProjekt = ref(null)
const modalOpen = ref(false)
const editModalOpen = ref(false)

function saveProject() {
  store.addProjects({})
  modalOpen.value = false
}
function saveEditedProject() {
  console.log(vybranyProjekt.value.id, vybranyProjekt.value)
  store.editProject(vybranyProjekt.value.id, vybranyProjekt.value)
  editModalOpen.value = false
}
</script>

<template>
  <div class="header">
    <div class="search-wrapper">
      <Search class="search-icon" />
      <input v-model="store.search" placeholder="Hledat projekty..." />
    </div>
    <button class="new-project" @click="modalOpen = true">
      <Plus class="plus-icon" /> Nový projekt
    </button>
  </div>

  <main>
    <h1>Projekty</h1>

    <div class="stats">
      <StatCard :number="projectCount" title="Celkem projektů" color="#c23243"><template #icon><LayoutDashboard /></template></StatCard>
      <StatCard number="10" title="Probíhající" color="#3b82f6"><template #icon><Clock /></template></StatCard>
      <StatCard number="10" title="V přípravě" color="#f59e0b"><template #icon><ChartNoAxesColumn /></template></StatCard>
      <StatCard number="10" title="Dokončené" color="#10b981"><template #icon><Check /></template></StatCard>
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

  <div class="modal-overlay" v-if="modalOpen">
    <div class="modal">
      <h2>Nový projekt</h2>
      <label>Název projektu:</label>
      <input type="text" placeholder="Název projektu" />
      <label>Zhotovitel:</label>
      <input type="text" placeholder="Zhotovitel + kontakt" />
      <label>Projektant:</label>
      <input type="text" placeholder="Projektant + kontakt" />
      <label>Projektová dokumentace:</label>
      <select name="ProjektDokumentace">
        <option value="yes">Ano</option>
        <option value="no">Ne</option>
      </select>
      <label>Stavební povolení:</label>
      <select name="StavebPovoleni">
        <option value="yes">Ano</option>
        <option value="no">Ne</option>
      </select>
      <label>Datum získání:</label>
      <input type="date" />
      <label>Datum ukončení:</label>
      <input type="date" />
      <label>Upozornění:</label>
      <select name="Upozorneni">
        <option value="1209600000">Dva týdny před termínem</option>
        <option value="604800000">Týden před termínem</option>
        <option value="2592000000">Měsíc před termínem</option>
      </select>
      <label>Dotace:</label>
      <input type="text" placeholder="Dotace" />
      <div class="modal-buttons">
        <button class="close-button" @click="modalOpen = false">Zavřít</button>
        <button class="new-project-button" @click="saveProject">Uložit</button>
      </div>
    </div>

  </div>
  <div class="modal-overlay" v-if="editModalOpen&& vybranyProjekt">
    <div class="edit-modal">
      <h2>Upravit projekt</h2>
      
      <label>Název projektu:</label>
      <input type="text"  v-model="vybranyProjekt.nazev"/>
      <label>Zhotovitel:</label>
      <input type="text" v-model="vybranyProjekt.zhotovitel"/>
      <label>Projektant:</label>
      <input type="text" v-model="vybranyProjekt.projektant"/>
      <label>Projektová dokumentace:</label>  
      <select name="ProjektDokumentace" v-model="vybranyProjekt.dok" >
        <option :value="true">Ano</option>
        <option :value="false">Ne</option>
      </select>
      <label>Stavební povolení:</label>
      <select name="StavebPovoleni" v-model="vybranyProjekt.stavPov">
        <option :value="true">Ano</option>
        <option :value="false">Ne</option>
      </select>
      <label>Datum získání:</label>
      <input type="date" v-model="vybranyProjekt.datumZiskani" />
      <label>Datum ukončení:</label>
      <input type="date" v-model="vybranyProjekt.datumUkonceni" />
      <label>Upozornění:</label>
      <select name="Upozorneni" v-model="vybranyProjekt.pripominka">
        <option value="1209600000">Dva týdny před termínem</option>
        <option value="604800000">Týden před termínem</option>
        <option value="2592000000">Měsíc před termínem</option>
      </select>
      <label>Dotace:</label>
      <input type="text"/>

      <div class="modal-buttons">
        <button class="close-button" @click="editModalOpen = false">Zavřít</button>
        <button class="new-project-button" @click="saveEditedProject()">Uložit</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 35px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 20%;
}

.search-icon {
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  color: #888;
}

input {
  padding: 8px 8px 8px 34px;
  color: #e9e9e9;
  background-color: #27272a;
  outline: none;
  border: 1px solid #333;
  border-radius: 8px;
  width: 100%;
  flex: 1;
}

input:focus {
  border: 1px solid #e8192c;
}

.plus-icon {
  color: #bdbdbd;
  margin-right: 5px;
}

.new-project {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: #c23243;
  border: none;
  border-radius: 8px;
  color: #f8f8fa;
  cursor: pointer;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid #333;
}

main {
  background-color: #111114;
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
  color: #65716d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal, .edit-modal {
  background-color: #1f1f23;
  padding: 20px;
  border-radius: 8px;
  width: 20%;
}

.modal input,
.modal select,.edit-modal input,.edit-modal select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  background-color: #27272a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #e9e9e9;
}

.modal-buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.modal button,.edit-modal button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button {
  background-color: #c23243;
  color: #e9e9e9;
}

.new-project-button {
  background-color: #32c251;
  color: #f8f8fa;
}

.modal h2 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: center;
}
</style>