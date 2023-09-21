<script lang="ts" setup>
  import { computed, ref, useContently, watch } from '#imports';
  import { DocumentType, Files, File } from '#contently/api/types'
  import ModalWindow from '#contently/public/core/modal/ModalWindow.vue';
  import PreviewFileControl from '#contently/public/core/PreviewFileControl.vue';
  import DashboardFileCard from './DashboardFileCard.vue';

  const { api, previewUrl } = useContently()

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
      files.value = response.data
    }
  }

  const selectFile = (file: DocumentType<File>) => {
    input.value = false
    emit('select', file)
  }

  const isSelected = ref(false)

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
    title="Choose file"
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
