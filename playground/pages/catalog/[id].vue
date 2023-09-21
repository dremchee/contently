<script lang="ts" setup>
  import { useRoute } from '#app';
  import { useContently } from '#imports';

  const route = useRoute();
  const { api } = useContently();

  const response = await api.getCollectionByKeyResource('catalog', String(route.params.id));
  console.log(response);

</script>

<template>
  <div>
    <h1>{{ response.data?.name }}</h1>

    <pre>{{ response.data }}</pre>
  </div>
</template>
