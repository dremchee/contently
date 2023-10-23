<script lang="ts" setup>
  import { useContently, ref, onMounted, useRoute, computed, navigateTo } from '#imports';
  import { SlickList, SlickItem } from 'vue-slicksort'
  import { useToast } from '#runtime/public/ui/toast'
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ControlsGroup from '#runtime/public/ui/ControlsGroup.vue';
  import InputField from '#runtime/public/ui/InputField.vue';
  import SelectControl from '#runtime/public/ui/SelectControl.vue';
  import FieldControl from '#runtime/public/dashboard/entities/fields/FieldControl.vue';
  import FieldControlType from '#runtime/public/dashboard/entities/fields/FieldControlType.vue';
  import FieldControlOptions from '#runtime/public/dashboard/entities/fields/FieldControlOptions.vue';
  import ModalWindow from '../../../ui/modal/ModalWindow.vue';
  import CollapseControl from '#runtime/public/ui/CollapseControl.vue';

  import ButtonControl from '../../../ui/ButtonControl.vue';
  import type { DocumentType, Collections, Field, FieldType } from '#runtime/api/types';
  import { fields } from '#runtime/public/dashboard/entities/fields';
  import { RouterName } from '#runtime/public/core/const'
  import CheckboxControl from '#runtime/public/ui/CheckboxControl.vue';
  import SwitchControl from '#runtime/public/ui/SwitchControl.vue';

  const route = useRoute();
  const { api, t } = useContently();
  const { toastShow } = useToast()

  const isAddField = ref(false);
  const isEditField = ref(false);
  const selectFieldType = ref('' as FieldType);
  const selectEditField = ref({} as Field);
  const collection = ref({} as DocumentType<Collections>);
  const isSingleton = computed(() => collection.value.singleton)

  const filedItems = computed(() => (collection.value.fields?.map((item) => ({
      name: item.name,
      value: item.key,
    }))))

  const advancedOptions = ref({
    displayField: {} as Partial<{ name: string, value: string }>,
    aliasField: {} as Partial<{ name: string, value: string }>
  })

  const addField = (data: Field) => {
    collection.value.fields.push(data);
    closeStateField();
  };

  const updateField = (data: Field) => {
    const index = collection.value.fields.findIndex(e => e.id === data.id);

    collection.value.fields[index] = data;
    closeStateField();
  };

  const updateCollection = async () => {
    const payload: Partial<Collections> = {
      name: collection.value.name,
      fields: collection.value.fields || [],
      options: {
        displayField: advancedOptions.value.displayField?.value || '',
        aliasField: advancedOptions.value.aliasField?.value || ''
      }
    }

    await api.updateCollectionById(String(route.params.id), {
      ...payload,
    });
    toastShow({
      message: `Update fields from collection: ${collection.value.name}`,
      type: 'success'
    })
  };

  const advancedField = (type: string) => {
    const field = fields.find(e => e.type === type);
    if (field) {
      selectFieldType.value = field.type;
    }
  };

  const closeStateField = () => {
    selectFieldType.value = '' as FieldType;
    selectEditField.value = {} as Field;
    isAddField.value = false;
    isEditField.value = false;
  };

  const editField = (data: Field) => {
    isEditField.value = true;
    selectEditField.value = data;
  };

  const removeField = (id: string) => {
    const index = collection.value.fields.findIndex(e => e.id === id);
    collection.value.fields.splice(index, 1);

    toastShow({
      message: `Removed field: ${selectEditField.value.key}`,
      type: 'warning'
    })
    closeStateField()
  };


  const getCollection = async (key: string) => {
    const response = await api.getCollectionById(key);
    if (response.data) {
      collection.value = response.data;
      advancedOptions.value.displayField = filedItems.value.find(e => e.value === collection.value.options?.displayField) || {}
      advancedOptions.value.aliasField = filedItems.value.find(e => e.value === collection.value.options?.aliasField) || {}
    }
  };

  const sortUpdate = () => {

  }

  const removeCollection = async () => {
    await api.removeCollectionById(String(route.params.id))

    navigateTo({
      name: RouterName.COLLECTIONS_ITEMS
    })
  }

  const routeToContent = () => {
    navigateTo({
      name: RouterName.CONTENT_ITEMS,
      params: {
        id: collection.value._id
      }
    })
  }

  onMounted(async () => {
    getCollection(String(route.params.id));
  });
