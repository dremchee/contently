<script lang="ts" setup>
  import { useRoute } from '#app';
  import { useNuxtApp } from '#imports';

  const { $contently } = useNuxtApp()
  const route = useRoute();
  const { data: post } = await $contently.readCollectionItem('blog', String(route.params.id))
</script>

<template>
  <div v-if="post">
    <h1>{{ post?.content?.title }}</h1>

    <div v-html="post?.content?.content.html" />
  </div>
</template>
