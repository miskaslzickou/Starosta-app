<script setup>
import { useProjectsStore } from '../stores/projects'
import { ref } from 'vue'
import { Trash2, Plus } from 'lucide-vue-next'

const props = defineProps(['projekt'])
const store = useProjectsStore()
const emit = defineEmits(['close'])

const activeTab = ref('projekt')

const tabs = [
  { key: 'projekt', label: 'Projekt' },
  { key: 'vyberoveRizeni', label: 'Výběrové řízení' },
  { key: 'dotace', label: 'Dotace' },
  { key: 'zhotovitel', label: 'Zhotovitel' },
]

function defaultSekce(terminy) {
  return { kontakty: [], poznamka: '', terminy }
}

function initSekce(existing, terminy) {
  if (!existing) return defaultSekce(terminy)
  return { ...defaultSekce(terminy), ...existing, terminy: { ...terminy, ...existing.terminy } }
}

const formData = ref(props.projekt ? {
  nazev: props.projekt.nazev ?? '',
  stav: props.projekt.stav ?? 'Přípravná',
  posledniStav: props.projekt.posledniStav ?? '',
  projekt: initSekce(props.projekt.projekt, { stavebniPovoleni: '', odevzdaniDok: '', upozorneni: '' }),
  vyberoveRizeni: initSekce(props.projekt.vyberoveRizeni, { odevzdaniNabidek: '', vyhlaseni: '', upozorneni: '' }),
  dotace: initSekce(props.projekt.dotace, { podpisSmlouvy: '', ukonceniRealizace: '', zva: '', upozorneni: '' }),
  zhotovitel: initSekce(props.projekt.zhotovitel, { ukonceniRealizace: '', zapocetRealizace: '', upozorneni: '' }),
} : {
  nazev: '',
  stav: 'Přípravná',
  posledniStav: '',
  projekt: defaultSekce({ stavebniPovoleni: '', odevzdaniDok: '', upozorneni: '' }),
  vyberoveRizeni: defaultSekce({ odevzdaniNabidek: '', vyhlaseni: '', upozorneni: '' }),
  dotace: defaultSekce({ podpisSmlouvy: '', ukonceniRealizace: '', zva: '', upozorneni: '' }),
  zhotovitel: defaultSekce({ ukonceniRealizace: '', zapocetRealizace: '', upozorneni: '' }),
})

function addKontakt(sekce) {
  formData.value[sekce].kontakty.push({ jmeno: '', funkce: '', tel: '', email: '' })
}

function deleteKontakt(sekce, index) {
  formData.value[sekce].kontakty.splice(index, 1)
}

function saveProject() {
  store.addProjects(formData.value)
  emit('close')
}

function saveEditedProject() {
  store.editProject(props.projekt.id, formData.value)
  emit('close')
}

