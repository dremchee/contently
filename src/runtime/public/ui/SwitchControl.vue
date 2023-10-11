<script lang="ts" setup>
  import { computed } from '#imports';

  const props = withDefaults(defineProps<{
    modelValue: boolean;
    size?: 'small' | 'normal' | 'large';
    disabled?: boolean;
  }>(), {
    size: 'normal'
  });

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  const onInput = (e: Event) => {
    if(!props.disabled) {
      emit('update:modelValue', (e.target as HTMLInputElement).checked);
    }
  };

  const classList = computed(() => [
    props.modelValue && 'is-checked',
    props.disabled && 'is-disabled',
    props.size && `is-${props.size}`,
  ])
</script>

<template>
  <label
    class="switch-control"
    :class="classList"
  >
    <input
      type="checkbox"
      class="switch-control__input"
      @input="onInput"
    >
    <div class="switch-control__indicator" />
  </label>
</template>

<style scoped>
  .switch-control {
    display: flex;
    justify-content: flex-start;
    padding: 4px;
    align-items: center;
    background-color: var(--color-border);
    border: 1px solid var(--color-border);
    width: 54px;
    height: 28px;
    border-radius: 32px;
    position: relative;
    transition: 0.2s;
    cursor: pointer;

    &.is-checked {
      background-color: var(--color-brand);
      border: 1px solid var(--color-brand-dark);
    }

    &.is-disabled {
      background-color: var(--color-border-light);
    }

    &.is-small {
      width: 40px;
      height: 20px;
      padding: 2px;
    }
  }

  .switch-control__input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: -1;
    width: 0;
    height: 0;
  }

  .switch-control__indicator {
    width: 20px;
    height: 20px;
    background-color: var(--color-white);
    border-radius: 50%;
    transition: transform 0.2s;

    .is-checked & {
      transform: translateX(calc(100% + 5px));
    }
    .is-small & {
      width: 14px;
      height: 14px;

      .is-checked & {
        transform: translateX(calc(100% + 6px));
      }
    }
  }
</style>
