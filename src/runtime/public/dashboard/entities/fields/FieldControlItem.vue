<script lang="ts" setup>
  import { useContently } from '#imports';
  import IconControl from '#contently/public/core/IconControl.vue';

  const { t } = useContently();

  defineProps<{
    label: string;
    description?: string;
    icon?: string;
  }>()
</script>

<template>
  <div :class="$style['field']">
    <div
      v-if="icon"
      :class="$style['icon']"
    >
      <IconControl :name="icon" />
    </div>
    <div :class="$style['label']">
      {{ label }}
    </div>
    <div
      v-if="description"
      :class="$style['description']"
    >
      {{ description }}
    </div>
  </div>
</template>

<style module>
  .field {
    background-color: var(--color-white);
    padding: 12px 8px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
    box-shadow: var(--box-shadow-small);
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .icon {
    color: var(--color-secondary);

    &:hover {
      color: var(--color-default);
    }
  }
  .description {
    color: var(--color-secondary);
    font-family: var(--font-monospace);
    font-size: 14px;
    margin-left: auto;
  }
</style>
