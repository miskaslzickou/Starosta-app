<script setup>
defineProps(['number', 'title', 'color'])
</script>

<template>
  <div class="stat-card">
    <div class="icon-box" :style="{ backgroundColor: color + '22', color: color }">
      <slot name="icon"></slot>
    </div>
    <div>
      <p class="number">{{ number }}</p>
      <span class="title">{{ title }}</span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: var(--bg-surface);
  border-radius: 12px;
  border: 1px solid var(--border);
  padding: 20px;
  color: var(--text-primary);
}

.stat-card:hover {
  border: 1px solid v-bind(color);
  transition-duration: 0.3s;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box svg {
  width: 22px;
  height: 22px;
}

.number {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.title {
  font-size: 13px;
  color: var(--text-muted);
}
</style>
