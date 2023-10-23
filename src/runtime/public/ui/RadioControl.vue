<script lang="ts" setup>
  import { computed } from '#imports';

  const props = defineProps<{
    modelValue: boolean;
    label?: string;
    disabled?: boolean
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  const onInput = (e: Event) => {
    props.disabled || emit('update:modelValue', (e.target as HTMLInputElement).checked);
  };

  const classList = computed(() => [
    props.modelValue && 'is-checked',
    props.disabled && 'is-disabled',
  ])
</script>

<template>
  <label
    class="radio-control"
    :class="classList"
  >
    <input
      type="checkbox"
      class="radio-control__input"
      :checked="modelValue"
      @input="onInput"
    >
    <div class="radio-control__indicator" />
    <div
      v-if="label"
      class="radio-control__label"
    >
      {{ label }}
    </div>
  </label>
</template>

<style scoped>
  .radio-control {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    transition: 0.2s;
    cursor: pointer;
    width: 100%;
  }

  .radio-control__input {
    opacity: 0;
    z-index: -1;
    width: 0;
    height: 0;
  }

  .radio-control__indicator {
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    box-shadow: var(--box-shadow-control-small);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    transition: 0.2s;
    position: relative;

    &::before {
      content: '';
      width: 12px;
      height: 12px;
      position: absolute;
      background-color: var(--color-white);
      border-radius: 50%;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      opacity: 0;
      transform: scale(0);
      transition: .1s;
    }

    .is-checked & {
      background-color: var(--color-brand);
      border: 1px solid var(--color-brand-light);

      &::before {
        transform: scale(1);
        opacity: 1;
      }

      .is-disabled & {
        border: 1px solid var(--color-border);

        &::before {
          border-color: var(--color-secondary);
        }
      }
    }

    .is-disabled & {
      background-color: var(--color-border-light);
    }
  }

  .radio-control__label {
    margin-left: 8px;

    .is-disabled & {
      color: var(--color-secondary);
    }
  }
</style>
