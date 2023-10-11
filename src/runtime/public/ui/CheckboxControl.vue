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
    class="checkbox-control"
    :class="classList"
  >
    <input
      type="checkbox"
      class="checkbox-control__input"
      :checked="modelValue"
      @input="onInput"
    >
    <div class="checkbox-control__indicator" />
    <div
      v-if="label"
      class="checkbox-control__label"
    >
      {{ label }}
    </div>
  </label>
</template>

<style scoped>
  .checkbox-control {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    transition: 0.2s;
    cursor: pointer;
    width: 100%;
  }

  .checkbox-control__input {
    opacity: 0;
    z-index: -1;
    width: 0;
    height: 0;
  }

  .checkbox-control__indicator {
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    box-shadow: var(--box-shadow-control-small);
    width: 24px;
    height: 24px;
    border-radius: 4px;
    transition: 0.2s;
    position: relative;

    &::before {
      content: '';
      width: 6px;
      height: 12px;
      position: absolute;
      border-right: 2px solid var(--color-white);
      border-bottom: 2px solid var(--color-white);
      transform: rotate(45deg);
      left: 0;
      top: -4px;
      right: 0;
      bottom: 0;
      margin: auto;
      opacity: 0;
    }

    .is-checked & {
      background-color: var(--color-brand);
      border: 1px solid var(--color-brand-light);

      &::before {
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

  .checkbox-control__label {
    margin-left: 8px;

    .is-disabled & {
      color: var(--color-secondary);
    }
  }
</style>
