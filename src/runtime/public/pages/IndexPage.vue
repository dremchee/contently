<script lang="ts" setup>
  import { definePageMeta, useContently } from '#imports';
  import DashboardNavigation from '../dashboard/components/DashboardNavigation.vue';
  import ModalOverlay from '../core/modal/ModalOverlay.vue';
  import ToastOverlay from '../core/toast/ToastOverlay.vue';

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
    .is-compact & {
      position: sticky;
      bottom: 0;
      z-index: 10;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    flex-grow: 1;
  }
</style>
