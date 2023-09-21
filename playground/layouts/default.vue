<script lang="ts" setup>
  import AppHeader from '../components/AppHeader.vue';
  import AppFooter from '../components/AppFooter.vue';
</script>

<template>
  <div class="layout">
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>
