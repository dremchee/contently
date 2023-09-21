<script lang="ts" setup>
  import { computed } from '#imports';

  const props = defineProps<{
    label?: string;
    optional?: string;
    message?: string;
    type?: 'label';
    direction?: 'column' | 'row'
  }>();

  const tag = computed(() => {
    if (props.type === 'label') {
      return 'label';
    }

    return 'div';
  });

  const classList = computed(() => [props.direction && `is-${props.direction}`])
</script>

<template>
  <Component
    :is="tag"
    class="control-group"
    :class="classList"
  >
    <div
      v-if="label"
      class="control-group__label"
    >
      <div class="control-group__label-text">
        {{ label }}
      </div>
      <div
        v-if="optional"
        class="control-group__label-optional"
      >
        {{ optional }}
      </div>
    </div>
    <div class="control-group__container">
      <slot />
    </div>
    <div
      v-if="message"
      class="control-group__message"
    >
      {{ message }}
    </div>
  </Component>
</template>

<style scoped>
  .control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    &.is-row {
      .control-group__container {
        flex-direction: row;
      }
    }
  }

  .control-group__label {
    display: flex;
    font-size: 14px;
    font-weight: 500;
  }

  .control-group__container {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
  }

  .control-group__label-optional {
    color: var(--color-secondary-dark);
    margin-left: auto;
    font-family: var(--font-monospace);
  }

  .control-group__message {
    font-size: 12px;
    color: var(--color-secondary-dark);
  }
</style>
