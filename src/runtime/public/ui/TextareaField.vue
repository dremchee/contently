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
  <div class="textarea-field">
    <textarea
      class="textarea-field__control"
      :value="modelValue"
      v-bind="$attrs"
      rows="4"
      @input="onInput"
    />
  </div>
</template>

<style scoped>
  .textarea-field {
    display: flex;
    width: 100%;
  }

  .textarea-field__control {
    width: 100%;
    border: 1px solid var(--color-border);
    min-height: var(--control-height);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-control-small);
    padding: 12px 10px;
    transition: border 0.2s;
    resize: vertical;
    line-height: 1.4;

    &:focus {
      outline: 1px solid var(--color-brand);
      border: 1px solid var(--color-brand);
    }
  }
</style>
