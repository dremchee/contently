<script lang="ts" setup>
  defineProps<{
    fluid?: boolean;
  }>();
</script>

<template>
  <div :class="$style['wrapper']">
    <div :class="$style['header']">
      <slot name="header" />
    </div>
    <div :class="$style['inner']">
      <div
        :class="[$style['container'], { [$style['is-fluid']]: fluid }]"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style module>
  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }

  .header {
    border-bottom: 1px solid var(--color-border-light);
    position: sticky;
    z-index: 10;
    top: 0;
  }

  .inner {
    height: 100%;
    flex-grow: 1;
  }

  .container {
    margin: 0 auto;
    padding: 16px;
    max-width: 800px;

    &.is-fluid {
      max-width: 100%;
    }
  }
</style>
