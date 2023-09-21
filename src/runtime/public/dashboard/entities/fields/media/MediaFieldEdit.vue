<script lang="ts" setup>
  import { computed } from '#imports';
  import InputField from '../../../../../core/InputField.vue';
  import ModalWindow from '#contently/public/core/modal/ModalWindow.vue';

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
  <div class="media-field">
    <input type="file">
  </div>
</template>

<style scoped>
  .media-field {
    display: flex;
  }
</style>
