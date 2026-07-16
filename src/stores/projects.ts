// src/stores/projekty.ts
import { defineStore } from 'pinia'
import { ref, computed ,watch} from 'vue'
import { useSearchStore } from './search'


const defaultProjectSection = {
  kontakty: [],
  poznamka: '',
  terminy: { stavebniPovoleni: '', odevzdaniDok: '', upozorneni: '' },
}

const defaultVrizeniSection = {
  kontakty: [],
  poznamka: '',
  terminy: { odevzdaniNabidek: '', vyhlaseni: '', upozorneni: '' },
}

const defaultDotaceSection = {
  kontakty: [],
  poznamka: '',
  terminy: { podpisSmlouvy: '', ukonceniRealizace: '', zva: '', upozorneni: '' },
}

const defaultZhotovitelSection = {
  kontakty: [],
  poznamka: '',
  terminy: { ukonceniRealizace: '', zapocetRealizace: '', upozorneni: '' },
}

function cloneSection(section: any, defaults: any) {
  const source = section ?? {}
  const kontakty = Array.isArray(source.kontakty) ? source.kontakty.map((kontakt: any) => ({ ...kontakt })) : []

  return {
    ...defaults,
    ...source,
    kontakty,
    terminy: {
      ...defaults.terminy,
      ...(source.terminy ?? {}),
    },
  }
}

function normalizeProject(project: any) {
  return {
    ...project,
    projekt: cloneSection(project?.projekt, defaultProjectSection),
    vyberoveRizeni: cloneSection(project?.vyberoveRizeni, defaultVrizeniSection),
    dotace: cloneSection(project?.dotace, defaultDotaceSection),
    zhotovitel: cloneSection(project?.zhotovitel, defaultZhotovitelSection),
  }
}


export const useProjectsStore = defineStore('projekty', () => {
  const projects = ref<any[]>([])
  const search = ref('')
  function addProjects( project:any) {
    projects.value = [...projects.value, normalizeProject({ id: crypto.randomUUID(), ...project })]
  }

  function editProject(id:any, data:any) {
    projects.value = projects.value.map(p => p.id === id ? normalizeProject({ ...p, ...data }) : p)
  }
  async function init() {
    const stateMap: Record<string, string> = { 'Stavba zahájena': 'Zahájena', 'Hotovo': 'Ukončena' }
    let loaded: any[]
    if ((window as any).api) {
      loaded = await (window as any).api.loadProjects()
    } else {
      const saved = localStorage.getItem('projects')
      loaded = saved ? JSON.parse(saved) : []
    }
    if (loaded?.length) {
      projects.value = loaded.map(p => normalizeProject({ ...p, stav: stateMap[p.stav] ?? p.stav }))
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
  const searchStore = useSearchStore()
  let result = projects.value

  if (activeFilter.value !== 'Vše') {
    result = result.filter(p => p.stav === activeFilter.value)
  }

  if (searchStore.query) {
    result = result.filter(p =>
      p.nazev?.toLowerCase().includes(searchStore.query.toLowerCase()) ||
      p.posledniStav?.toLowerCase().includes(searchStore.query.toLowerCase())
    )
  }

  return result
  })
  const projectCount = computed(() => projects.value.length)
  const prepCount = computed(() => projects.value.filter(p => p.stav === 'Přípravná').length)
  const continousCount = computed(() => projects.value.filter(p => p.stav === 'Probíhá').length)
  const buildingStartedCount = computed(() => projects.value.filter(p => p.stav === 'Zahájena').length)
  const completedCount = computed(() => projects.value.filter(p => p.stav === 'Ukončena').length)
  const activeFilter = ref('Vše')
  return { projects, search, addProjects, editProject, deleteProject, filtred, projectCount, prepCount, continousCount, buildingStartedCount, completedCount, activeFilter, init }
})