<script lang="ts" setup>
  import { watch, ref, computed, onMounted } from '#imports';
  import ControlsGroup from '#runtime/public/ui/ControlsGroup.vue';
  import { fields as fieldList, validateFieldsSchema } from '#runtime/public/dashboard/entities/fields'
  import { Field } from '#runtime/api/types';
  import { z } from "zod";

  const props = defineProps<{
    modelValue: {
      published: boolean;
      content: Record<string, any>;
    };
    fields?: Field[];
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: typeof form.value];
    'validate': [value: any];
  }>();

  const data = computed(() => props.modelValue);
  const errors = ref<z.ZodFormattedError<typeof props.modelValue>>()

  const schema = z.object({
    published: z.boolean(),
    content: props.fields ? validateFieldsSchema(props.fields) : z.object({})
  })

  const form = ref({
    published: data.value?.published,
    content: data.value?.content || {},
  });

  const checkParseValue = (value: typeof props.modelValue) => {
    const result = schema?.safeParse(value)

    if(!result.success) {
      errors.value = result.error.format()
      return emit('validate', result.error.format());
    } else {
      errors.value = undefined
      return emit('validate', undefined);
    }
  }

  const handleSubmit = async () => await checkParseValue(form.value)

  watch(form.value, (value) => {
    emit('update:modelValue', value);
  })

  defineExpose({ form, handleSubmit });
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
        :message="errors?.content?.[field.key]?._errors[0] || field.description"
        :required="field.options.required"
        :error="Boolean(errors?.content?.[field.key])"
      >
        <Component
          :is="fieldList.find(e => e.type === field.type)?.view"
          v-model="form.content[field.key]"
          :data="field?.data?.[field.type]"
          :field="field"
          :error="Boolean(errors?.content?.[field.key])"
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
