<script lang="ts" setup>
  import { definePageMeta } from '#imports';
  import DashboardNavigation from '../dashboard/components/DashboardNavigation.vue';
  import ModalOverlay from '../core/modal/ModalOverlay.vue';
  import ToastOverlay from '../core/toast/ToastOverlay.vue';

  definePageMeta({
    layout: 'dashboard'
  });
</script>

<template>
  <div :class="$style['page']">
    <div :class="$style['navigation']">
      <DashboardNavigation />
    </div>
    <NuxtPage />
    <ModalOverlay />
    <ToastOverlay />
  </div>
</template>

<style module>
  .page {
    display: flex;
    min-height: 100vh;
    height: 100%;
    user-select: none;
  }
</style>
