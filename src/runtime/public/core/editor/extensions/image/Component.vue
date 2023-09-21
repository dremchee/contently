<template>
  <NodeViewWrapper
    class="image-advanced-item"
    xdata-drag-handle
  >
    <div class="image-advanced-item__container">
      <div class="image-advanced-item__resize">
        <span
          ref="resizeElementTop"
          class="image-advanced-item__resize-item is-top"
        />
        <span
          ref="resizeElementRight"
          class="image-advanced-item__resize-item is-right"
        />
        <span
          ref="resizeElementBottom"
          class="image-advanced-item__resize-item is-bottom"
        />
        <span
          ref="resizeElementLeft"
          class="image-advanced-item__resize-item is-left"
        />
      </div>
      <div class="image-advanced-item__content">
        <img
          ref="image"
          :src="node.attrs.src"
          alt=""
        >
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script lang="ts" setup>
import { ref, computed } from '#imports'
import { useMousePressed, useMouse, useElementBounding } from '@vueuse/core'
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'

const image = ref<HTMLDivElement>()
const resizeElementTop = ref<HTMLDivElement>()
const resizeElementRight = ref<HTMLDivElement>()
const resizeElementBottom = ref<HTMLDivElement>()
const resizeElementLeft = ref<HTMLDivElement>()

const { x, y } = useMouse()

const pressedElement = computed(() => {
  return {
    top: useMousePressed({ target: resizeElementTop}).pressed,
    right: useMousePressed({ target: resizeElementRight}).pressed,
    bottom: useMousePressed({ target: resizeElementBottom}).pressed,
    left: useMousePressed({ target: resizeElementLeft}).pressed
  }
})

const { width, height } = useElementBounding(image)

const props = defineProps(nodeViewProps)
</script>

<style scoped>
  .image-advanced-item__container {
    position: relative;
  }

  .image-advanced-item__resize {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 2px solid var(--color-primary);
  }

  .image-advanced-item__resize-item {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: var(--color-white);
    border: 2px solid var(--color-primary);
    border-radius: 50%;

    &.is-top {
      left: 0;
      right: 0;
      top: -5px;
      margin: auto;
    }

    &.is-right {
      right: -5px;
      top: 50%;
    }

    &.is-bottom {
      left: 0;
      right: 0;
      bottom: -5px;
      margin: auto;
    }

    &.is-left {
      left: -5px;
      top: 50%;
    }
  }
</style>
