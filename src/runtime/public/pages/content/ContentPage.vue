<script lang="ts" setup>
  import { computed, onMounted, useContently, navigateTo, useRouter, watch, definePageMeta } from '#imports'
  import DashboardPageLayout from '#contently/public/dashboard/components/DashboardPageLayout.vue'
  import DashboardSidebar from '#contently/public/dashboard/components/DashboardSidebar.vue';
  import { RouterName } from '#contently/plugins/const';

  const { collections } = useContently()
  const router = useRouter()

  const items = computed(() => collections.value.map(e => ({
    name: e.name,
    route: {
      name: RouterName.CONTENT_ITEMS,
      params: {
        id: e._id
      }
    }
  })))

  watch(router.currentRoute, (page) => {
    if(page.name === RouterName.CONTENT_ID) {
      redirectTo()
    }
  })

  const redirectTo = () => {
    const [first] = items.value

    if(first && !router.currentRoute.value.params?.id) {
      navigateTo(first.route)
    }
  }

  onMounted(() => {
    redirectTo()
  })

  definePageMeta({
    layout: 'dashboard'
  });
</script>

<template>
  <DashboardPageLayout>
    <template #sidebar>
      <DashboardSidebar :items="items" />
    </template>
    <NuxtPage />
  </DashboardPageLayout>
</template>
