<script lang="ts" setup>
  import UploadControl from '#runtime/public/ui/UploadControl.vue';

  const emit = defineEmits(['upload', 'choose'])

  const uploadFiles = () => {

  }
</script>

<template>
  <UploadControl
    @choose="emit('choose')"
    @upload="uploadFiles"
  />
</template>
