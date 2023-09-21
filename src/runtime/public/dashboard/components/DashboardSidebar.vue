<script lang="ts" setup>
  import { ref, computed, useContently } from '#imports';
  import { useDraggable } from '@vueuse/core';
  import { RouterName } from '#contently/plugins/const';

  defineProps<{
    items?: {
      name: string
      route: {
        name: RouterName,
        params?: Record<string, unknown>
      }
    }[]
  }>()

  const { settings, storage } = useContently()

  const handler = ref<HTMLDivElement | null>(null);
  const isDragging = ref(false);

  const { x } = useDraggable(handler, {
    initialValue: { x: storage.value.sidebar.width ?? 360, y: 0 },
    onStart() {
      isDragging.value = true;
    },
    onEnd() {
      storage.value.sidebar = { width: x.value }
      isDragging.value = false;
    },
  });

  const styleMenu = computed(() => ({
    width: `${x.value - 60}px`,
  }));
</script>

<template>
  <div
    :class="$style['sidebar']"
    :style="styleMenu"
  >
    <div
      ref="handler"
      :class="[$style['handler'], isDragging && $style['is-dragging']]"
    />

    <div :class="$style['title']">
      {{ settings.meta.title }}
    </div>

    <div :class="$style['links']">
      <NuxtLink
        v-for="item in items"
        :key="item.name"
        v-slot="{ isActive, navigate, href }"
        :to="(item.route as any)"
        custom
      >
        <a
          :href="href"
          :class="[$style['link'], isActive && $style['is-active']]"
          @click="navigate"
        >
          {{ item.name }}
        </a>
      </NuxtLink>
    </div>
  </div>
</template>

<style module>
  .sidebar {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 200px;
    max-width: 50vw;
    border-right: 1px solid var(--color-border-light);
  }

  .handler {
    width: 4px;
    height: 100%;
    position: absolute;
    right: 0;
    cursor: ew-resize;
    transition: .1s;

    &:hover {
      background-color: var(--color-brand);
    }

    &.is-dragging {
      background-color: var(--color-brand);
    }
  }

  .title {
    width: 100%;
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 16px;
  }

  .links {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  .link {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    color: var(--color-default);
    text-decoration: none;
    border-radius: 4px;
    width: 100%;
    transition: .2s;

    &:hover {
      background-color: var(--color-background-dark);
    }

    &.is-active {
      background-color: var(--color-brand);
      color: var(--color-white);
    }
  }
</style>
