<script setup lang="ts">
import { useVueTable, FlexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table'
import { useSmlouvyStore } from '../stores/smlouvy'

const store = useSmlouvyStore()
const emit = defineEmits(['rowClick'])

function getDateColor(datum: string, upozorneni: number) {
  if (!datum) return ''
  const d = new Date(datum)
  const dnes = new Date()
  const rozdil = d.getTime() - dnes.getTime()
  if (rozdil < 0) return '#ef4444'
  if (rozdil <= Number(upozorneni)) return '#f59e0b'
  return '#22c55e'
}

const druhyNajmu: Record<string, string> = {
  pozemek: 'Pozemek',
  nebytovy: 'Nebytový prostor',
  bytovy: 'Bytový prostor',
}

const columns = [
  { accessorKey: 'najemnik', header: 'Nájemník' },
  {
    id: 'druhNajmu',
    header: 'Druh nájmu',
    accessorFn: (row: any) => druhyNajmu[row.druhNajmu] ?? row.druhNajmu
  },
  { accessorKey: 'datumPodpisu', header: 'Datum podpisu' },
  { accessorKey: 'datumUkonceni', header: 'Datum ukončení' },
  {
    id: 'specifikace',
    header: 'Specifikace',
    accessorFn: (row: any) => row.specifikace?.length > 50 ? row.specifikace.slice(0, 50) + '…' : row.specifikace
  },
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
            <span v-if="cell.column.id === 'datumUkonceni'" :style="{ color: getDateColor(cell.getValue() as string, row.original.upozorneni) }">
              {{ cell.getValue() }}
            </span>
            <component v-else :is="FlexRender" :render="cell.column.columnDef.cell" :props="cell.getContext()" />
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
