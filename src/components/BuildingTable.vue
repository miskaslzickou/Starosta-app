<script setup lang="ts">
import { useVueTable, FlexRender, getCoreRowModel, getSortedRowModel } from '@tanstack/vue-table'
import { useBuildingStore } from '../stores/buildings'

const props = defineProps<{ obdobiOd?: string; obdobiDo?: string }>()
const store = useBuildingStore()
const emit = defineEmits(['rowClick'])

function inPeriod(obdobi: string) {
  if (!props.obdobiOd && !props.obdobiDo) return true
  if (props.obdobiOd && obdobi < props.obdobiOd) return false
  if (props.obdobiDo && obdobi > props.obdobiDo) return false
  return true
}

function sumArr(arr: any[]) {
  if (!arr?.length) return 0
  return arr.filter(z => inPeriod(z.obdobi)).reduce((s: number, z: any) => s + Number(z.hodnota), 0)
}

function fmtNaklady(naklady: any[]) {
  if (!naklady?.length) return '—'
  const sum = naklady.filter(n => inPeriod(n.obdobi)).reduce((s: number, n: any) => s + Number(n.castka), 0)
  return sum.toLocaleString('cs-CZ') + ' Kč'
}

const columns = [
  { accessorKey: 'nazev', header: 'Název budovy' },
  { accessorKey: 'cp', header: 'Č.p.' },
  {
    id: 'plyn',
    header: 'Plyn (m³)',
    accessorFn: (row: any) => sumArr(row.spotreba?.plyn) || '—'
  },
  {
    id: 'voda',
    header: 'Voda (m³)',
    accessorFn: (row: any) => sumArr(row.spotreba?.voda) || '—'
  },
  {
    id: 'vt',
    header: 'Elektřina VT (kWh)',
    accessorFn: (row: any) => sumArr(row.spotreba?.elektrina?.vt) || '—'
  },
  {
    id: 'nt',
    header: 'Elektřina NT (kWh)',
    accessorFn: (row: any) => sumArr(row.spotreba?.elektrina?.nt) || '—'
  },
  {
    id: 'naklady',
    header: 'Náklady na provoz',
    accessorFn: (row: any) => fmtNaklady(row.naklady)
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