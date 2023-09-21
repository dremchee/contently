<script lang="ts" setup>
  import { computed } from '#imports';
  import TextareaField from '#contently/public/core/TextareaField.vue';

  const props = defineProps<{
    modelValue: string;
  }>();
  const emit = defineEmits<{
    'update:modelValue': [value: string];
  }>();

  const input = computed({
    get() {
      return props.modelValue;
    },
    set(value: string) {
      emit('update:modelValue', value);
    },
  });
</script>

<template>
  <div class="textarea-field">
    <TextareaField v-model="input" />
  </div>
</template>

<style scoped>
  .textarea-field {
    display: flex;
  }
</style>
