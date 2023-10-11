<script lang="ts" setup>
  import { computed, ref, useContently, watch } from '#imports';
  import { DocumentType, Files, File } from '#runtime/api/types'
  import ModalWindow from '#runtime/public/ui/modal/ModalWindow.vue';
  import DashboardFileCard from './DashboardFileCard.vue';

  const { api, t } = useContently()

  const props = defineProps<{
    modelValue: boolean;
  }>();
  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    'select': [value: DocumentType<File>]
  }>();

  const files = ref({} as Files)

  const getFiles = async () => {
    const response = await api.getFiles({ type: 'image' })

    if(response?.data) {
      files.value = response.data.value.data
    }
  }

  const selectFile = (file: DocumentType<File>) => {
    input.value = false
    emit('select', file)
  }

  const input = computed({
    get() {
      return props.modelValue;
    },
    set(value: boolean) {
      emit('update:modelValue', value);
    },
  });

  watch(() => props.modelValue, (value) => {
    if(value) {
      getFiles()
    }
  })

</script>

<template>
  <ModalWindow
    v-model="input"
    :title="t('chooseFile')"
    direction="sidebar"
    size="large"
  >
    <div
      class="dashboard-upload-files__list"
    >
      <DashboardFileCard
        v-for="item in files.items"
        :key="item._id"
        :item="item"
        mode="static"
        @click="selectFile(item)"
      />
    </div>
  </ModalWindow>
</template>

<style scoped>
  .dashboard-upload-files__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
    gap: 24px;
  }
</style>
