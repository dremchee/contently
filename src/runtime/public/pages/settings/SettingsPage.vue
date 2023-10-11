<script lang="ts" setup>
  import { computed, useContently } from '#imports'
  import DashboardPageLayout from '#runtime/public/dashboard/components/DashboardPageLayout.vue'
  import DashboardSidebar from '#runtime/public/dashboard/components/DashboardSidebar.vue';
  import { RouterName } from '#runtime/public/core/const';

  const { t } = useContently()

  const items = computed(() => [{
    name: String(t('collections')),
    route: {
      name: RouterName.COLLECTIONS
    }
  }, {
    name: String(t('project')),
    route: {
      name: RouterName.PROJECT
    }
  }])
</script>

<template>
  <DashboardPageLayout>
    <template #sidebar>
      <DashboardSidebar :items="items" />
    </template>
    <NuxtPage />
  </DashboardPageLayout>
</template>
