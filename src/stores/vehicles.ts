import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVehicleStore = defineStore('vehicles', () => {
 const vehicles = ref([
  {
    nazev: 'Ford Transit 2019',
    vin: 'WF0XXXTTGXKA12345',
    spz: '1Z2 3456',
    technicka: '2025-06-15',
    pojisteni: '2026-01-10',
    upozorneni: 604800000,
    poznamky: 'Pravidelná údržba každých 10 000 km',
    opravy: [
      {
        druh: 'Výměna oleje',
        cenaBezDph: 1500,
        cenaSDph: 1815,
        datum: '2024-03-10',
      }
    ]
  }
])

  const vehicleCount = computed(() => vehicles.value.length)
  const filtred = computed(() => vehicles.value)

  function addVehicle(vehicle: any) {
    vehicles.value = [...vehicles.value, { id: crypto.randomUUID(), ...vehicle }]
  }
  function editVehicle(id: any, data: any) {
    vehicles.value = vehicles.value.map((v: any) => v.id === id ? { ...v, ...data } : v)
  }
  function deleteVehicle(id: any) {
    vehicles.value = vehicles.value.filter((v: any) => v.id !== id)
  }

  return { vehicles, vehicleCount, filtred, addVehicle, editVehicle, deleteVehicle }
})