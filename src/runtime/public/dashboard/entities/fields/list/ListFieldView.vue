<script lang="ts" setup>
  import { computed, ref, useContently } from '#imports';
  import { SlickList, SlickItem } from 'vue-slicksort'
  import ModalWindow from '#runtime/public/ui/modal/ModalWindow.vue';
  import ButtonControl from '#runtime/public/ui/ButtonControl.vue';
  import ControlsGroup from '#runtime/public/ui/ControlsGroup.vue';
  import { FieldType } from '#runtime/api/types';
  import ListFieldItem from './ListFieldItem.vue';
  import { fields } from '..';
  import { nanoid } from 'nanoid';

  const { t } = useContently()

  type ListType = {
    key: string;
    name: string;
    type: FieldType
  }

  type ListItemType = {
    id?: string;
    [key: string]: unknown;
  }

  const props = defineProps<{
    data: ListType[];
    modelValue: ListItemType[];
  }>();
  const emit = defineEmits<{
    'update:modelValue': [value: any];
  }>();

  const items = ref<ListItemType[]>(computed(() => props.modelValue).value || [])
  const form = ref({} as ListItemType)
  const openModalForm = ref(false);

  const saveItem = () => {
    const indexItem = items.value.indexOf(form.value)
    const hasItem = items.value.some(e => e.id === form.value.id)

    if(hasItem) {
      items.value[indexItem] = form.value
    } else {
      items.value.push({
        id: nanoid(),
        ...form.value
      })
    }


    openModalForm.value = false
    emit('update:modelValue', items.value)
    resetState()
  }

  const removeItem = (index: number) => {
    items.value.splice(index, 1)
  }

  const editItem = (item: ListItemType) => {
    form.value = item
    openModalForm.value = true
  }

  const sortUpdate = () => {
    emit('update:modelValue', items.value)
  }

  const resetState = () => {
    form.value = {}
  }
</script>

<template>
  <div :class="$style['field']">
    <SlickList
      v-model:list="items"
      :class="$style['list']"
      axis="y"
      lock-axis="y"
      use-drag-handle
      @update:list="sortUpdate"
    >
      <SlickItem
        v-for="(item, index) in items"
        :key="item"
        :class="$style['item']"
        :index="index"
      >
        <ListFieldItem
          :title="String(Object.values(item)[1])"
          @remove="removeItem(index)"
          @click="editItem(item)"
        />
      </SlickItem>
    </SlickList>
    <ModalWindow
      v-model="openModalForm"
      :title="t('addItem')"
      @close="resetState"
    >
      <div
        :class="$style['form']"
      >
        <template
          v-for="(item, index) in data"
          :key="index"
        >
          <ControlsGroup
            :label="item.name"
            :optional="item.key"
          >
            <Component
              :is="fields.find(e => e.type === item.type)?.view"
              v-model="form[item.key]"
            />
          </ControlsGroup>
        </template>
        <ButtonControl
          @click="saveItem"
        >
          {{ t('save') }}
        </ButtonControl>
      </div>
    </ModalWindow>

    <div
      :class="$style['action']"
    >
      <ButtonControl
        variant="link"
        icon="plus"
        block
        @click="openModalForm = true"
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
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .action {
    width: 100%;
  }

  .item {
    padding: 4px 0;
  }
</style>
../../../../../api/types
