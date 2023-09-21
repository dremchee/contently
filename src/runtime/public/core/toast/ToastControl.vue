<script lang="ts" setup>
  import { computed } from '#imports';
  import IconControl from '../IconControl.vue';
  import type { ToastTypes } from '.'

  const props = withDefaults(defineProps<{
    text: string;
    type: ToastTypes
  }>(), {
    type: 'default'
  })

  const emit = defineEmits(['close'])

  const classList = computed(() => [
    props.type && `is-${props.type}`
  ])

  const icons = {
    default: 'info',
    success: 'check',
    error: 'alert',
    warning: 'alert'
  }
</script>

<template>
  <div
    class="toast-control"
    :class="classList"
  >
    <div class="toast-control__inner">
      <div class="toast-control__icon">
        <IconControl :name="icons[type]" />
      </div>
      <div
        class="toast-control__text"
      >
        <span v-html="text" />
      </div>
      <div
        class="toast-control__close"
        @click="emit('close')"
      >
        <IconControl
          :size="18"
          name="close"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .toast-control {
    background-color: var(--color-white);
    box-shadow: var(--box-shadow);
    align-self: flex-end;
    pointer-events: all;
    border-radius: var(--border-radius);
    color: var(--color-brand);
    overflow: hidden;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: .2;
      z-index: 1;
    }

    &.is-success {
      color: var(--color-white);
      background-color: var(--color-success);
    }

    &.is-error {
      color: var(--color-white);
      background-color: var(--color-error);
    }

    &.is-warning {
      color: var(--color-white);
      background-color: var(--color-warning);
    }

    &:hover {
      .toast-control__close {
        opacity: 0.6;
      }
    }
  }

  .toast-control__inner {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    position: relative;
    z-index: 1;
  }

  .toast-control__icon {
    margin-left: -8px;
  }

  .toast-control__text {
    display: flex;
    align-items: center;
  }

  .toast-control__close {
    display: flex;
    width: 24px;
    height: 24px;
    font-weight: 100;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-right: -8px;
    cursor: pointer;
    transition: 0.2s;
    border-radius: var(--border-radius);
    color: currentColor;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  }
</style>
