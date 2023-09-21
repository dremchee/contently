<script lang="ts" setup>
  import { onMounted, ref, nextTick } from '#imports';
  import { computePosition, shift, offset as floatingOffset, autoUpdate, Placement } from '@floating-ui/dom';
  import { CSSProperties } from 'nuxt/dist/app/compat/capi';

  const props = withDefaults(defineProps<{
    text: string;
    placement?: Placement,
    offset: number
    width: 'reference' | 'floating' | number
  }>(), {
    placement: 'top',
    offset: 8,
    width: 'reference'
  })

  const isShow = ref(false);

  const trigger = ref<HTMLDivElement | null>(null);
  const tooltip = ref<HTMLDivElement | null>(null);

  const styleDropdown = ref<CSSProperties>({
    position: 'relative',
    left: '',
    top: '',
  });

  const middleware = [
    shift({ padding: 5 }),
    floatingOffset(props.offset),
  ];

  const updatePosition = async () => {
    if (trigger.value && tooltip.value) {
      const position = await computePosition(trigger.value, tooltip.value, {
        strategy: 'fixed',
        placement: props.placement,
        middleware,
      });

      styleDropdown.value = {
        position: position.strategy,
        top: `${position.y ?? 0}px`,
        left: `${position.x ?? 0}px`,
      };
    }
  };

  const showTooltip = () => {
    updatePosition()
    isShow.value = true
  }

  const hideTooltip = () => {
    isShow.value = false
  }

  onMounted(async () => {
    await nextTick();
    if (trigger.value && tooltip.value) {
      autoUpdate(trigger.value, tooltip.value, updatePosition);
    }
  });
</script>

<template>
  <div
    ref="trigger"
    class="tooltip-control"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot />
    <Transition
      name="tooltip"
    >
      <div
        v-show="isShow"
        ref="tooltip"
        class="tooltip-control__tooltip"
        :style="styleDropdown"
      >
        <!-- <slot name="tooltip" /> -->
        {{ text }}
      </div>
    </Transition>
  </div>
</template>

<style>
  .tooltip-move,
  .tooltip-enter-active,
  .tooltip-leave-active {
    transition: transform 0.2s, opacity 0.2s;
  }

  .tooltip-enter-from,
  .tooltip-leave-to {
    opacity: 0;
    transform: translateY(4px);
  }
</style>

<style scoped>
  .tooltip-control {
    position: relative;
  }

  .tooltip-control__tooltip {
    background-color: var(--color-default);
    color: var(--color-white);
    border-radius: var(--border-radius);
    font-size: 12px;
    line-height: 1.2;
    padding: 4px 8px;
    z-index: 10;
  }
</style>
