<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from '#imports';
  import ControlsGroup from '#runtime/public/ui/ControlsGroup.vue';
  import CheckboxControl from '#runtime/public/ui/CheckboxControl.vue';
  import SelectControl from '#runtime/public/ui/SelectControl.vue';
  import type { SelectType } from '#runtime/public/ui/SelectControl.vue';
  import TagsControl from '#runtime/public/ui/TagsControl.vue';
  import InputField from '../../../../../ui/InputField.vue';
  import ModalWindow from '#runtime/public/ui/modal/ModalWindow.vue';

  type ModelValue = {
    type?: string,
    options?: any
  }

  const props = defineProps<{
    modelValue: ModelValue
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: ModelValue];
  }>();

  const files = [{
    name: 'Image',
    value: 'image',
  }, {
    name: 'File',
    value: 'file',
  }]

  const defaultValue: ModelValue = {
    type: files[0].value,
    options: {
      multiply: false
    }
  }

  const file = ref(files.find(e => e.value === (props.modelValue?.type || defaultValue.type)))
  const options = ref(props.modelValue?.options || { ...defaultValue.options })

  watch(() => [file.value, options.value], () => {
    if(file.value) {
      emit('update:modelValue', { type: file.value?.value, options: options.value });
    }
  })

  onMounted(() => {
    emit('update:modelValue', { type: file.value?.value, options: options.value });
  })
</script>

<template>
  <div class="media-field">
    <ControlsGroup
      v-if="file"
      label="Select file type"
    >
      <SelectControl
        v-model="file"
        :options="files"
      />
    </ControlsGroup>
    <ControlsGroup>
      <CheckboxControl
        v-model="options.multiply"
        label="Multiply files"
      />
    </ControlsGroup>
  </div>
</template>

<style scoped>
  .media-field {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
</style>
