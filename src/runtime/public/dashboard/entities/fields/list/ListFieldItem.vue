<script lang="ts" setup>
import { computed } from '#imports'
import IconControl from '#runtime/public/ui/IconControl.vue';
import { DragHandle } from 'vue-slicksort'

const props = withDefaults(defineProps<{
  title: string
  size: 'small' | 'default'
}>(), {
  size: 'default'
})

const emit = defineEmits(['remove'])

const classList = computed(() => ([
  props.size && `is-${props.size}`
]))

const sizeIcon = props.size === 'small' ? 16 : 24
</script>

<template>
  <div
    class="list-field-item"
    :class="classList"
  >
    <DragHandle class="list-field-item__drag">
      <IconControl
        name="draggable"
        :size="sizeIcon"
      />
    </DragHandle>
    <div class="list-field-item__text">
      {{ title }}
    </div>
    <div class="list-field-item__close">
      <IconControl
        name="close"
        :size="sizeIcon"
        @click.stop="emit('remove')"
      />
    </div>
  </div>
</template>

<style scoped>
  .list-field-item {
    background-color: var(--color-white);
    padding: 6px 8px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
    box-shadow: var(--box-shadow-small);
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: pointer;
    transition: .2s;

    &:hover {
      background-color: var(--color-background);

      .list-field-item__close {
        opacity: 1;
      }
    }

    &.is-small {
      padding: 2px 4px;
      font-size: 14px;
    }
  }

  .list-field-item__drag {
    cursor: ns-resize;
    color: var(--color-border);

    &:hover {
      color: var(--color-default);
    }
  }

  .list-field-item__close {
    margin-left: auto;
    display: flex;
    width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.2s;
    color: var(--color-border);
    opacity: 0;

    &:hover {
      color: var(--color-default);
    }
  }
</style>
