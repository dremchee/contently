<script lang="ts" setup>
  import DashboardPageLayout from '#runtime/public/dashboard/components/DashboardPageLayout.vue'
  // import DashboardSidebar from '#runtime/public/dashboard/components/DashboardSidebar.vue';
  import DashboardFiles from '#runtime/public/dashboard/entities/files/DashboardFiles.vue';
</script>

<template>
  <DashboardPageLayout>
    <DashboardFiles />
  </DashboardPageLayout>
</template>
