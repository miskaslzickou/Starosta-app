<script setup lang="ts">
import { useUsneseniStore } from '../stores/usneseni'
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps(['usneseni'])
const store = useUsneseniStore()
const emit = defineEmits(['close'])

const formData = ref(props.usneseni ? JSON.parse(JSON.stringify(props.usneseni)) : {
  cisloUsneseni: '',
  nazev: '',
  trvani: '',
  textUsneseni: '',
})

function save() {
  store.addResolution(formData.value)
  emit('close')
}

function saveEdited() {
  store.editResolution(props.usneseni.id, formData.value)
  emit('close')
}

function remove() {
  store.deleteResolution(props.usneseni.id)
  emit('close')
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2 v-if="props.usneseni == null">Nové usnesení</h2>
        <h2 v-else>Upravit usnesení {{ formData.cisloUsneseni }}</h2>
        <button v-if="props.usneseni != null" @click="remove" class="delete-button">
          <Trash2 :size="16" /> Smazat
        </button>
      </div>

      <section class="form-section">
        <h3>Základní informace</h3>
        <div class="fields cols-2">
          <div class="field-group">
            <label>Číslo usnesení</label>
            <input type="text" placeholder="např. 2024/001" v-model="formData.cisloUsneseni" />
          </div>
          <div class="field-group">
            <label>Název</label>
            <input type="text" placeholder="Název usnesení" v-model="formData.nazev" />
          </div>
        </div>
        <div class="field-group">
          <label>Trvání</label>
          <input type="text" placeholder="např. 2024-01-01 až 2024-12-31 nebo neurčito" v-model="formData.trvani" />
        </div>
      </section>

      <section class="form-section">
        <h3>Text usnesení</h3>
        <div class="field-group">
          <textarea rows="6" placeholder="Plný text usnesení..." v-model="formData.textUsneseni" />
        </div>
      </section>

      <div class="modal-buttons">
        <button class="close-button" @click="emit('close')">Zavřít</button>
        <button class="save-button" @click="save" v-if="props.usneseni == null">Uložit usnesení</button>
        <button class="save-button" @click="saveEdited" v-else>Uložit změny</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100; }
.modal { background-color: var(--bg-elevated); color: var(--text-primary); padding: 20px; border-radius: 15px; width: 50%; border: 1px solid var(--border); max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; }
.modal h2 { margin: 0; }
.form-section { margin-bottom: 16px; padding: 12px; border: 1px solid var(--border); border-radius: 6px; }
.form-section h3 { margin: 0 0 10px 0; font-size: 13px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; }
.fields { display: grid; gap: 0 12px; }
.fields.cols-2 { grid-template-columns: 1fr 1fr; }
.field-group { min-width: 0; }
.modal label { display: block; font-size: 13px; color: var(--text-muted); margin-bottom: 4px; }
.modal input, .modal textarea { display: block; width: 100%; margin-bottom: 10px; padding: 8px; background-color: var(--bg-input); border: 1px solid var(--border); border-radius: 4px; color: var(--text-input); box-sizing: border-box; resize: vertical; }
.modal input:focus, .modal textarea:focus { outline: none; border-color: var(--accent); }
.modal-buttons { display: flex; gap: 8px; margin-top: 10px; }
.modal button { padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; }
.close-button { background-color: #c23243; color: #f8f8fa; }
.save-button { background-color: #32c251; color: #f8f8fa; }
.delete-button { background-color: #c23243; color: #f8f8fa; display: flex; align-items: center; gap: 6px; }
</style>
