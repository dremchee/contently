<script lang="ts" setup>
  import IconControl from './IconControl.vue';
</script>

<template>
  <div class="preloader-control">
    <IconControl
      name="spin"
      class="preloader-control__spin"
    />
  </div>
</template>

<style scoped>
  .preloader-control {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-default);
    width: 100%;
  }

  .preloader-control__spin {
    animation: preloader 2s linear infinite;
  }

  @keyframes preloader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
