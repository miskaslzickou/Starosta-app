<script setup lang="ts">
import { useSmlouvyStore } from '../stores/smlouvy'
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps(['smlouva'])
const store = useSmlouvyStore()
const emit = defineEmits(['close'])

const formData = ref(props.smlouva ? JSON.parse(JSON.stringify(props.smlouva)) : {
  najemnik: '',
  druhNajmu: 'pozemek',
  datumPodpisu: '',
  datumUkonceni: '',
  upozorneni: 2592000000,
  specifikace: '',
})

function save() {
  store.addContract(formData.value)
  emit('close')
}

function saveEdited() {
  store.editContract(props.smlouva.id, formData.value)
  emit('close')
}

function remove() {
  store.deleteContract(props.smlouva.id)
  emit('close')
}

const initialData = JSON.stringify(formData.value)

function handleClose() {
  if (JSON.stringify(formData.value) !== initialData) {
    if (!confirm('Změny nebyly uloženy. Opravdu zavřít?')) return
  }
  emit('close')
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2 v-if="props.smlouva == null">Nová smlouva</h2>
        <h2 v-else>Upravit smlouvu – {{ formData.najemnik }}</h2>
        <button v-if="props.smlouva != null" @click="remove" class="delete-button">
          <Trash2 :size="16" /> Smazat
        </button>
      </div>

      <section class="form-section">
        <h3>Základní informace</h3>
        <div class="fields cols-2">
          <div class="field-group">
            <label>Nájemník</label>
            <input type="text" placeholder="Jméno nájemníka" v-model="formData.najemnik" />
          </div>
          <div class="field-group">
            <label>Druh nájmu</label>
            <select v-model="formData.druhNajmu">
              <option value="pozemek">Pozemek</option>
              <option value="nebytovy">Nebytový prostor</option>
              <option value="bytovy">Bytový prostor</option>
            </select>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Termíny</h3>
        <div class="fields cols-2">
          <div class="field-group">
            <label>Datum podpisu</label>
            <input type="date" v-model="formData.datumPodpisu" />
          </div>
          <div class="field-group">
            <label>Datum ukončení</label>
            <input type="date" v-model="formData.datumUkonceni" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Upozornění</h3>
        <div class="fields cols-1">
          <div class="field-group">
            <label>Upozornit před ukončením</label>
            <select v-model="formData.upozorneni">
              <option :value="604800000">Týden před ukončením</option>
              <option :value="2592000000">Měsíc před ukončením</option>
              <option :value="7776000000">3 měsíce před ukončením</option>
            </select>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Specifikace</h3>
        <div class="field-group">
          <textarea rows="4" placeholder="Podrobnosti smlouvy..." v-model="formData.specifikace" />
        </div>
      </section>

      <div class="modal-buttons">
        <button class="close-button" @click="handleClose">Zavřít</button>
        <button class="save-button" @click="save" v-if="props.smlouva == null">Uložit smlouvu</button>
        <button class="save-button" @click="saveEdited" v-else>Uložit změny</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal { background-color: var(--bg-elevated); color: var(--text-primary); padding: 20px; border-radius: 15px; width: 45%; border: 1px solid var(--border); max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.modal h2 { margin: 0; }
.form-section { margin-bottom: 16px; padding: 12px; border: 1px solid var(--border); border-radius: 6px; }
.form-section h3 { margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; }
.fields { display: grid; gap: 0 12px; }
.fields.cols-1 { grid-template-columns: 1fr; }
.fields.cols-2 { grid-template-columns: 1fr 1fr; }
.field-group { min-width: 0; }
.modal label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
.modal input, .modal select, .modal textarea { display: block; width: 100%; margin-bottom: 10px; padding: 8px; background-color: var(--bg-input); border: 1px solid var(--border); border-radius: 4px; color: var(--text-input); box-sizing: border-box; resize: vertical; }
.modal input:focus, .modal select:focus, .modal textarea:focus { outline: none; border-color: var(--accent); }
.modal-buttons { display: flex; gap: 8px; margin-top: 10px; }
.modal button { padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; }
.close-button { background-color: #c23243; color: #f8f8fa; }
.save-button { background-color: #32c251; color: #f8f8fa; }
.delete-button { background-color: #c23243; color: #f8f8fa; display: flex; align-items: center; gap: 6px; }
</style>
