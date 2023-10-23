<script lang="ts" setup>
  import { ref } from '#imports';
  import ButtonControl from './ButtonControl.vue';

  const emit = defineEmits(['upload', 'choose'])

  const isDragEvent = ref(false)
  const input = ref<HTMLInputElement>()
  const files = ref([])

  const dragHandler = (e: DragEvent) => {
    e.preventDefault();
    if (e.type === 'dragenter') {
      isDragEvent.value = true;
    }

    if (e.type === 'dragleave') {
      isDragEvent.value = false;
    }

    if (e.type === 'drop') {
      isDragEvent.value = false;
      console.log(e.dataTransfer?.files);

      emit('upload', e.dataTransfer?.files)
    }
  }

  const uploadFiles = () => {
    input.value?.click()
  }
</script>

<template>
  <div
    :class="[$style['upload'], isDragEvent && $style['is-drag']]"
    @drop.stop="dragHandler"
    @dragover.stop="dragHandler"
    @dragenter.stop="dragHandler"
    @dragleave.stop="dragHandler"
  >
    <div :class="$style['content']">
      <input
        ref="input"
        type="file"
        hidden
      >

      <div :class="$style['text']">
        Drag and drop to upload
      </div>
      <div :class="$style['action']">
        <ButtonControl
          variant="secondary"
          size="small"
          icon="folder-upload"
          @click="emit('choose')"
        >
          Choose files
        </ButtonControl>
        <ButtonControl
          variant="secondary"
          size="small"
          icon="upload"
          @click="uploadFiles"
        >
          Upload
        </ButtonControl>
      </div>
    </div>
  </div>
</template>

<style module>
  .upload {
    width: 100%;
    height: 120px;
    border: 2px dashed var(--color-border-light);
    border-radius: var(--border-radius-large);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;

    &.is-drag {
      border: 2px dashed var(--color-brand);

      * > {
        pointer-events: none;
      }
    }
  }

  .text {
    color: var(--color-secondary-dark);
    font-size: 18px;
    font-weight: 600;
  }

  .content {
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 12px;
  }

  .action {
    display: flex;
    gap: 8px;
  }
</style>