function deleteProject() {
  store.deleteProject(props.projekt.id)
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
        <h2 v-if="props.projekt == null">Nový projekt</h2>
        <h2 v-else>{{ formData.nazev || 'Upravit projekt' }}</h2>
        <button v-if="props.projekt != null" @click="deleteProject" class="delete-button">
          <Trash2 :size="16" /> Smazat
        </button>
      </div>

      <section class="form-section">
        <h3>Základní informace</h3>
        <div class="fields cols-3">
          <div class="field-group">
            <label>Název projektu</label>
            <input type="text" placeholder="Název projektu" v-model="formData.nazev" />
          </div>
          <div class="field-group">
            <label>Stav</label>
            <select v-model="formData.stav">
              <option value="Přípravná">Přípravná</option>
              <option value="Zahájena">Zahájena</option>
              <option value="Probíhá">Probíhá</option>
              <option value="Ukončena">Ukončena</option>
            </select>
          </div>
          <div class="field-group">
            <label>Poslední stav</label>
            <input type="text" placeholder="Poslední stav" v-model="formData.posledniStav" />
          </div>
        </div>
      </section>

      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-tile"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- PROJEKT -->
      <div v-if="activeTab === 'projekt'" class="tab-content">
        <section class="form-section">
          <h3>Termíny</h3>
          <div class="fields cols-3">
            <div class="field-group">
              <label>Ukončení stavebního povolení</label>
              <input type="datetime-local" v-model="formData.projekt.terminy.stavebniPovoleni" />
            </div>
            <div class="field-group">
              <label>Odevzdání projektové dokumentace</label>
              <input type="datetime-local" v-model="formData.projekt.terminy.odevzdaniDok" />
            </div>
            <div class="field-group">
              <label>Upozornění</label>
              <input type="datetime-local" v-model="formData.projekt.terminy.upozorneni" />
            </div>
          </div>
        </section>
        <section class="form-section">
          <h3>Kontakty</h3>
          <div v-for="(k, i) in formData.projekt.kontakty" :key="i" class="kontakt-row">
            <div class="fields cols-4">
              <div class="field-group"><label>Jméno</label><input type="text" v-model="k.jmeno" /></div>
              <div class="field-group"><label>Funkce</label><input type="text" v-model="k.funkce" /></div>
              <div class="field-group"><label>Tel.</label><input type="tel" v-model="k.tel" /></div>
              <div class="field-group"><label>E-mail</label><input type="email" v-model="k.email" /></div>
            </div>
            <button class="delete-kontakt-button" @click="deleteKontakt('projekt', i)"><Trash2 :size="14" /></button>
          </div>
          <button class="add-kontakt-button" @click="addKontakt('projekt')"><Plus :size="14" /> Přidat kontakt</button>
        </section>
        <section class="form-section">
          <h3>Poznámka</h3>
          <textarea rows="3" v-model="formData.projekt.poznamka" placeholder="Poznámky..." />
        </section>
      </div>

      <!-- VÝBĚROVÉ ŘÍZENÍ -->
      <div v-if="activeTab === 'vyberoveRizeni'" class="tab-content">
        <section class="form-section">
          <h3>Termíny</h3>
          <div class="fields cols-3">
            <div class="field-group">
              <label>Odevzdání nabídek</label>
              <input type="datetime-local" v-model="formData.vyberoveRizeni.terminy.odevzdaniNabidek" />
            </div>
            <div class="field-group">
              <label>Vyhlášení VŘ</label>
              <input type="datetime-local" v-model="formData.vyberoveRizeni.terminy.vyhlaseni" />
            </div>
            <div class="field-group">
              <label>Upozornění</label>
              <input type="datetime-local" v-model="formData.vyberoveRizeni.terminy.upozorneni" />
            </div>
          </div>
        </section>
        <section class="form-section">
          <h3>Kontakty</h3>
          <div v-for="(k, i) in formData.vyberoveRizeni.kontakty" :key="i" class="kontakt-row">
            <div class="fields cols-4">
              <div class="field-group"><label>Jméno</label><input type="text" v-model="k.jmeno" /></div>
              <div class="field-group"><label>Funkce</label><input type="text" v-model="k.funkce" /></div>
              <div class="field-group"><label>Tel.</label><input type="tel" v-model="k.tel" /></div>
              <div class="field-group"><label>E-mail</label><input type="email" v-model="k.email" /></div>
            </div>
            <button class="delete-kontakt-button" @click="deleteKontakt('vyberoveRizeni', i)"><Trash2 :size="14" /></button>
          </div>
          <button class="add-kontakt-button" @click="addKontakt('vyberoveRizeni')"><Plus :size="14" /> Přidat kontakt</button>
        </section>
        <section class="form-section">
          <h3>Poznámka</h3>
          <textarea rows="3" v-model="formData.vyberoveRizeni.poznamka" placeholder="Poznámky..." />
        </section>
      </div>

      <!-- DOTACE -->
      <div v-if="activeTab === 'dotace'" class="tab-content">
        <section class="form-section">
          <h3>Termíny</h3>
          <div class="fields cols-2">
            <div class="field-group">
              <label>Podpis smlouvy o poskytnutí dotace</label>
              <input type="datetime-local" v-model="formData.dotace.terminy.podpisSmlouvy" />
            </div>
            <div class="field-group">
              <label>Ukončení realizace dle dotace</label>
              <input type="datetime-local" v-model="formData.dotace.terminy.ukonceniRealizace" />
            </div>
            <div class="field-group">
              <label>ZVA (závěrečné vyhodnocení akce)</label>
              <input type="datetime-local" v-model="formData.dotace.terminy.zva" />
            </div>
            <div class="field-group">
              <label>Upozornění</label>
              <input type="datetime-local" v-model="formData.dotace.terminy.upozorneni" />
            </div>
          </div>
        </section>
        <section class="form-section">
          <h3>Kontakty</h3>
          <div v-for="(k, i) in formData.dotace.kontakty" :key="i" class="kontakt-row">
            <div class="fields cols-4">
              <div class="field-group"><label>Jméno</label><input type="text" v-model="k.jmeno" /></div>
              <div class="field-group"><label>Funkce</label><input type="text" v-model="k.funkce" /></div>
              <div class="field-group"><label>Tel.</label><input type="tel" v-model="k.tel" /></div>
              <div class="field-group"><label>E-mail</label><input type="email" v-model="k.email" /></div>
            </div>
            <button class="delete-kontakt-button" @click="deleteKontakt('dotace', i)"><Trash2 :size="14" /></button>
          </div>
          <button class="add-kontakt-button" @click="addKontakt('dotace')"><Plus :size="14" /> Přidat kontakt</button>
        </section>
        <section class="form-section">
          <h3>Poznámka</h3>
          <textarea rows="3" v-model="formData.dotace.poznamka" placeholder="Poznámky..." />
        </section>
      </div>

      <!-- ZHOTOVITEL -->
      <div v-if="activeTab === 'zhotovitel'" class="tab-content">
        <section class="form-section">
          <h3>Termíny</h3>
          <div class="fields cols-3">
            <div class="field-group">
              <label>Ukončení realizace dle smlouvy</label>
              <input type="datetime-local" v-model="formData.zhotovitel.terminy.ukonceniRealizace" />
            </div>
            <div class="field-group">
              <label>Započetí realizace</label>
              <input type="datetime-local" v-model="formData.zhotovitel.terminy.zapocetRealizace" />
            </div>
            <div class="field-group">
              <label>Upozornění</label>
              <input type="datetime-local" v-model="formData.zhotovitel.terminy.upozorneni" />
            </div>
          </div>
        </section>
        <section class="form-section">
          <h3>Kontakty</h3>
          <div v-for="(k, i) in formData.zhotovitel.kontakty" :key="i" class="kontakt-row">
            <div class="fields cols-4">
              <div class="field-group"><label>Jméno</label><input type="text" v-model="k.jmeno" /></div>
              <div class="field-group"><label>Funkce</label><input type="text" v-model="k.funkce" /></div>
              <div class="field-group"><label>Tel.</label><input type="tel" v-model="k.tel" /></div>
              <div class="field-group"><label>E-mail</label><input type="email" v-model="k.email" /></div>
            </div>
            <button class="delete-kontakt-button" @click="deleteKontakt('zhotovitel', i)"><Trash2 :size="14" /></button>
          </div>
          <button class="add-kontakt-button" @click="addKontakt('zhotovitel')"><Plus :size="14" /> Přidat kontakt</button>
        </section>
        <section class="form-section">
          <h3>Poznámka</h3>
          <textarea rows="3" v-model="formData.zhotovitel.poznamka" placeholder="Poznámky..." />
        </section>
      </div>

      <div class="modal-buttons">
        <button class="close-button" @click="handleClose">Zavřít</button>
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
  width: 65%;
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

.tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.tab-tile {
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-surface);
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.15s;
}

.tab-tile:hover {
  border-color: var(--accent);
  color: var(--text-primary);
}

.tab-tile.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #f8f8fa;
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

.fields.cols-2 { grid-template-columns: 1fr 1fr; }
.fields.cols-3 { grid-template-columns: 1fr 1fr 1fr; }
.fields.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }

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

.kontakt-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
}

.kontakt-row .fields {
  flex: 1;
}

.delete-kontakt-button {
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

.add-kontakt-button {
  background: none;
  border: 1px dashed var(--border);
  border-radius: 4px;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px 12px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.add-kontakt-button:hover {
  border-color: var(--accent);
  color: var(--accent);
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
</style>