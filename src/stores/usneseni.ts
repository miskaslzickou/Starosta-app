import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useSearchStore } from './search'

export const useUsneseniStore = defineStore('usneseni', () => {
  const usneseni = ref<any[]>([])

  const usneseniCount = computed(() => usneseni.value.length)

  const filtred = computed(() => {
    const searchStore = useSearchStore()
    if (!searchStore.query) return usneseni.value
    return usneseni.value.filter((u: any) =>
      u.nazev?.toLowerCase().includes(searchStore.query.toLowerCase()) ||
      u.cisloUsneseni?.toLowerCase().includes(searchStore.query.toLowerCase()) ||
      u.textUsneseni?.toLowerCase().includes(searchStore.query.toLowerCase())
    )
  })

  function addResolution(item: any) {
    usneseni.value = [...usneseni.value, { id: crypto.randomUUID(), ...item }]
  }

  function editResolution(id: any, data: any) {
    usneseni.value = usneseni.value.map((u: any) => u.id === id ? { ...u, ...data } : u)
  }

  function deleteResolution(id: any) {
    usneseni.value = usneseni.value.filter((u: any) => u.id !== id)
  }

  async function init() {
    if ((window as any).api) {
      const loaded = await (window as any).api.loadUsneseni()
      if (loaded?.length) usneseni.value = loaded
    } else {
      const saved = localStorage.getItem('usneseni')
      if (saved) usneseni.value = JSON.parse(saved)
    }
  }

  watch(usneseni, (val) => {
    const plain = JSON.parse(JSON.stringify(val))
    if ((window as any).api) {
      (window as any).api.saveUsneseni(plain)
    } else {
      localStorage.setItem('usneseni', JSON.stringify(plain))
    }
  }, { deep: true })

  return { usneseni, usneseniCount, filtred, addResolution, editResolution, deleteResolution, init }
})
