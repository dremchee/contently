<script lang="ts" setup>
  import { computed, onMounted } from '#imports';
  import type { Field } from '#runtime/api/types';
  import { FieldType } from '#runtime/api/types';
  import InputField from '#runtime/public/ui/InputField.vue';
  import { nanoid } from 'nanoid';
  import type { KeyFieldData } from './types';

  const props = defineProps<{
    modelValue: string;
    field: Field<KeyFieldData>
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

  onMounted(() => {
    if(props.field.data?.[FieldType.KEY].autoGenerateKey && !input.value) {
      input.value = nanoid()
    }
  })
</script>

<template>
  <div :class="$style['field']">
    <InputField
      v-model="input"
      :disabled="field.options.readonly"
    />
  </div>
</template>

<style module>
  .field {
    display: flex;
  }
</style>