</script>

<template>
  <DashboardMainWrapper>
    <template #header>
      <DashboardHeader>
        <template #title>
          {{ t('collections') }}: {{ collection.name }}
        </template>
        <template #action>
          <ButtonControl
            size="small"
            icon="trash"
            variant="link-error"
            @click="removeCollection"
          >
            {{ t('remove') }}
          </ButtonControl>
          <ButtonControl
            size="small"
            icon="pencil"
            variant="link"
            @click="routeToContent"
          >
            {{ t('edit') }}
          </ButtonControl>
          <ButtonControl
            size="small"
            icon="check"
            variant="secondary"
            @click="updateCollection"
          >
            {{ t('save') }}
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>

    <div
      v-if="collection._id"
      :class="$style['collection']"
    >
      <template v-if="!route.query?.id">
        <SlickList
          v-model:list="collection.fields"
          :class="$style['fields']"
          axis="y"
          lock-axis="y"
          use-drag-handle
          @update:list="sortUpdate"
        >
          <SlickItem
            v-for="(field, index) in collection.fields"
            :key="field"
            :class="$style['fields-item']"
            :index="index"
          >
            <FieldControl
              :label="field.name"
              :alias="field.key"
              :hidden="field.options.hidden"
              :required="field.options.required"
              @click="editField(field)"
            />
          </SlickItem>
        </SlickList>
        <ButtonControl
          icon="plus"
          variant="secondary"
          @click="isAddField = !isAddField"
        >
          {{ t('addField') }}
        </ButtonControl>

        <ModalWindow
          v-model="isEditField"
          :title="t('editField')"
          direction="sidebar"
          @close="closeStateField"
        >
          <FieldControlOptions
            mode="edit"
            :data="selectEditField"
            @save="updateField"
            @remove="removeField"
          />
        </ModalWindow>

        <ModalWindow
          v-model="isAddField"
          :title="t('addField')"
          direction="sidebar"
          @close="closeStateField"
        >
          <div
            v-if="!selectFieldType"
            :class="$style['models']"
          >
            <FieldControlType
              v-for="{ type, name, icon } in fields"
              :key="type"
              :icon="icon"
              :label="String(name)"
              @click="advancedField(type)"
            />
          </div>
          <div
            v-else
          >
            <FieldControlOptions
              :data="{ type: selectFieldType }"
              mode="create"
              @save="addField"
            />
          </div>
        </ModalWindow>
      </template>
    </div>
    <div :class="$style['options']">
      <CollapseControl open>
        <template #trigger>
          <div :class="$style['options-title']">
            {{ t('advancedSettings') }}
          </div>
        </template>

        <div :class="$style['options-conatiner']">
          <ControlsGroup
            type="label"
            direction="row"
          >
            <CheckboxControl
              v-model="collection.singleton"
              :label="t('singleton')"
              size="small"
              disabled
            />
          </ControlsGroup>
          <ControlsGroup :label="t('key')">
            <InputField
              v-model="collection.key"
              disabled
            />
          </ControlsGroup>
          <ControlsGroup :label="t('name')">
            <InputField
              v-model="collection.name"
            />
          </ControlsGroup>

          <template v-if="!isSingleton">
            <ControlsGroup :label="t('displayFieldTemplate')">
              <SelectControl
                v-model="advancedOptions.displayField"
                :options="filedItems"
                cleanable
              />
            </ControlsGroup>
            <ControlsGroup :label="t('previewURL')">
              <SelectControl
                v-model="advancedOptions.aliasField"
                :options="filedItems"
                cleanable
              />
            </ControlsGroup>
          </template>
        </div>
      </CollapseControl>
    </div>
  </DashboardMainWrapper>
</template>

<style module>
  .collection {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .title-text {
    font-size: 24px;
  }

  .fields-item {
    padding: 4px 0;
  }

  .models {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .options {
    margin-top: 32px;
  }

  .options-title {
    font-weight: 500;
  }

  .options-conatiner {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
#runtime/api/types
