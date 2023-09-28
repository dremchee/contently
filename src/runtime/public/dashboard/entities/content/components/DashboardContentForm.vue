<script lang="ts" setup>
  import { watch, ref, computed } from '#imports';
  import ControlsGroup from '../../../../core/ControlsGroup.vue';
  import { fields as fieldsList } from '#contently/public/dashboard/entities/fields'
  import { Field } from '#contently/api/types';

  const props = defineProps<{
    modelValue: {
      published: boolean;
      content: Record<string, any>;
    };
    fields?: Field[];
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: typeof form.value];
  }>();

  const computedData = computed(() => props.modelValue);

  const form = ref({
    published: computedData.value?.published || false,
    content: computedData.value?.content || {},
  });

  watch(form.value, (value) => {
    emit('update:modelValue', value);
  })

  defineExpose({ form });
</script>

<template>
  <div :class="$style['form']">
    <template
      v-for="field in fields"
      :key="field.id"
    >
      <ControlsGroup
        v-show="!field.options.hidden"
        :label="field.name"
        :optional="field.key"
        :message="field.description"
      >
        <Component
          :is="fieldsList.find(e => e.type === field.type)?.view"
          v-model="form.content[field.key]"
          :data="field?.data?.[field.type]"
          :field="field"
        />
      </ControlsGroup>
    </template>
  </div>
</template>

<style module>
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
../../fields
