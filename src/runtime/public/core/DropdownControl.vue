<script lang="ts" setup>
  import { onMounted, ref, nextTick } from '#imports';
  import { clamp, onClickOutside } from '@vueuse/core';
  import { computePosition, flip, offset as floatingOffset, size, autoUpdate, Placement } from '@floating-ui/dom';
  import { CSSProperties } from 'nuxt/dist/app/compat/capi';

  const props = withDefaults(defineProps<{
    placement?: Placement,
    offset: number
    width: 'reference' | 'floating' | number
  }>(), {
    placement: 'bottom',
    offset: 4,
    width: 'reference'
  })

  const isOpen = ref(false);

  const trigger = ref<HTMLDivElement | null>(null);
  const dropdown = ref<HTMLDivElement | null>(null);

  const styleDropdown = ref<CSSProperties>({
    position: 'relative',
    left: '',
    top: '',
  });

  onClickOutside(trigger, () => (isOpen.value = false), {
    ignore: [dropdown],
  });

  const middleware = [
    size({
      apply({ elements }) {
        const width = elements.reference.getBoundingClientRect().width
        const widthFloating = elements.floating.children[0].getBoundingClientRect().width

        if(props.width === 'reference') {
          Object.assign(elements.floating.style, {
            minWidth: `${width}px`,
          });
        }
      },
    }),
    flip({
      fallbackStrategy: 'bestFit',
    }),
    floatingOffset(props.offset),
  ];

  const updatePosition = async () => {
    if (trigger.value && dropdown.value) {
      const position = await computePosition(trigger.value, dropdown.value, {
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

  onMounted(async () => {
    await nextTick();
    if (trigger.value && dropdown.value) {
      autoUpdate(trigger.value, dropdown.value, updatePosition);
    }
  });

  const close = () => (isOpen.value = false);
  const open = () => (isOpen.value = true);

  defineExpose({ close, open, isOpen });
</script>

<template>
  <div class="dropdown-control">
    <div
      ref="trigger"
      class="dropdown-control__trigger"
      tabindex="0"
      @click="isOpen = !isOpen"
    >
      <slot :options="{ isOpen }" />
    </div>
    <Transition name="dropdown">
      <div
        v-show="isOpen"
        ref="dropdown"
        class="dropdown-control__dropdown"
        :style="styleDropdown"
      >
        <slot name="dropdown" />
      </div>
    </Transition>
  </div>
</template>

<style>
  .dropdown-move,
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: transform 0.2s, opacity 0.2s;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
  }

  .dropdown-leave-active {
    transform-origin: 0 100%;
  }
</style>

<style scoped>
  .dropdown-control {
    position: relative;
  }

  .dropdown-control__dropdown {
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
    border-radius: var(--border-radius);
    background-color: var(--color-white);
    overflow: hidden;
    z-index: 10;
    overflow: auto;
    border: 1px solid var(--color-border-light);

    &::-webkit-scrollbar {
      width: 0;
    }
  }
</style>
