<script lang="ts" setup>
  import { DocumentType, Collections } from '../../../../../api/types';
  import IconControl from '../../../../ui/IconControl.vue';
  import { DragHandle } from 'vue-slicksort'

  defineProps<{
    item: DocumentType<Collections>;
  }>();
</script>

<template>
  <div :class="$style['item']">
    <DragHandle :class="$style['icon']">
      <IconControl
        name="draggable"
      />
    </DragHandle>
    <div :class="$style['label']">
      {{ item.name }}
    </div>
    <div :class="$style['key']">
      {{ item.key }}
    </div>
    <div :class="$style['count']">
      {{ item.total }}
    </div>
  </div>
</template>

<style module>
  .item {
    display: flex;
    align-items: center;
    gap: 16px;
    background-color: var(--color-white);
    padding: 12px 16px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
    cursor: pointer;
    box-shadow: var(--box-shadow-small);

    &:hover {
      background-color: var(--color-background);
    }
  }
  .icon {
    cursor: ns-resize;
    color: var(--color-border);
    margin-left: -8px;

    &:hover {
      color: var(--color-default);
    }
  }

  .key {
    color: var(--color-secondary);
    font-family: var(--font-monospace);
  }

  .count {
    margin-left: auto;
    font-family: var(--font-monospace);
  }

  .action {
    margin-left: auto;
    color: var(--color-secondary);
  }
</style>
