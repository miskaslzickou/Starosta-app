<script setup>
import { useProjectsStore } from '../stores/projects'
import { ref } from 'vue'
import {Trash, Trash2} from 'lucide-vue-next'
import{validateDate} from'../utils/util'
const props = defineProps(['projekt'])
const store = useProjectsStore()

const formData = ref(props.projekt ? { ...props.projekt } : {
  nazev: '',
  zhotovitel: '',
  projektant: '',
  dotace: '',
  dok: false,
  stavPov: false,
  ziskani: '',
  ukonceni: '',
  upozorneni: '1209600000',
  stav: 'Probíhá',
  posledniStav: '',
})
const emit = defineEmits(['close'])

function saveProject() {
  store.addProjects(formData.value)
  emit('close')
}
function saveEditedProject() {
  store.editProject(props.projekt.id, formData.value)
  emit('close')
}
function deleteProject(){
  store.deleteProject(props.projekt.id)
  emit('close')
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h2 v-if="props.projekt == null">Nový projekt</h2>
        <h2 v-else>Upravit projekt {{ formData.nazev }}</h2>
        <button v-if="props.projekt != null" @click="deleteProject" class="delete-button">
          <Trash2 :size="16" /> Smazat
        </button>
      </div>
     
      
      <section class="form-section">
        <h3>Účastníci projektu</h3>
        <div class="fields cols-3">
          <div class="field-group">
            <label>Název projektu:</label>
            <input type="text" placeholder="Název projektu" v-model="formData.nazev" />
          </div>
          <div class="field-group">
            <label>Zhotovitel:</label>
            <input type="text" placeholder="Zhotovitel + kontakt" v-model="formData.zhotovitel" />
          </div>
          <div class="field-group">
            <label>Projektant:</label>
            <input type="text" placeholder="Projektant + kontakt" v-model="formData.projektant" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Finance a dokumentace</h3>
        <div class="fields cols-3">
          <div class="field-group">
            <label>Dotace:</label>
            <input type="text" placeholder="Dotace" v-model="formData.dotace" />
          </div>
          <div class="field-group">
            <label>Projektová dokumentace:</label>
            <select v-model="formData.dok">
              <option :value="true">Ano</option>
              <option :value="false">Ne</option>
            </select>
          </div>
          <div class="field-group">
            <label>Stavební povolení:</label>
            <select v-model="formData.stavPov">
              <option :value="true">Ano</option>
              <option :value="false">Ne</option>
            </select>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Termíny</h3>
        <div class="fields cols-2">
          <div class="field-group">
            <label>Datum získání:</label>
            <input type="date" v-model="formData.ziskani" />
          </div>
          <div class="field-group">
            <label>Datum ukončení:</label>
            <input type="date" v-model="formData.ukonceni" />
          </div>
          <div class="field-group">
            <label for="">Platnost</label>
            <p>{{ validateDate(formData.ukonceni) }}</p>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Stav a upozornění</h3>
        <div class="fields cols-2">
          <div class="field-group">
            <label>Stav:</label>
            <select v-model="formData.stav">
              <option value="Probíhá">Probíhá</option>
              <option value="Stavba zahájena">Stavba zahájena</option>
              <option value="Hotovo">Hotovo</option>
            </select>
          </div>
          <div class="field-group">
            <label>Poslední stav:</label>
            <input type="text" placeholder="Poslední stav" v-model="formData.posledniStav" />
          </div>
          <div class="field-group">
            <label>Upozornění:</label>
            <select v-model="formData.upozorneni">
              <option :value="1209600000">Dva týdny před termínem</option>
              <option :value="604800000">Týden před termínem</option>
              <option :value="2592000000">Měsíc před termínem</option>
            </select>
          </div>
        </div>
      </section>

      <div class="modal-buttons">
        <button class="close-button" @click="emit('close')">Zavřít</button>
        <button class="save-button" @click="saveProject" v-if="props.projekt == null">Uložit nový projekt</button>
        <button class="save-button" @click="saveEditedProject" v-else>Uložit změny</button>
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

.modal h2 {
  margin-top: 0;
  margin-bottom: 15px;
  text-align: left;
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

.fields.cols-2 {
  grid-template-columns: 1fr 1fr;
}

.fields.cols-3 {
  grid-template-columns: 1fr 1fr 1fr;
}

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
.modal select {
  display: block;
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  background-color: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-input);
  box-sizing: border-box;
}

.modal input:focus,
.modal select:focus {
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
.delete-button{
   background-color: #c23243;
   color: #f8f8fa;
 display: flex;
  align-items: center;
  gap: 6px;
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
</style>
