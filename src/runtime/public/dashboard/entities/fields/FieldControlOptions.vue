<script lang="ts" setup>
  import { computed, ref, useContently } from '#imports';
  import { nanoid } from 'nanoid';
  import ControlsGroup from '#contently/public/core/ControlsGroup.vue';
  import InputField from '#contently/public/core/InputField.vue';
  import ButtonControl from '#contently/public/core/ButtonControl.vue';
  import CheckboxControl from '#contently/public/core/CheckboxControl.vue';
  import FieldControlItem from './FieldControlItem.vue';
  import { fields } from '.';
  import { Field, FieldType } from '#contently/api/types';

  const { t } = useContently();

  const props = defineProps<{
    data: Partial<Field>;
    mode: 'create' | 'edit';
  }>();

  const emit = defineEmits<{
    save: [value: Field];
    remove: [value: string]
  }>();

  const currentData = computed(() => props.data).value;
  const currentField = computed(() => fields.find(e => e.type === props.data.type)).value;

  const defaultValue: Field = {
    id: currentData?.id || nanoid(),
    type: currentData?.type as FieldType,
    name: currentData?.name || '',
    description: currentData?.description || '',
    key: currentData?.key || '',
    options: {
      required: currentData?.options?.required || false,
      readonly: currentData?.options?.readonly || false,
      hidden: currentData?.options?.hidden || false,
      unique: currentData?.options?.unique || false,
    },
    data: {},
  };

  const field = ref({ ...defaultValue, ...currentData });

  const isEditMode = computed(() => props.mode === 'edit');
  const isPrimary = computed(() => field.value.options?.primaryKey)
  const isValid = computed(() => [field.value.key, field.value.name].every(e => e))

  const saveOptions = () => {
    emit('save', field.value as Field);
  };
</script>

<template>
  <div :class="$style['options']">
    <FieldControlItem
      :label="String(currentField?.name)"
      :icon="currentField?.icon || ''"
      :description="isPrimary && t('primaryKey') || ''"
    />
    <div :class="$style['controls']">
      <ControlsGroup :label="t('key')">
        <InputField
          v-model="field.key"
          :disabled="isEditMode"
        />
      </ControlsGroup>
      <ControlsGroup :label="t('fieldName')">
        <InputField v-model="field.name" />
      </ControlsGroup>
      <ControlsGroup :label="t('description')">
        <InputField v-model="field.description" />
      </ControlsGroup>
      <ControlsGroup>
        <div :class="$style['advanced']">
          <CheckboxControl
            v-model="field.options.required"
            :disabled="isPrimary"
            :label="t('required')"
          />
          <CheckboxControl
            v-model="field.options.readonly"
            :label="t('readonly')"
          />
          <CheckboxControl
            v-model="field.options.hidden"
            :label="t('hidden')"
          />
        </div>
      </ControlsGroup>
      <template v-if="currentField?.edit">
        <Component
          :is="currentField.edit"
          v-if="field.data"
          :id="currentField.type"
          v-model="field.data[String(currentField.type)]"
        />
      </template>
      <div :class="$style['action']">
        <ButtonControl
          :disabled="!isValid"
          icon="check"
          @click="saveOptions"
        >
          {{ mode === 'edit' ? t('save') : t('add') }}
        </ButtonControl>
        <ButtonControl
          v-if="mode === 'edit' && !isPrimary"
          variant="link"
          icon="trash"
          @click="emit('remove', field.id)"
        >
          {{ t('remove') }}
        </ButtonControl>
      </div>
    </div>
  </div>
</template>

<style module>
  .options {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
  }

  .action {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 16px;
  }

  .advanced {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
