<script lang="ts" setup>
  import { computed, useNuxtApp } from '#imports';

  const { $contently } = useNuxtApp()
  const { data: blog } = await $contently.readCollection('blog')
</script>

<template>
  <div>
    <h1>{{ blog?.name }}</h1>

    <div>
      <ul>
        <li
          v-for="item in blog?.items"
          :key="item._id"
        >
          <NuxtLink
            :to="`/blog/${item.key}`"
            append
          >
            {{ item.content.title }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
