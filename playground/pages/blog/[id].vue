<script lang="ts" setup>
  import { useRoute } from '#app';
  import { useContently } from '#imports';

  const route = useRoute();
  const { api } = useContently();

  const response = await api.getCollectionByKeyResource('blog', String(route.params.id));
</script>

<template>
  <div>
    <h1>{{ response.data?.name }}</h1>

    <pre>{{ response.data?.content?.title }}</pre>
  </div>
</template>
