<script lang="ts" setup>
  import { computed } from '#imports';
  import EditorControl from '#runtime/public/ui/editor/EditorControl.vue';
  import type { EditorModelValue } from '#runtime/public/ui/editor/editor';

  const props = defineProps<{
    modelValue: EditorModelValue;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: EditorModelValue];
  }>();


  const input = computed({
    get() {
      return props.modelValue;
    },
    set(value: EditorModelValue) {
      emit('update:modelValue', value);
    },
  });
</script>

<template>
  <EditorControl v-model="input" />
</template>
