<script lang="ts" setup>
  import { useContently } from '#imports';

  const { api } = useContently();

  const response = await api.getCollectionByKey('catalog');
</script>

<template>
  <div>
    <h1>{{ response.data?.name }}</h1>

    <div>
      <ul>
        <li
          v-for="item in response.data?.items"
          :key="item._id"
        >
          <NuxtLink
            :to="`/catalog/${item.key}`"
            append
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
    <pre>{{ response.data }}</pre>
  </div>
</template>
