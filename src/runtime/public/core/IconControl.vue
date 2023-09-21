<script lang="ts" setup>
  import { computed } from '#imports';

  const props = withDefaults(defineProps<{
    name: string;
    size?: number;
  }>(), {
    size: 24
  });

  const icons = import.meta.glob(`../assets/icons/**/*.svg`, {
    as: 'raw',
    eager: true,
    import: 'default'
  })

  const source = computed(() => Object.entries(icons).find(([path]) => path.replace('../assets/icons/', '') === `${props.name}.svg`))
  const icon = computed(() => source.value && source.value[1])
  const size = computed(() => `${props.size}px`);
</script>

<template>
  <div
    v-if="icon"
    class="icon-control"
    v-html="icon"
  />
</template>

<style scoped>
  .icon-control {
    display: flex;
    width: v-bind(size);
    height: v-bind(size);
    align-items: center;
    justify-content: center;
    color: currentColor;

    &:deep(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
