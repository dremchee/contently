<script lang="ts" setup>
  withDefaults(defineProps<{
    items?: number
  }>(), {
    items: 10
  })
</script>

<template>
  <div :class="$style['files']">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="$style['item']"
    >
      <div :class="$style['image']" />
      <div :class="$style['info']">
        <div :class="$style['title']" />
        <div :class="$style['note']" />
      </div>
    </div>
  </div>
</template>

<style module>
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  .files {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 32px;
  }

  .item {
    aspect-ratio: 4/3;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .image {
    aspect-ratio: 1/1;
    background-color: var(--color-background-dark);
    border-radius: var(--border-radius);
    animation: blink 2s infinite;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .title {
    height: 24px;
    background-color: var(--color-background-dark);
    border-radius: var(--border-radius);
    animation: blink 2s infinite;
  }

  .note {
    height: 18px;
    background-color: var(--color-background-dark);
    border-radius: var(--border-radius);
    animation: blink 2s infinite;
  }
</style>
