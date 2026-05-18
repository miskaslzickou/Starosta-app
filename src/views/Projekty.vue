<script setup>
import { ref } from 'vue';
import StatCard from '../components/StatCard.vue';
import Filters from '../components/Filters.vue';
import { Plus, Search,LayoutDashboard,ChartNoAxesColumn,Clock,Check,Funnel} from 'lucide-vue-next'


const search = ref('')
</script>
<template>

  <div class="header">
   <div class="search-wrapper">
    <Search class="search-icon" />
    <input v-model="search" placeholder="Hledat projekty..." />
    </div>
    <button class="new-project"><Plus class="plus-icon" /> Nový projekt</button>

   </div> 
   
   <main>
   <h1>Projekty</h1>
    <div class="stats">
      <StatCard number="10" title="Celkem projektů" color="#c23243"><template #icon><LayoutDashboard/></template></StatCard>
      <StatCard number="10" title="Probíhající" color="#3b82f6"><template #icon><Clock/></template></StatCard>
      <StatCard number="10" title="V přípravě" color="#f59e0b"><template #icon><ChartNoAxesColumn/></template></StatCard>
       <StatCard number="10" title="Dokončené" color="#10b981"><template #icon><Check/></template></StatCard>
    </div>
    <div class="projects-wrapper">
      <div class="projects-state-filter">
       <div style="display: flex; align-items: center; gap: 6px;">
        <Funnel :size="16" />
        <p>Stav:</p>
         <Filters />
      </div>
      </div>

    </div>


  </main>

  

   

 
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
  background-color: #27272a;
  outline: none;
  border: 1px solid #333;
  border-radius: 8px;
  width: 100%;
  flex: 1;
}
input:focus{
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
main{
  background-color:#111114 ;
}
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.projects-wrapper {
  margin-top: 20px;

}
.projects-state-filter{
  color:#65716d ;
}

</style>