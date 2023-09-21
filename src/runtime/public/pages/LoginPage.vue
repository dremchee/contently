<script lang="ts" setup>
  import { definePageMeta } from '#imports';
  import DashboardLogin from '../dashboard/DashboardLogin.vue';

  definePageMeta({
    layout: 'dashboard',
  });
</script>

<template>
  <div class="dashboard-login-page">
    <DashboardLogin />
  </div>
</template>

<style scoped>
  .dashboard-login-page {
    display: flex;
    height: 100vh;
  }
</style>
