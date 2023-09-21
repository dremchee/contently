<script lang="ts" setup>
  import { useContently, ref, computed, watch, onMounted } from '#imports';
  import { useToast } from '#contently/public/core/toast'
  import { DocumentType, Files, File } from '#contently/api/types'
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ButtonControl from '#contently/public/core/ButtonControl.vue'

  import DashboardFileCard from './DashboardFileCard.vue';
  import ModalWindow from '#contently/public/core/modal/ModalWindow.vue';
  import DashboardFilesItem from './DashboardFilesItem.vue';
  import PaginationControl from '#contently/public/core/PaginationControl.vue';
  import SkeletonFiles from '#contently/public/core/skeleton/SkeletonFiles.vue'

  const { api, t } = useContently()
  const { toastShow } = useToast()

  const files = ref({} as Files)
  const isPending = ref(false)
  const isLoading = ref(false)
  const currentPage = ref(1)

  const paginate = ref({
    limit: 20,
    skip: 0
  })

  const fetchFiles = async () => {
    const { data } = await api.getFiles(paginate.value)

    if(data.value?.data) {
      files.value = data.value?.data
    }

  }

  const inputFile = ref<HTMLInputElement | null>(null)

  const uploadFile = async () => {
    inputFile.value?.click()
  }

  const isSelectedFile = ref(false)
  const checkedFiles = ref({} as Record<string, boolean>)
  const selectedFile = ref({} as DocumentType<File>)

  const checkedFileList = computed(() => Object.keys(checkedFiles.value).filter(e => checkedFiles.value[e]).length)

  const selectFile = (file: DocumentType<File>) => {
    if(file) {
      isSelectedFile.value = true
      selectedFile.value = file
    }
  }

  const changeInputFile = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const formData = new FormData()

    if(target.files) {
      isPending.value = true
      const file = target.files[0]
      formData.append('file', file)
      const response = await api.uploadFile(formData)

      if(response?.data) {
        await fetchFiles()

        toastShow({
          text: 'Success upload file',
          type: 'success'
        })
      } else {
        toastShow({
          text: 'This file exist',
          type: 'error'
        })
      }

      isPending.value = false
      target.value = ''
    }
  }

  const removedFile = async () => {
    isPending.value = true
    await fetchFiles()
    delete checkedFiles.value[selectedFile.value._id]
    isPending.value = false
    isSelectedFile.value = false

    toastShow({
      text: `This file ${selectedFile.value.originName} removed`,
      type: 'warning'
    })
    selectedFile.value = {} as DocumentType<File>
  }

  const removeFiles = async () => {
    isPending.value = true
    const promises = Object.keys(checkedFiles.value).map((id) => {
      delete checkedFiles.value[id]
      return api.removeFile(id)
    })

    const removed = await Promise.all(promises)

    await fetchFiles()

    isPending.value = false

    removed.forEach((e) => {
      toastShow({
        text: `Removed file: ${e.data.originName}`,
        type: 'warning'
      })
    })

  }

  const cancelCheckedFiles = () => {
    checkedFiles.value = {}
  }

  const toPaginate = (num: number) => {
    paginate.value.skip = num * paginate.value.limit

    fetchFiles()
  }

  watch(currentPage, (value) => {
    toPaginate(value - 1)
  })

  onMounted(async () => {
    isLoading.value = true

    await fetchFiles()
    isLoading.value = false
  })
</script>

<template>
  <DashboardMainWrapper fluid>
    <template #header>
      <DashboardHeader>
        <template #title>
          {{ t('files') }}
        </template>
        <template #action>
          <template v-if="checkedFileList">
            <ButtonControl
              size="small"
              icon="close"
              variant="link"
              @click="cancelCheckedFiles"
            >
              {{ t('cancel') }}
            </ButtonControl>
            <ButtonControl
              size="small"
              icon="trash"
              variant="link-error"
              @click="removeFiles"
            >
              {{ t('remove') }} {{ checkedFileList }}
            </ButtonControl>
          </template>
          <ButtonControl
            size="small"
            icon="upload"
            variant="secondary"
            :loading="isPending"
            @click="uploadFile"
          >
            Upload file
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>
    <input
      ref="inputFile"
      type="file"
      hidden
      @change="changeInputFile"
    >
    <SkeletonFiles v-if="isLoading" />
    <template v-else>
      <div
        :class="$style['files']"
      >
        <div
          v-if="files"
          :class="[$style['list'], isPending && $style['is-uploading']]"
        >
          <DashboardFileCard
            v-for="item in files.items"
            :key="item._id"
            v-model:checked="checkedFiles[item._id]"
            :item="item"
            @click="selectFile(item)"
          />
        </div>
        <PaginationControl
          v-if="files"
          v-model:page="currentPage"
          :total="files.total"
          :limit="files.limit"
        />
      </div>
    </template>
    <ModalWindow
      v-if="selectedFile"
      v-model="isSelectedFile"
      :title="selectedFile?.originName"
      direction="sidebar"
    >
      <DashboardFilesItem
        v-if="selectedFile"
        :item="selectedFile"
        @remove="removedFile"
      />
    </ModalWindow>
  </DashboardMainWrapper>
</template>

<style module>
  .files {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  .list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 32px;
    transition: .2s;

    &.is-uploading {
      opacity: .2;
    }
  }
</style>
