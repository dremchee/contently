<script lang="ts" setup>
  import { computed, ref, useContently } from '#imports';
  import { DocumentType, Files, File } from '#runtime/api/types'
  import ModalWindow from '#runtime/public/ui/modal/ModalWindow.vue';
  import UploadControl from '#runtime/public/ui/UploadControl.vue';
  import PreviewFileControl from '#runtime/public/ui/PreviewFileControl.vue';
  import DashboardFileCard from '#runtime/public/dashboard/entities/files/DashboardFileCard.vue';
  import ButtonControl from '#runtime/public/ui/ButtonControl.vue';
  import DashboardUploadFiles from '#runtime/public/dashboard/entities/files/DashboardUploadFiles.vue';

  const { api } = useContently()

  const props = defineProps<{
    modelValue: string;
  }>();
  const emit = defineEmits<{
    'update:modelValue': [value: string];
  }>();

  const files = ref<DocumentType<File>[]>([])
  const file = ref({} as DocumentType<File>)

  const getFiles = async () => {
    const { data } = await api.getFiles()

    if(data.value?.data) {
      files.value = data.value?.data.items
    }
  }

  const getFile = async (id: string) => {
    const response = await api.getFile(id)

    if(response.data) {
      file.value = response.data
    }
  }

  const selectFile = (file: DocumentType<File>) => {
    isSelected.value = false
    input.value = file._id
  }

  const isSelected = ref(false)

  const input = computed({
    get() {
      if(props.modelValue) {
        getFile(props.modelValue)
      }
      return props.modelValue;
    },
    set(value: string) {
      getFile(value)
      emit('update:modelValue', value);
    },
  });

  const uploadFile = () => {}

  const clearFile = () => input.value = ''

  const chooseFile = () => {
    isSelected.value = true
    getFiles()
  }
</script>

<template>
  <div class="media-field">
    <div
      v-if="!input"
      class="media-field__upload"
    >
      <UploadControl
        @upload="uploadFile"
        @choose="chooseFile"
      />
    </div>

    <div
      v-else
      class="media-field__control"
    >
      <DashboardFileCard
        v-if="Object.keys(file).length"
        mode="static"
        :item="file"
      />
      <ButtonControl
        variant="secondary"
        size="small"
        @click="chooseFile"
      >
        Choose
      </ButtonControl>
      <ButtonControl
        size="small"
        variant="secondary"
        @click="clearFile"
      >
        Remove
      </ButtonControl>
    </div>

    <DashboardUploadFiles
      v-model="isSelected"
      @select="selectFile"
    />

    <!-- <ModalWindow
      v-model="isSelected"
      title="Choose file"
      direction="sidebar"
      size="large"
    >
      <div
        class="media-field__files"
      >
        <PreviewFileControl
          v-for="{_id, originName, type, size} in files"
          :key="_id"
          class="media-field__files-item"
          :name="originName"
          :type="type"
          :size="size"
          mode="static"
          :path="previewUrl(_id)"
          @click="selectFile(_id)"
        />
      </div>
    </ModalWindow> -->
  </div>
</template>

<style scoped>
  .media-field {
    display: flex;
    width: 100%;
  }

  .media-field__upload {
    width: 100%;
  }

  .media-field__control {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  .media-field__files {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
    gap: 24px;
  }

  .media-field__files-item {
    cursor: pointer;
  }
</style>
