<script lang="ts" setup>
  import { useContently } from '#imports';

  const { api } = useContently();

  const response = await api.getCollectionByKey('blog');
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
            :to="`/blog/${item.key}`"
            append
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
      <pre>{{ response.data }}</pre>
    </div>
  </div>
</template>
