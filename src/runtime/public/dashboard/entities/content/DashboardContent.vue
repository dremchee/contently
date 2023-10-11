<script lang="ts" setup>
  import { useRouter, useRoute, watch, useContently } from '#imports';
  import { RouterName } from './../../../../plugins/const';
  import DashboardContentItem from './components/DashboardContentItem.vue';

  const { api } = useContently();

  const pages = await api.getCollections();

  const router = useRouter();

  const routeToPage = (id: string) => {
    router.push({
      name: RouterName.CONTENT_ID,
      params: {
        id,
      },
    });
  };
</script>

<template>
  <div class="dashboard-content">
    <div class="dashboard-content__list">
      <DashboardContentItem
        v-for="page in pages.data"
        :key="page._id"
        :label="page.name"
        :alias="page.key"
        :date="page.updatedAt"
        class="dashboard-content__list-item"
        @click="routeToPage(page._id)"
      >
        {{ page.name }}
      </DashboardContentItem>
    </div>
  </div>
</template>

<style scoped>
  .dashboard-content {
    display: flex;
    flex-direction: column;
  }

  .dashboard-content__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
../../../core/const
