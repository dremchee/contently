<script lang="ts" setup>
  import { definePageMeta, useContently } from '#imports';
  import DashboardNavigation from '../dashboard/components/DashboardNavigation.vue';
  import ModalOverlay from '../ui/modal/ModalOverlay.vue';
  import ToastOverlay from '../ui/toast/ToastOverlay.vue';

  const { breakpoint } = useContently()

  definePageMeta({
    layout: 'dashboard'
  });
</script>

<template>
  <div
    :class="[$style['page'], !breakpoint.phablet.value && $style['is-compact']]"
  >
    <div :class="$style['navigation']">
      <DashboardNavigation />
    </div>
    <div :class="$style['content']">
      <NuxtPage />
    </div>
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

    &.is-compact {
      flex-direction: column-reverse;
    }
  }

  .navigation {
    width: 60px;
    .is-compact & {
      width: 100%;
      position: sticky;
      bottom: 0;
      z-index: 10;
    }
  }

  .content {
    width: calc(100% - 60px);
    height: 100%;
    flex-grow: 1;
    .is-compact & {
      width: 100%;
    }
  }
</style>
