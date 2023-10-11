<script lang="ts" setup>
  import { computed, ref, useContently, watch } from '#imports';
  import ButtonControl from '#runtime/public/ui/ButtonControl.vue';
  import InputField from '#runtime/public/ui/InputField.vue';
  import TextareaField from '#runtime/public/ui/TextareaField.vue';
  import ControlsGroup from '#runtime/public/ui/ControlsGroup.vue';
  import { DocumentType, File } from '#runtime/api/types';
  import DashboardFileCard from './DashboardFileCard.vue';
  import { useDateFormat } from '@vueuse/core';
  const formatDate = (value: number) => useDateFormat(value, 'DD MMMM YYYY HH:mm:ss').value;

  const props = defineProps<{
    item: DocumentType<File>
  }>()

  const emit = defineEmits<{
    remove: [value: void],
    update: [value: void],
  }>()

  const { api, t } = useContently()

  const form = ref({ ...props.item })

  const updateFile = () => {

  }

  const removeFile = async (id: string) => {
    await api.removeFile(id)
    emit('remove')
  }
</script>

<template>
  <div class="dashboard-files-item">
    <ControlsGroup label="Preview">
      <DashboardFileCard
        :item="item"
        mode="static"
      />
    </ControlsGroup>
    <ControlsGroup label="Name">
      <InputField v-model="form.originName" />
    </ControlsGroup>
    <ControlsGroup label="Filename">
      <InputField
        v-model="form.name"
        disabled
      />
    </ControlsGroup>
    <ControlsGroup label="Format">
      <pre>{{ form.type }}</pre>
    </ControlsGroup>
    <ControlsGroup label="Size">
      <pre>{{ form.size }}</pre>
    </ControlsGroup>
    <ControlsGroup label="Hash">
      <pre>{{ form.hash }}</pre>
    </ControlsGroup>
    <ControlsGroup label="Created">
      {{ formatDate(form.createdAt) }}
    </ControlsGroup>
    <ControlsGroup label="Updated">
      {{ formatDate(form.updatedAt) }}
    </ControlsGroup>
    <ControlsGroup direction="row">
      <ButtonControl
        block
        size="small"
        variant="secondary"
        @click="removeFile(item._id)"
      >
        {{ t('remove') }}
      </ButtonControl>
      <ButtonControl
        block
        size="small"
      >
        {{ t('save') }}
      </ButtonControl>
    </ControlsGroup>
  </div>
</template>

<style scoped>
  .dashboard-files-item {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
