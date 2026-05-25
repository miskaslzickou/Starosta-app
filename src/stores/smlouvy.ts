import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useSearchStore } from './search'

export const useSmlouvyStore = defineStore('smlouvy', () => {
  const smlouvy = ref<any[]>([])

  const smlouvyCount = computed(() => smlouvy.value.length)

  const filtred = computed(() => {
    const searchStore = useSearchStore()
    if (!searchStore.query) return smlouvy.value
    return smlouvy.value.filter((s: any) =>
      s.najemnik?.toLowerCase().includes(searchStore.query.toLowerCase()) ||
      s.specifikace?.toLowerCase().includes(searchStore.query.toLowerCase())
    )
  })

  function addContract(smlouva: any) {
    smlouvy.value = [...smlouvy.value, { id: crypto.randomUUID(), ...smlouva }]
  }

  function editContract(id: any, data: any) {
    smlouvy.value = smlouvy.value.map((s: any) => s.id === id ? { ...s, ...data } : s)
  }

  function deleteContract(id: any) {
    smlouvy.value = smlouvy.value.filter((s: any) => s.id !== id)
  }

  async function init() {
    if ((window as any).api) {
      const loaded = await (window as any).api.loadSmlouvy()
      if (loaded?.length) smlouvy.value = loaded
    } else {
      const saved = localStorage.getItem('smlouvy')
      if (saved) smlouvy.value = JSON.parse(saved)
    }
  }

  watch(smlouvy, (val) => {
    const plain = JSON.parse(JSON.stringify(val))
    if ((window as any).api) {
      (window as any).api.saveSmlouvy(plain)
    } else {
      localStorage.setItem('smlouvy', JSON.stringify(plain))
    }
  }, { deep: true })

  return { smlouvy, smlouvyCount, filtred, addContract, editContract, deleteContract, init }
})
