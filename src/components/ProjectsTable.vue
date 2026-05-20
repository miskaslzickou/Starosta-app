<script setup>
import { useVueTable, FlexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table'
import { useProjectsStore } from '../stores/projects'
import { validateDate } from '../utils/util'
const store = useProjectsStore()
const stavBarvy = {
  'Probíhá': '#3b82f6',
  'Stavba zahájena': '#f59e0b',
  'Hotovo': '#22c55e',
}

const columns = [
  { accessorKey: 'nazev', header: 'Projekt' },
  { accessorKey: 'zhotovitel', header: 'Zhotovitel + kontakt' },
  { accessorKey: 'projektant', header: 'Projektant + kontakt' },
  { accessorKey: 'dotace', header: 'Dotace' },
  { accessorKey: 'dok', header: 'Dokumentace', cell: info => info.getValue() ? '✓ Ano' : '✗ Ne' },
  { accessorKey: 'stavPov', header: 'Stav. Pov.', cell: info => info.getValue() ? '✓ Ano' : '✗ Ne' },
  { accessorKey: 'ziskani', header: 'Datum získání', cell: info => {
    const value = info.getValue()
    if (!value) return ''
    const [rok, mesic, den] = value.split('-')
    return `${den}. ${mesic}. ${rok}`
  }},
  { accessorKey: 'ukonceni', header: 'Datum ukončení', cell: info => {
    const value = info.getValue()
    if (!value) return ''
    const [rok, mesic, den] = value.split('-')
    return `${den}. ${mesic}. ${rok}`
  }},
  {
    accessorKey: 'platnost',
    header: 'Platnost',
    accessorFn: row => {
      return validateDate(row.ukonceni)
    }
  },
  { accessorKey: 'upozorneni', header: 'Upozornění',
    accessorFn: row => {
      const upozorneni = parseInt(row.upozorneni)
      if (upozorneni === 1209600000) return 'Dva týdny před termínem'
      if (upozorneni === 604800000) return 'Týden před termínem'
      if (upozorneni === 2592000000) return 'Měsíc před termínem'
      return ''
    }
  },
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
      <tbody>
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
