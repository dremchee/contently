<script lang="ts" setup>
  import ButtonControl from './ButtonControl.vue';

  const emit = defineEmits(['upload', 'choose'])
</script>

<template>
  <div class="upload-control">
    <div class="upload-control__text">
      <span>Drag n drop to upload or</span>
      <ButtonControl
        variant="secondary"
        size="small"
        icon="folder-upload"
        @click="emit('choose')"
      >
        Select files
      </ButtonControl>
    </div>
  </div>
</template>

<style scoped>
  .upload-control {
    width: 100%;
    height: 120px;
    border: 2px dashed var(--color-border-light);
    border-radius: var(--border-radius-large);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
  }

  .upload-control__icons {
    display: flex;
    gap: 16px;
  }

  .upload-control__text {
    /* color: var(--color-secondary);
    font-size: 14px; */
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
