<script setup>
import { useVueTable, FlexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table'
import { useVehicleStore } from '../stores/vehicles'

const store = useVehicleStore()
const emit = defineEmits(['rowClick'])

function getDateColor(datum, upozorneni) {
  if (!datum) return ''
  const technicka = new Date(datum)
  const dnes = new Date()
  const rozdil = technicka.getTime() - dnes.getTime()
  
  if (rozdil < 0) return '#ef4444'                        // propadlé - červená
  if (rozdil <= Number(upozorneni)) return '#f59e0b'      // blíží se - oranžová
  return '#22c55e'                                         // ok - zelená
}

const columns = [
  { accessorKey: 'nazev', header: 'Název' },
  { accessorKey: 'vin', header: 'VIN' },
  {accessorKey:'upozorneni', header:'Upozornění',accessorFn: row => {
      const upozorneni = parseInt(row.upozorneni)
      if (upozorneni === 1209600000) return 'Dva týdny před termínem'
      if (upozorneni === 604800000) return 'Týden před termínem'
      if (upozorneni === 2592000000) return 'Měsíc před termínem'
      return ''
    } },
  {accessorKey:'technicka', header:'Technická'},
  {accessorKey:'pojisteni', header:'Pojištění'},
  {accessorKey:'poznamky',header:'Poznámky'},
  {
    id: 'opravy',
    header: 'Opravy celkem',
    accessorFn: (row: any) => {
      const opravy = row.opravy ?? []
      if (!opravy.length) return '—'
      const total = opravy.reduce((s: number, o: any) => s + Number(o.cenaSDph ?? 0), 0)
      return `${opravy.length} × / ${total.toLocaleString('cs-CZ')} Kč`
    }
  }

]

const table = useVueTable({
  get data() { return store.filtred },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
</script>

<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th
            v-for="header in table.getHeaderGroups()[0].headers"
            :key="header.id"
            @click="header.column.toggleSorting()"
          >
            <component :is="FlexRender" :render="header.column.columnDef.header" :props="header.getContext()" />
            {{ header.column.getIsSorted() === 'asc' ? '▲' : header.column.getIsSorted() === 'desc' ? '▼' : '' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id" @click="emit('rowClick', row.original)">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <span v-if="cell.column.id === 'technicka'" :style="{ color: getDateColor(cell.getValue(), row.original.upozorneni) }">
              {{ cell.getValue() }}
            </span>
            <span v-else>
              <component :is="FlexRender" :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>



<style scoped>
.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead tr {
  border-bottom: 1px solid var(--border-subtle);
}

th {
  text-align: left;
  padding: 10px 16px;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

th:hover {
  color: var(--text-secondary);
}

td {
  padding: 16px;
  border-bottom: 1px solid var(--border-row);
  color: var(--text-primary);
}

tr:hover td {
  background-color: var(--bg-surface);
}

.stav-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
</style>
