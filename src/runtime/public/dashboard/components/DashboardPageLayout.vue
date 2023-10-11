<script lang="ts" setup>
  import { useContently } from '#imports';
  import ModalWindow from '#runtime/public/ui/modal/ModalWindow.vue';

  const { breakpoint, isShowSidebar, settings } = useContently()
</script>

<template>
  <div
    :class="[
      $style['layout'],
      !breakpoint.phablet.value && $style['is-compact']
    ]"
  >
    <div
      v-if="breakpoint.laptop.value"
      :class="$style['sidebar']"
    >
      <slot name="sidebar" />
    </div>

    <ModalWindow
      v-model="isShowSidebar"
      :title="settings.meta.title"
      direction="menu"
    >
      <slot
        name="sidebar"
      />
    </ModalWindow>
    <div :class="$style['main']">
      <slot />
    </div>
  </div>
</template>

<style module>
  .layout {
    display: flex;
    width: 100%;
    height: 100vh;

    &.is-compact {
      height: 100%;
    }
  }

  .main {
    width: 100%;
    overflow: auto;
    min-height: 100vh;

    .is-compact & {
      /* flex-shrink: 0; */
      overflow: initial;
      height: 100%;
    }
  }
</style>
