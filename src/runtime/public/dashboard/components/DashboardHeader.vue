<script lang="ts" setup>
  import { useContently } from '#imports'
  import IconControl from '#runtime/public/ui/IconControl.vue';


  const { breakpoint, isShowSidebar } = useContently()
</script>

<template>
  <div
    :class="$style['header']"
  >
    <div :class="$style['container']">
      <div
        v-if="!breakpoint.laptop.value"
        :class="$style['bar']"
        @click="isShowSidebar = true"
      >
        <IconControl name="bar" />
      </div>
      <div :class="$style['title']">
        <div :class="$style['title-text']">
          <slot name="title" />
        </div>
      </div>
      <div :class="$style['actions']">
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
    /* flex-wrap: wrap; */
  }

  .bar {
    display: flex;
    align-items: center;
    margin-right: 16px;
  }

  .title {
    font-size: 24px;
    display: flex;
    align-items: center;
    flex-grow: 1;
    overflow: hidden;
  }

  .title-text {
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .actions {
    display: flex;
    /* flex-wrap: wrap; */
    gap: 8px;
    align-items: center;
  }
</style>
