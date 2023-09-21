<script lang="ts" setup>
  import DashboardPageLayout from '#contently/public/dashboard/components/DashboardPageLayout.vue'
  import DashboardSidebar from '#contently/public/dashboard/components/DashboardSidebar.vue';
  import DashboardFiles from '#contently/public/dashboard/entities/files/DashboardFiles.vue';
</script>

<template>
  <DashboardPageLayout>
    <template #sidebar>
      <DashboardSidebar />
    </template>
    <DashboardFiles />
  </DashboardPageLayout>
</template>
