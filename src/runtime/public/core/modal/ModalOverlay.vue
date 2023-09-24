<script lang="ts" setup>
  import { ref, onMounted } from '#imports';
  import { useMutationObserver, useScrollLock } from '@vueuse/core';

  const modal = ref<HTMLDivElement | null>(null);
  const isOpen = ref(false);
  const scrollLock = useScrollLock(document.body);

  onMounted(() => {
    useMutationObserver(
      modal.value,
      ([mutation]) => {
        const childCount = mutation.target.childNodes.length;
        isOpen.value = Boolean(childCount);
        scrollLock.value = Boolean(childCount);
      },
      { childList: true }
    );
  });
</script>

<template>
  <div
    id="modal"
    ref="modal"
    class="modal-overlay"
    :class="[isOpen && 'is-open']"
  />
</template>

<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-width: 100%;
    background-color: transparent;
    pointer-events: none;
    z-index: 1000;
    overflow: auto;
    display: flex;
    align-items: center;
    transition: background-color .2s;

    & > * {
      pointer-events: all;
      z-index: 1000;
    }

    &:deep(dialog):not(:last-child) {
      display: none;
    }

    &.is-open {
      background-color: rgba(0, 0, 0, 0.2);
      pointer-events: all;
    }
  }
</style>
