<script lang="ts" setup>
  import { computed, useContently, useCssModule } from '#imports';
  import IconControl from '../IconControl.vue';
  import type { ToastTypes } from '.'
  const { breakpoint } = useContently()

  const props = withDefaults(defineProps<{
    message: string;
    type: ToastTypes
  }>(), {
    type: 'default'
  })

  const emit = defineEmits(['close'])

  const style = useCssModule()

  const classList = computed(() => [
    props.type && style[`is-${props.type}`],
    !breakpoint.tablet.value && style['is-compact']
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
    :class="[$style['toast'], classList]"
  >
    <div :class="$style['inner']">
      <div :class="$style['icon']">
        <IconControl :name="icons[type]" />
      </div>
      <div
        :class="$style['text']"
      >
        <span v-html="message" />
      </div>
      <div
        :class="$style['close']"
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

<style module>
  .toast {
    background-color: var(--color-white);
    box-shadow: var(--box-shadow);
    align-self: flex-end;
    pointer-events: all;
    border-radius: var(--border-radius);
    color: var(--color-brand);
    overflow: hidden;
    position: relative;

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

    &.is-compact {
      width: 100%;
    }

    &:hover {
      .toast-control__close {
        opacity: 0.6;
      }
    }
  }

  .inner {
    display: flex;
    gap: 8px;
    padding: 8px 16px;
    position: relative;
    z-index: 1;
  }

  .icon {
    margin-left: -8px;
  }

  .text {
    display: flex;
    align-items: center;
  }

  .close {
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
    opacity: 0.2;
    margin-left: auto;

    .is-compact & {
      opacity: 0.6;
    }

    &:hover {
      opacity: 1;
    }
  }
</style>
