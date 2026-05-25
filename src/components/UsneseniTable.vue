<script setup lang="ts">
import { useVueTable, FlexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table'
import { useUsneseniStore } from '../stores/usneseni'

const store = useUsneseniStore()
const emit = defineEmits(['rowClick'])

const columns = [
  { accessorKey: 'cisloUsneseni', header: 'Číslo usnesení' },
  { accessorKey: 'nazev', header: 'Název' },
  {
    id: 'textUsneseni',
    header: 'Text usnesení',
    accessorFn: (row: any) => row.textUsneseni?.length > 60 ? row.textUsneseni.slice(0, 60) + '…' : row.textUsneseni
  },
  { accessorKey: 'trvani', header: 'Trvání' },
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
          <th v-for="header in table.getHeaderGroups()[0].headers" :key="header.id" @click="header.column.toggleSorting()">
            <component :is="FlexRender" :render="header.column.columnDef.header" :props="header.getContext()" />
            {{ header.column.getIsSorted() === 'asc' ? '▲' : header.column.getIsSorted() === 'desc' ? '▼' : '' }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in table.getRowModel().rows" :key="row.id" @click="emit('rowClick', row.original)">
          <td v-for="cell in row.getVisibleCells()" :key="cell.id">
            <component :is="FlexRender" :render="cell.column.columnDef.cell" :props="cell.getContext()" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
thead tr { border-bottom: 1px solid var(--border); }
th { text-align: left; padding: 10px 16px; color: var(--text-muted); font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; user-select: none; white-space: nowrap; }
th:hover { color: var(--text-secondary); }
td { padding: 16px; border-bottom: 1px solid var(--border); color: var(--text-primary); }
tr:hover td { background-color: var(--bg-surface); }
</style>
