<script lang="ts" setup>
  import PreloaderControl from '#runtime/public/ui/PreloaderControl.vue';
</script>

<template>
  <div :class="$style['container']">
    <PreloaderControl />
  </div>
</template>

<style module>
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 200px;
  }
</style>
