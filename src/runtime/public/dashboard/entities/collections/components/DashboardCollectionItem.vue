<script lang="ts" setup>
  import type { Collections } from '#runtime/api/types';

  defineProps<{
    item: Collections;
  }>();
</script>

<template>
  <div class="board-collection-item">
    <div class="board-collection-item__title">
      {{ item.name }} (key: {{ item.key }})
    </div>
  </div>
</template>

<style scoped>
  .board-collection-item {
    background-color: var(--color-white);
    padding: 8px 16px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
  }
</style>
