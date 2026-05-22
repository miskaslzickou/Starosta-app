// src/stores/projekty.ts
import { defineStore } from 'pinia'
import { ref, computed ,watch} from 'vue'


export const useProjectsStore = defineStore('projekty', () => {
  const projects = ref<any[]>([])
  const search = ref('')
  function addProjects( project:any) {
    projects.value = [...projects.value, { id: crypto.randomUUID(), ...project }]
  }

  function editProject(id:any, data:any) {
    projects.value = projects.value.map(p => p.id === id ? { ...p, ...data } : p)
  }
  async function init() {
    if ((window as any).api) {
      const loaded = await (window as any).api.loadProjects()
      if (loaded?.length) projects.value = loaded
    } else {
      const saved = localStorage.getItem('projects')
      if (saved) projects.value = JSON.parse(saved)
    }
  }

  watch(projects, (val) => {
    const plain = JSON.parse(JSON.stringify(val))
    if ((window as any).api) {
      (window as any).api.saveProjects(plain)
    } else {
      localStorage.setItem('projects', JSON.stringify(plain))
    }
  }, { deep: true })
  function deleteProject(id:any) {
    projects.value=projects.value.filter(p => p.id !== id)
  }
 
  const filtred = computed(() => {
  let result = projects.value

  if (activeFilter.value !== 'Vše') {
    result = result.filter(p => p.stav === activeFilter.value)
  }

  if (search.value) {
    result = result.filter(p =>
      p.nazev?.toLowerCase().includes(search.value.toLowerCase()) ||
      p.posledniStav?.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  return result
  })
  const projectCount = computed(() => projects.value.length)
  const continousCount = computed(() => projects.value.filter(p => p.stav === 'Probíhá').length)
  const buildingStartedCount = computed(() => projects.value.filter(p => p.stav === 'Stavba zahájena').length)
  const completedCount = computed(() => projects.value.filter(p => p.stav === 'Hotovo').length)
  const activeFilter = ref('Vše')
  return { projects, search, addProjects, editProject, deleteProject, filtred, projectCount ,continousCount, buildingStartedCount, completedCount,activeFilter,init}
})