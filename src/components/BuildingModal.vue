<script setup lang="ts">
import { useBuildingStore } from '../stores/buildings'
import { ref, computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps(['budova'])
const store = useBuildingStore()
const emit = defineEmits(['close'])

function cloneBuilding(building: any) {
  return building ? JSON.parse(JSON.stringify(building)) : null
}

const formData = ref(props.budova ? cloneBuilding(props.budova) : {
  nazev: '',
  cp: '',
  spotreba: {
    plyn: [],
    voda: [],
    elektrina: { vt: [], nt: [] }
  },
  naklady: []
})

function saveBuilding() {
  store.addBuilding(JSON.parse(JSON.stringify(formData.value)))
  emit('close')
}

function saveEditedBuilding() {
  store.editBuilding(props.budova.id, JSON.parse(JSON.stringify(formData.value)))
  emit('close')
}

function deleteBuilding() {
  store.deleteBuilding(props.budova.id)
  emit('close')
}

const filterOd = ref('')
const filterDo = ref('')

function inPeriod(obdobi: string) {
  if (!filterOd.value && !filterDo.value) return true
  if (filterOd.value && obdobi < filterOd.value) return false
  if (filterDo.value && obdobi > filterDo.value) return false
  return true
}

function sumArr(arr: any[]) {
  return (arr ?? []).filter(z => z.obdobi && inPeriod(z.obdobi)).reduce((s, z) => s + Number(z.hodnota), 0)
}

function sumArrCena(arr: any[]) {
  return (arr ?? []).filter(z => z.obdobi && inPeriod(z.obdobi)).reduce((s, z) => s + Number(z.cena ?? 0), 0)
}

const souhrn = computed(() => {
  const plynCena = sumArrCena(formData.value.spotreba?.plyn)
  const vodaCena = sumArrCena(formData.value.spotreba?.voda)
  const vtCena = sumArrCena(formData.value.spotreba?.elektrina?.vt)
  const ntCena = sumArrCena(formData.value.spotreba?.elektrina?.nt)
  const provozNaklady = (formData.value.naklady ?? []).filter((n: any) => n.obdobi && inPeriod(n.obdobi)).reduce((s: number, n: any) => s + Number(n.castka), 0)
  return {
    plyn: sumArr(formData.value.spotreba?.plyn),
    voda: sumArr(formData.value.spotreba?.voda),
    vt: sumArr(formData.value.spotreba?.elektrina?.vt),
    nt: sumArr(formData.value.spotreba?.elektrina?.nt),
    plynCena,
    vodaCena,
    vtCena,
    ntCena,
    energieCelkem: plynCena + vodaCena + vtCena + ntCena,
    naklady: provozNaklady,
    celkem: plynCena + vodaCena + vtCena + ntCena + provozNaklady,
  }
})

function addRecord(pole: any[]) {
  pole.push({ obdobi: '', hodnota: 0, cena: 0 })
}

function addCost() {
  formData.value.naklady.push({ obdobi: '', castka: 0 })
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
        <h2 v-if="props.budova == null">Nová budova</h2>
        <h2 v-else>Upravit budovu {{ formData.nazev }}</h2>
        <button v-if="props.budova != null" @click="deleteBuilding" class="delete-button">
          <Trash2 :size="16" /> Smazat
        </button>
      </div>

      <section class="form-section">
        <h3>Základní informace</h3>
        <div class="fields cols-2">
          <div class="field-group">
            <label>Název budovy</label>
            <input type="text" placeholder="Obecní úřad" v-model="formData.nazev" />
          </div>
          <div class="field-group">
            <label>Č.p.</label>
            <input type="text" placeholder="1" v-model="formData.cp" />
          </div>
        </div>
      </section>

      <section class="form-section summary-section">
        <div class="summary-header">
          <h3>Přehled spotřeby</h3>
          <div class="period-filter">
            <input type="month" v-model="filterOd" placeholder="Od" />
            <span>–</span>
            <input type="month" v-model="filterDo" placeholder="Do" />
            <button v-if="filterOd || filterDo" class="reset-period" @click="filterOd = ''; filterDo = ''">Vše</button>
          </div>
        </div>
        <div class="summary-tiles">
          <div class="summary-tile">
            <div class="summary-tile-title">Spotřeba (m³ / kWh)</div>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Plyn</span>
                <span class="summary-value">{{ souhrn.plyn.toLocaleString('cs-CZ') }} m³</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Voda</span>
                <span class="summary-value">{{ souhrn.voda.toLocaleString('cs-CZ') }} m³</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Elektřina VT</span>
                <span class="summary-value">{{ souhrn.vt.toLocaleString('cs-CZ') }} kWh</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Elektřina NT</span>
                <span class="summary-value">{{ souhrn.nt.toLocaleString('cs-CZ') }} kWh</span>
              </div>
              <div class="summary-item highlight-soft">
                <span class="summary-label">Elektřina celkem</span>
                <span class="summary-value">{{ (souhrn.vt + souhrn.nt).toLocaleString('cs-CZ') }} kWh</span>
              </div>
            </div>
          </div>
          <div class="summary-tile">
            <div class="summary-tile-title">Náklady (Kč)</div>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Plyn</span>
                <span class="summary-value">{{ souhrn.plynCena.toLocaleString('cs-CZ') }} Kč</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Voda</span>
                <span class="summary-value">{{ souhrn.vodaCena.toLocaleString('cs-CZ') }} Kč</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Elektřina VT</span>
                <span class="summary-value">{{ souhrn.vtCena.toLocaleString('cs-CZ') }} Kč</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Elektřina NT</span>
                <span class="summary-value">{{ souhrn.ntCena.toLocaleString('cs-CZ') }} Kč</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Energie celkem</span>
                <span class="summary-value">{{ souhrn.energieCelkem.toLocaleString('cs-CZ') }} Kč</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Náklady na provoz</span>
                <span class="summary-value">{{ souhrn.naklady.toLocaleString('cs-CZ') }} Kč</span>
              </div>
              <div class="summary-item highlight">
                <span class="summary-label">Celkové náklady</span>
                <span class="summary-value">{{ souhrn.celkem.toLocaleString('cs-CZ') }} Kč</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="form-section">
        <h3>Spotřeba plynu (m³)</h3>
        <div v-for="(z, i) in formData.spotreba.plyn" :key="i" class="zaznam-row">
          <div class="">
              <label for="">Období(měsíc):</label>
              <input type="month" v-model="z.obdobi" />
          </div>
      
           <div class="field-group">
            <label for="">Množství:</label>
            <input type="number" placeholder="m³" v-model="z.hodnota" />
           </div>
            <div class="field-group">
                 <label for="">Hodnota v korunách:</label>
          <input type="number" placeholder="Kč" v-model="z.cena" />
            </div>
         
          <button class="delete-zaznam-button" @click="formData.spotreba.plyn.splice(i, 1)"><Trash2 :size="14" /></button>
        </div>
        <button class="add-button" @click="addRecord(formData.spotreba.plyn)">+ Přidat záznam</button>
      </section>

      <section class="form-section">
        <h3>Spotřeba vody (m³)</h3>
        <div v-for="(z, i) in formData.spotreba.voda" :key="i" class="zaznam-row">
          <input type="month" v-model="z.obdobi" />
          <input type="number" placeholder="m³" v-model="z.hodnota" />
          <input type="number" placeholder="Kč" v-model="z.cena" />
          <button class="delete-zaznam-button" @click="formData.spotreba.voda.splice(i, 1)"><Trash2 :size="14" /></button>
        </div>
        <button class="add-button" @click="addRecord(formData.spotreba.voda)">+ Přidat záznam</button>
      </section>

      <section class="form-section">
        <h3>Elektřina VT (kWh)</h3>
        <div v-for="(z, i) in formData.spotreba.elektrina.vt" :key="i" class="zaznam-row">
          <input type="month" v-model="z.obdobi" />
          <input type="number" placeholder="kWh" v-model="z.hodnota" />
          <input type="number" placeholder="Kč" v-model="z.cena" />
          <button class="delete-zaznam-button" @click="formData.spotreba.elektrina.vt.splice(i, 1)"><Trash2 :size="14" /></button>
        </div>
        <button class="add-button" @click="addRecord(formData.spotreba.elektrina.vt)">+ Přidat záznam</button>
      </section>

      <section class="form-section">
        <h3>Elektřina NT (kWh)</h3>
        <div v-for="(z, i) in formData.spotreba.elektrina.nt" :key="i" class="zaznam-row">
          <input type="month" v-model="z.obdobi" />
          <input type="number" placeholder="kWh" v-model="z.hodnota" />
          <input type="number" placeholder="Kč" v-model="z.cena" />
          <button class="delete-zaznam-button" @click="formData.spotreba.elektrina.nt.splice(i, 1)"><Trash2 :size="14" /></button>
        </div>
        <button class="add-button" @click="addRecord(formData.spotreba.elektrina.nt)">+ Přidat záznam</button>
      </section>

      <section class="form-section">
        <h3>Náklady na provoz</h3>
        <div v-for="(n, i) in formData.naklady" :key="i" class="zaznam-row">
          <input type="month" v-model="n.obdobi" />
          <input type="number" placeholder="Kč" v-model="n.castka" />
          <button class="delete-zaznam-button" @click="formData.naklady.splice(i, 1)"><Trash2 :size="14" /></button>
        </div>
        <button class="add-button" @click="addCost">+ Přidat záznam</button>
      </section>

      <div class="modal-buttons">
        <button class="close-button" @click="handleClose">Zavřít</button>
        <button class="save-button" @click="saveBuilding" v-if="props.budova == null">Uložit budovu</button>
        <button class="save-button" @click="saveEditedBuilding" v-else>Uložit změny</button>
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
.modal input, .modal select { display: block; width: 100%; margin-bottom: 10px; padding: 8px; background-color: var(--bg-input); border: 1px solid var(--border); border-radius: 4px; color: var(--text-input); box-sizing: border-box; }
.modal input:focus { outline: none; border-color: var(--accent); }
.zaznam-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.zaznam-row input { flex: 1; margin-bottom: 0; }
.delete-zaznam-button { background: none; border: 1px solid #c23243; border-radius: 4px; color: #c23243; cursor: pointer; padding: 6px; display: flex; align-items: center; }
.add-button { background: none; border: 1px dashed var(--border); border-radius: 4px; color: var(--text-muted); cursor: pointer; padding: 8px 12px; width: 100%; margin-top: 4px; }
.add-button:hover { border-color: var(--accent); color: var(--accent); }
.modal-buttons { display: flex; gap: 8px; margin-top: 10px; }
.modal button { padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; }
.close-button { background-color: #c23243; color: #f8f8fa; }
.save-button { background-color: #32c251; color: #f8f8fa; }
.delete-button { background-color: #c23243; color: #f8f8fa; display: flex; align-items: center; gap: 6px; }
.summary-section { background-color: var(--bg-surface); }
.summary-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.summary-header h3 { margin: 0; }
.period-filter { display: flex; align-items: center; gap: 6px; }
.period-filter input { width: 140px; margin-bottom: 0; padding: 5px 7px; font-size: 12px; }
.period-filter span { color: var(--text-muted); }
.reset-period { background: none; border: 1px solid var(--border); border-radius: 4px; color: var(--text-muted); cursor: pointer; padding: 4px 8px; font-size: 12px; }
.reset-period:hover { border-color: var(--accent); color: var(--accent); }
.summary-tiles { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.summary-tile { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 8px; padding: 12px; }
.summary-tile-title { font-size: 12px; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
.summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.summary-item.highlight-soft { border-color: var(--text-muted); }
.summary-item { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 6px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; }
.summary-item.highlight { border-color: var(--accent); }
.summary-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.summary-value { font-size: 16px; font-weight: 600; color: var(--text-primary); }
.summary-item.highlight .summary-value { color: var(--accent); }
</style>