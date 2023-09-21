<script lang="ts" setup>
  defineProps<{
    modelValue: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  const onInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).checked);
  };
</script>

<template>
  <label
    class="switch-control"
    :class="[modelValue && 'is-checked']"
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
    width: 54px;
    height: 28px;
    border-radius: 32px;
    position: relative;
    transition: 0.2s;
    cursor: pointer;

    &.is-checked {
      background-color: var(--color-brand);
    }
  }

  .switch-control__input {
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
  }
</style>
