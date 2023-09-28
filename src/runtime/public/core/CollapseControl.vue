<script lang="ts" setup>
  import { computed, ref, useCssModule } from '#imports';
  import IconControl from './IconControl.vue';

  const props = withDefaults(defineProps<{
    open: boolean
  }>(), {
    open: false
  })

  const isCollapsed = ref(props.open);
  const collapse = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  const style = useCssModule()

  const classList = computed(() => [isCollapsed.value && style['is-open']]);
</script>

<template>
  <div
    :class="[$style['collapse'], classList]"
  >
    <div
      :class="$style['trigger']"
      @click="collapse"
    >
      <div :class="$style['content']">
        <slot name="trigger" />
      </div>

      <span :class="$style['caret']">
        <IconControl
          :class="$style['icon']"
          name="arrow-down"
        />
      </span>
    </div>
    <div :class="$style['collapsed']">
      <div :class="$style['container']">
        <slot />
      </div>
    </div>
  </div>
</template>

<style module>
  .collapse {
    --collapse-transition: cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .collapsed {
    display: grid;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition: grid-template-rows 0.2s var(--collapse-transition), opacity 0.4s var(--collapse-transition);
    margin: -8px;
    padding: 8px;
    opacity: 0;

    .is-open & {
      grid-template-rows: 1fr;
      opacity: 1;
    }
  }

  .trigger {
    display: flex;
    gap: 8px;
    cursor: pointer;
    margin-bottom: 8px;
    padding: 8px 0;
  }

  .caret {
    display: flex;
    margin-left: auto;
  }

  .icon {
    transition: 0.2s var(--collapse-transition);
    transform: rotate(-90deg);

    .is-open & {
      transform: rotate(0);
    }
  }

  .container {
    min-height: 0;
  }
</style>
