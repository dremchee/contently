<script lang="ts" setup>
  import { ref, useContently } from '#imports';
  import { SlickList, SlickItem } from 'vue-slicksort'
  import ListFieldItem from './ListFieldItem.vue';
  import ControlsGroup from '#contently/public/core/ControlsGroup.vue';
  import InputField from '#contently/public/core/InputField.vue';
  import ButtonControl from '#contently/public/core/ButtonControl.vue';
  import SelectControl from '#contently/public/core/SelectControl.vue';
  import { fields, PRIMITIVE_FIELDS } from '../';

  const props = defineProps<{
    id: string;
    modelValue: any;
  }>();

  const emit = defineEmits<{
    'update:modelValue': [value: any];
  }>();

  const { t } = useContently()

  const types = fields.filter(e => PRIMITIVE_FIELDS.includes(e.type)).map(({ name, type: value }) => ({ name, value }));

  const form = ref({
    key: '',
    name: '',
    type: types[0].value,
  });

  const items = ref(props.modelValue || []);
  const isCreating = ref(false);
  const selectedType = ref(types[0]);

  const changeType = (type: typeof types[number]) => {
    selectedType.value = type;
    form.value.type = type.value
  };

  const saveItem = () => {
    emit('update:modelValue', items.value);

    items.value.push({ ...form.value });
    resetState()
  };

  const resetState = () => {
    form.value.name = '';
    form.value.key = '';
    form.value.type = types[0].value;
    isCreating.value = false;
  }

  const removeItem = (index: number) => {
    items.value.splice(index, 1)
    emit('update:modelValue', items.value);
  }

  const sortUpdate = () => {
    emit('update:modelValue', items.value);
  }

  const cancel = () => {
    resetState()
  }
</script>

<template>
  <div :class="$style['field']">
    <ControlsGroup :label="t('fieldList')">
      <div v-if="!isCreating">
        <SlickList
          v-model:list="items"
          axis="y"
          lock-axis="y"
          class="list-field__items"
          use-drag-handle
          @update:list="sortUpdate"
        >
          <SlickItem
            v-for="(item, index) in items"
            :key="item"
            :index="index"
            :class="$style['item']"
          >
            <ListFieldItem
              :title="item.name"
              @remove="removeItem(index)"
            />
          </SlickItem>
        </SlickList>
      </div>
      <div
        v-else
        :class="$style['form']"
      >
        <InputField
          v-model="form.key"
          :placeholder="t('key')"
        />
        <InputField
          v-model="form.name"
          :placeholder="t('name')"
        />

        <SelectControl
          :model-value="selectedType"
          :options="types"
          @update:model-value="changeType"
        />

        <div :class="$style['action']">
          <ButtonControl
            variant="link"
            size="small"
            block
            @click="cancel"
          >
            {{ t('cancel') }}
          </ButtonControl>
          <ButtonControl
            block
            variant="secondary"
            size="small"
            @click="saveItem"
          >
            {{ t('save') }}
          </ButtonControl>
        </div>
      </div>
    </ControlsGroup>
    <div
      v-if="!isCreating"
      :class="$style['action']"
    >
      <ButtonControl
        size="small"
        icon="plus"
        variant="link"
        block
        @click="isCreating = true"
      >
        {{ t('addItem') }}
      </ButtonControl>
    </div>
  </div>
</template>

<style module>
  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: var(--color-background);
    padding: 16px 24px;
    border-radius: var(--border-radius);
    /* border: 1px solid var(--color-border-light); */
    box-shadow: var(--box-shadow-small);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .item {
    z-index: 1000;
    padding: 4px 0;
  }

  .action {
    display: flex;
    gap: 8px;
  }
</style>
..
