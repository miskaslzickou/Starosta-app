// src/stores/projekty.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProjectsStore = defineStore('projekty', () => {
  const projects = ref([
    {  nazev: 'Demolice staré hasičárny', zhotovitel: 'Demo-Stav s.r.o.', dotace: null, dok: true, stavPov: true, ukonceni: '30. 05. 2026', platnost: '10. 07. 2026', stav: 'Příprava', posledniStav: 'Výběrové řízení na dodavatele',id:crypto.randomUUID()},
  ])
  const search = ref('')
  function addProjects(id, project) {
    projects.value = [...projects.value, { id: crypto.randomUUID(), ...project }]
  }

  function editProject(id, data) {
    projects.value = projects.value.map(p => p.id === id ? { ...p, ...data } : p)
  }

  function deleteProject(id) {
    projects.value=projects.value.filter(p => p.id !== id)
  }
  const filtred = computed(() => {
   
    if (!search.value) return projects.value
    return projects.value.filter(p =>
      p.nazev.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  const projectCount = computed(() => projects.value.length)

  return { projects, search, addProjects, editProject, deleteProject, filtred, projectCount }
})