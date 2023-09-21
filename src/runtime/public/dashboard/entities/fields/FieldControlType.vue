<script lang="ts" setup>
  import { useContently } from '#imports';
  import IconControl from '#contently/public/core/IconControl.vue';

  const { t } = useContently();

  defineProps<{
    label: string;
    icon?: string;
  }>()
</script>

<template>
  <div class="field-type">
    <div
      v-if="icon"
      class="field-type__icon"
    >
      <IconControl :name="icon" />
    </div>
    <div class="field-type__label">
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
  .field-type {
    background-color: var(--color-white);
    padding: 12px 8px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
    box-shadow: var(--box-shadow-small);
    display: flex;
    gap: 16px;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: var(--color-background);
    }
  }

  .field-type__icon {
    color: var(--color-secondary);

    &:hover {
      color: var(--color-default);
    }
  }
</style>
