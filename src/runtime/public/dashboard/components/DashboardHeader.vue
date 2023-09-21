<script lang="ts" setup>

</script>

<template>
  <div :class="$style['header']">
    <div :class="$style['container']">
      <div :class="$style['title']">
        <slot name="title" />
      </div>
      <div :class="$style['action']">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<style module>
  .header {
    padding: 16px;
    min-height: 60px;
    gap: 16px;
    flex-direction: column;
    display: flex;
    background-color: var(--color-background);
  }

  .container {
    display: flex;
    gap: 6px;
  }

  .title {
    font-size: 24px;
    display: flex;
    align-items: center;
    flex-grow: 1;
  }

  .action {
    display: flex;
    gap: 8px;
    align-items: center;
  }
</style>
