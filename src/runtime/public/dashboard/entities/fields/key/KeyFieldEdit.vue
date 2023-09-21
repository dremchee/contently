<script lang="ts" setup>
  import { computed, useContently, onMounted } from '#imports';
  import CheckboxControl from '#contently/public/core/CheckboxControl.vue';
  import ControlsGroup from '#contently/public/core/ControlsGroup.vue';
  import { KeyFieldData } from './types'

  const defaultProps: KeyFieldData = {
    autoGenerateKey: false
  }

  const props = defineProps<{
    modelValue: KeyFieldData;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: KeyFieldData];
  }>();

  const { t } = useContently()

  const input = computed({
    get() {
      return props.modelValue;
    },
    set(value: KeyFieldData) {
      emit('update:modelValue', value);
    },
  });

  onMounted(() => {
    if(!props.modelValue) {
      input.value = defaultProps
    }
  })
</script>

<template>
  <div class="text-field">
    <ControlsGroup :label="t('options')">
      <div
        v-for="(item, key) in input"
        :key="key"
      >
        <CheckboxControl
          v-model="input[key]"
          :label="t('autoGenerateKey')"
        />
      </div>
    </ControlsGroup>
  </div>
</template>

<style scoped>
  .text-field {
    display: flex;
  }
</style>
