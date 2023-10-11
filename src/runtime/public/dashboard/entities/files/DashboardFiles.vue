<script lang="ts" setup>
  import { useContently, ref, computed, watch, onMounted } from '#imports';
  import { useToast } from '#runtime/public/ui/toast'
  import { DocumentType, Files, File } from '#runtime/api/types'
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ButtonControl from '#runtime/public/ui/ButtonControl.vue'

  import DashboardFileCard from './DashboardFileCard.vue';
  import ModalWindow from '#runtime/public/ui/modal/ModalWindow.vue';
  import DashboardFilesItem from './DashboardFilesItem.vue';
  import PaginationControl from '#runtime/public/ui/PaginationControl.vue';
  import SkeletonFiles from '#runtime/public/ui/skeleton/SkeletonFiles.vue'

  const { api, t } = useContently()
  const { toastShow } = useToast()

  const files = ref({} as Files)
  const isPending = ref(false)
  const isLoading = ref(false)
  const currentPage = ref(1)
  const isRemoved = ref(false)

  const paginate = ref({
    limit: 50,
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

    if(target.files) {
      isPending.value = true

      const promises: FormData[] = []

      Array.from(target.files).map(file => {
        const formData = new FormData()
        formData.append('file', file)

        if(file) {
          promises.push(formData)
        }
      })

      const files = await Promise.all(promises.map(data => api.uploadFile(data)))
      await fetchFiles()

      ;(await files).forEach(file => {
        if(file) {
          toastShow({
            message: `Success upload file: ${file.data.originName}`,
            type: 'success'
          })
        } else {
          toastShow({
            message: 'This file exist',
            type: 'error'
          })
        }

      })

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
      message: `This file ${selectedFile.value.originName} removed`,
      type: 'warning'
    })
    selectedFile.value = {} as DocumentType<File>
  }

  const removeFiles = async () => {
    isPending.value = true
    const promises = Object.keys(checkedFiles.value).filter(key => checkedFiles.value[key]).map((id) => {
      delete checkedFiles.value[id]
      return api.removeFile(id)
    })

    const removed = await Promise.all(promises)

    await fetchFiles()

    isPending.value = false
    isRemoved.value = false

    removed.forEach((e) => {
      toastShow({
        message: `Removed file: ${e.data.originName}`,
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
              @click="isRemoved = true"
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
            {{ t('uploadFile') }}
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>
    <input
      ref="inputFile"
      type="file"
      multiple
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

    <ModalWindow
      v-model="isRemoved"
      size="small"
      title="Remove files?"
    >
      <div :class="$style['actions']">
        <ButtonControl
          icon="close"
          variant="secondary"
          block
          @click="isRemoved = false"
        >
          {{ t('cancel') }}
        </ButtonControl>
        <ButtonControl
          icon="check"
          variant="error"
          block
          @click="removeFiles"
        >
          {{ t('remove') }}
        </ButtonControl>
      </div>
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
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 32px;
    transition: .2s;

    &.is-uploading {
      opacity: .2;
    }
  }

  .actions {
    display: flex;
    gap: 16px;
    width: 100%;
  }
</style>
