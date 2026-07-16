import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useSearchStore } from './search'

function normalizeBuilding(building: any) {
  return {
    ...building,
    spotreba: {
      plyn: Array.isArray(building?.spotreba?.plyn) ? building.spotreba.plyn.map((item: any) => ({ ...item })) : [],
      voda: Array.isArray(building?.spotreba?.voda) ? building.spotreba.voda.map((item: any) => ({ ...item })) : [],
      elektrina: {
        vt: Array.isArray(building?.spotreba?.elektrina?.vt) ? building.spotreba.elektrina.vt.map((item: any) => ({ ...item })) : [],
        nt: Array.isArray(building?.spotreba?.elektrina?.nt) ? building.spotreba.elektrina.nt.map((item: any) => ({ ...item })) : [],
      },
    },
    naklady: Array.isArray(building?.naklady) ? building.naklady.map((item: any) => ({ ...item })) : [],
  }
}

export const useBuildingStore = defineStore('buildings', () => {
  const buildings = ref<any[]>([])

  const buildingCount = computed(() => buildings.value.length)

  const filtred = computed(() => {
    const searchStore = useSearchStore()
    if (!searchStore.query) return buildings.value
    return buildings.value.filter((b: any) =>
      b.nazev?.toLowerCase().includes(searchStore.query.toLowerCase()) ||
      b.cp?.toLowerCase().includes(searchStore.query.toLowerCase())
    )
  })

  function addBuilding(building: any) {
    buildings.value = [...buildings.value, normalizeBuilding({ id: crypto.randomUUID(), ...building })]
  }

  function editBuilding(id: any, data: any) {
    buildings.value = buildings.value.map((b: any) => b.id === id ? normalizeBuilding({ ...b, ...data }) : b)
  }

  function deleteBuilding(id: any) {
    buildings.value = buildings.value.filter((b: any) => b.id !== id)
  }

  async function init() {
    if ((window as any).api) {
      const loaded = await (window as any).api.loadBuildings()
      if (loaded?.length) buildings.value = loaded.map(normalizeBuilding)
    } else {
      const saved = localStorage.getItem('buildings')
      if (saved) buildings.value = JSON.parse(saved).map(normalizeBuilding)
    }
  }

  watch(buildings, (val) => {
    const plain = JSON.parse(JSON.stringify(val))
    if ((window as any).api) {
      (window as any).api.saveBuildings(plain)
    } else {
      localStorage.setItem('buildings', JSON.stringify(plain))
    }
  }, { deep: true })

  return { buildings, buildingCount, filtred, addBuilding, editBuilding, deleteBuilding, init }
})
