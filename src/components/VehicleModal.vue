<script setup lang="ts">
import { useVehicleStore } from '../stores/vehicles'
import { ref, computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps(['vozidlo'])
const store = useVehicleStore()
const emit = defineEmits(['close'])

function cloneVehicle(vehicle: any) {
  return vehicle ? JSON.parse(JSON.stringify(vehicle)) : null
}

const formData = ref(props.vozidlo ? cloneVehicle(props.vozidlo) : {
  nazev: '',
  vin: '',
  spz: '',
  technicka: '',
  pojisteni: '',
  upozorneni: 604800000,
  poznamky: '',
  opravy: []
})

function saveVehicle() {
  store.addVehicle(JSON.parse(JSON.stringify(formData.value)))
  emit('close')
}

function saveEditedVehicle() {
  store.editVehicle(props.vozidlo.id, JSON.parse(JSON.stringify(formData.value)))
  emit('close')
}

function deleteVehicle() {
  store.deleteVehicle(props.vozidlo.id)
  emit('close')
}

const initialData = JSON.stringify(formData.value)

function handleClose() {
  if (JSON.stringify(formData.value) !== initialData) {
    if (!confirm('Změny nebyly uloženy. Opravdu zavřít?')) return
  }
  emit('close')
}

const totalRepairCost = computed(() => {
  const opravy = formData.value.opravy ?? []
  return opravy.reduce((sum: number, o: any) => sum + Number(o.cenaSDph ?? 0), 0)
})
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2 v-if="props.vozidlo == null">Nové vozidlo</h2>
        <h2 v-else>Upravit vozidlo {{ formData.nazev }}</h2>
        <button v-if="props.vozidlo != null" @click="deleteVehicle" class="delete-button">
          <Trash2 :size="16" /> Smazat
        </button>
      </div>

      <section class="form-section">
        <h3>Základní informace</h3>
        <div class="fields cols-3">
          <div class="field-group">
            <label>Název vozidla</label>
            <input type="text" placeholder="Ford Transit 2019" v-model="formData.nazev" />
          </div>
          <div class="field-group">
            <label>VIN</label>
            <input type="text" placeholder="VIN" v-model="formData.vin" />
          </div>
          <div class="field-group">
            <label>SPZ</label>
            <input type="text" placeholder="1Z2 3456" v-model="formData.spz" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Termíny</h3>
        <div class="fields cols-2">
          <div class="field-group">
            <label>Technická prohlídka</label>
            <input type="date" v-model="formData.technicka" />
          </div>
          <div class="field-group">
            <label>Pojištění do</label>
            <input type="date" v-model="formData.pojisteni" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Upozornění</h3>
        <div class="fields cols-1">
          <div class="field-group">
            <label>Upozornit</label>
            <select v-model="formData.upozorneni">
              <option :value="1209600000">Dva týdny před termínem</option>
              <option :value="604800000">Týden před termínem</option>
              <option :value="2592000000">Měsíc před termínem</option>
            </select>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Poznámky</h3>
        <div class="field-group">
          
          <textarea rows="3" placeholder="Poznámky..." v-model="formData.poznamky" />
        </div>
      </section>
      <section class="form-section">
  <h3>Opravy</h3>
  
  <div v-for="(oprava, index) in formData.opravy" :key="index" class="oprava-row">
    <div class="fields cols-4">
      <div class="field-group">
        <label>Druh opravy</label>
        <input type="text" placeholder="např. Výměna oleje" v-model="oprava.druh" />
      </div>
      <div class="field-group">
        <label>Cena bez DPH</label>
        <input type="number" placeholder="0" v-model="oprava.cenaBezDph" />
      </div>
      <div class="field-group">
        <label>Cena s DPH</label>
        <input type="number" placeholder="0" v-model="oprava.cenaSDph" />
      </div>
      <div class="field-group">
        <label>Datum</label>
        <input type="date" v-model="oprava.datum" />
      </div>
    </div>
    <button class="delete-oprava-button" @click="formData.opravy.splice(index, 1)">
      <Trash2 :size="14" />
    </button>
  </div>

  <button class="add-oprava-button" @click="formData.opravy.push({ druh: '', cenaBezDph: 0, cenaSDph: 0, datum: '' })">
    + Přidat opravu
  </button>

  <div v-if="formData.opravy?.length" class="opravy-total">
    Celkem (s DPH): <strong>{{ totalRepairCost.toLocaleString('cs-CZ') }} Kč</strong>
  </div>
</section>
      <div class="modal-buttons">
        <button class="close-button" @click="handleClose">Zavřít</button>
        <button class="save-button" @click="saveVehicle" v-if="props.vozidlo == null">Uložit vozidlo</button>
        <button class="save-button" @click="saveEditedVehicle" v-else>Uložit změny</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal {
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  padding: 20px;
  border-radius: 15px;
  width: 40%;
  border: 1px solid var(--border);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.modal h2 {
  margin: 0;
}

.form-section {
  margin-bottom: 16px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
}

.form-section h3 {
  margin: 0 0 10px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.fields {
  display: grid;
  gap: 0 12px;
}

.fields.cols-1 { grid-template-columns: 1fr; }
.fields.cols-2 { grid-template-columns: 1fr 1fr; }
.fields.cols-3 { grid-template-columns: 1fr 1fr 1fr; }

.field-group {
  min-width: 0;
}

.modal label {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.modal input,
.modal select,
.modal textarea {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  background-color: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-input);
  box-sizing: border-box;
  resize: vertical;
}

.modal input:focus,
.modal select:focus,
.modal textarea:focus {
  outline: none;
  border-color: var(--accent);
}

.modal-buttons {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.modal button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button {
  background-color: #c23243;
  color: #f8f8fa;
}

.save-button {
  background-color: #32c251;
  color: #f8f8fa;
}

.delete-button {
  background-color: #c23243;
  color: #f8f8fa;
  display: flex;
  align-items: center;
  gap: 6px;
}
.oprava-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.oprava-row .fields {
  flex: 1;
}

.fields.cols-4 {
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

.delete-oprava-button {
  background: none;
  border: 1px solid #c23243;
  border-radius: 4px;
  color: #c23243;
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.add-oprava-button {
  background: none;
  border: 1px dashed var(--border);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px 12px;
  width: 100%;
}

.add-oprava-button:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.opravy-total {
  margin-top: 10px;
  text-align: right;
  font-size: 13px;
  color: var(--text-muted);
}

.opravy-total strong {
  color: var(--text-primary);
}
</style>