import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useSearchStore } from './search'

export const useVehicleStore = defineStore('vehicles', () => {
 const vehicles = ref<any[]>([])

  const vehicleCount = computed(() => vehicles.value.length)
  
 const filtred = computed(() => {
   let result = vehicles.value
  const searchStore = useSearchStore()
  
   if (searchStore.query) {
     result = result.filter(p =>
       p.nazev?.toLowerCase().includes(searchStore.query.toLowerCase()) ||
       p.vin?.toLowerCase().includes(searchStore.query.toLowerCase())
     )
   }
 
   return result
   })

  function addVehicle(vehicle: any) {
    vehicles.value = [...vehicles.value, { id: crypto.randomUUID(), ...vehicle }]
  }
  function editVehicle(id: any, data: any) {
    vehicles.value = vehicles.value.map((v: any) => v.id === id ? { ...v, ...data } : v)
  }
  function deleteVehicle(id: any) {
    vehicles.value = vehicles.value.filter((v: any) => v.id !== id)
  }

  async function init() {
    if ((window as any).api) {
      const loaded = await (window as any).api.loadVehicles()
      if (loaded?.length) vehicles.value = loaded
    } else {
      const saved = localStorage.getItem('vehicles')
      if (saved) vehicles.value = JSON.parse(saved)
    }
  }

  watch(vehicles, (val) => {
    const plain = JSON.parse(JSON.stringify(val))
    if ((window as any).api) {
      (window as any).api.saveVehicles(plain)
    } else {
      localStorage.setItem('vehicles', JSON.stringify(plain))
    }
  }, { deep: true })

  return { vehicles, vehicleCount, filtred, addVehicle, editVehicle, deleteVehicle, init }
})