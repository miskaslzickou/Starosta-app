<script setup>
import { ref } from 'vue'

const filter_state = ref('Vše')
</script>

<template>
  <div class="filters">
  <button 
    v-for="state in ['Vše', 'Příprava', 'Probíhá', 'Pozastaveno', 'Dokončeno', 'Zrušeno']"
    :class="{ active: filter_state === state }"
    @click="filter_state = state"
  >
    {{ state }}
  </button>
   </div>
</template>

<style scoped>
button{
    color:#65716d ;
    background-color: transparent;
    border: 1px solid #333;
    padding: 5px 12px;
    border-radius: 15px;
}
button.active {
  color: #e8192c;
  background-color: #e8192e18;
  border-color: #e8192c;
}
button :focus{
    outline: none;
    
}
.filters {
    display: flex;
    gap: 8px;
}
</style>