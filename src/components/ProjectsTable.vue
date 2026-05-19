<script setup>
import { useVueTable, FlexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table'
import { useProjectsStore } from '../stores/projects'

const store = useProjectsStore()
const stavBarvy = {
  'Příprava': '#6b7280',
  'Probíhá': '#3b82f6',
  'Pozastaveno': '#f59e0b',
  'Dokončeno': '#22c55e',
  'Zrušeno': '#ef4444',
}

const columns = [
  { accessorKey: 'nazev', header: 'Projekt' },
  { accessorKey: 'zhotovitel', header: 'Zhotovitel' },
  { accessorKey: 'dotace', header: 'Dotace', cell: info => info.getValue() ? info.getValue().toLocaleString('cs-CZ') + ' Kč' : '—' },
  { accessorKey: 'dok', header: 'Dok.', cell: info => info.getValue() ? '✓ Ano' : '✗ Ne' },
  { accessorKey: 'stavPov', header: 'Stav. Pov.', cell: info => info.getValue() ? '✓ Ano' : '✗ Ne' },
  { accessorKey: 'ukonceni', header: 'Ukončení' },
  { accessorKey: 'platnost', header: 'Platnost' },
  { accessorKey: 'stav', header: 'Stav' },
  { accessorKey: 'posledniStav', header: 'Poslední stav' },
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
      <tbody >
        <tr v-for="row in table.getRowModel().rows" :key="row.id" @click="$emit('rowClick', row.original)">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <span v-if="cell.column.id === 'stav'" class="stav-badge" :style="{ backgroundColor: stavBarvy[cell.getValue()] + '33', color: stavBarvy[cell.getValue()] }">
              {{ cell.getValue() }}
            </span>
            <span v-else-if="cell.column.id === 'dok' || cell.column.id === 'stavPov'" :style="{ color: cell.getValue() ? '#22c55e' : '#ef4444' }">
              <component :is="FlexRender" :render="cell.column.columnDef.cell" :props="cell.getContext()" />
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
  border-bottom: 1px solid #27272a;
}

th {
  text-align: left;
  padding: 10px 16px;
  color: #71717a;
  font-weight: 500;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

th:hover {
  color: #a1a1aa;
}

td {
  padding: 16px;
  border-bottom: 1px solid #1f1f23;
  color: #e4e4e7;
}

tr:hover td {
  background-color: #1c1c21;
}

.stav-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}
</style>