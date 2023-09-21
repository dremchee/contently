<script lang="ts" setup>
  defineProps<{
    modelValue: string;
  }>();

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const onInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
  };
</script>

<template>
  <div :class="$style['input']">
    <input
      :class="$style['field']"
      :value="modelValue"
      type="text"
      v-bind="$attrs"
      @input="onInput"
    >
  </div>
</template>

<style module>
  .input {
    display: flex;
    width: 100%;
  }

  .field {
    width: 100%;
    border: 1px solid var(--color-border);
    box-shadow: var(--box-shadow-control-small);
    min-height: var(--control-height);
    border-radius: var(--border-radius);
    padding: 4px 10px;
    transition: 0.2s;

    &:focus {
      outline: 1px solid var(--color-brand);
      border: 1px solid var(--color-brand);
    }
  }
</style>
