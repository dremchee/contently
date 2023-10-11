<script lang="ts" setup>
  import { computed } from '#imports';
  import InputField from '#runtime/public/ui/InputField.vue';

  const props = defineProps<{
    modelValue: string;
    error?: boolean
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
  <div class="text-field">
    <InputField
      v-model="input"
      :error="error"
    />
  </div>
</template>

<style scoped>
  .text-field {
    display: flex;
  }
</style>
