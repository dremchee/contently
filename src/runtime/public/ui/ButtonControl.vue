<script lang="ts" setup>
  import { computed } from '#imports';
  import IconControl from './IconControl.vue';

  const props = withDefaults(
    defineProps<{
      variant: 'primary' | 'secondary' | 'error' | 'success' | 'link' | 'link-error';
      size: 'small' | 'normal' | 'large';
      icon?: string;
      disabled?: boolean;
      loading?: boolean;
      block?: boolean
    }>(),
    {
      variant: 'primary',
      size: 'normal',
      icon: ''
    }
  );

  const slots = defineSlots()

  const styleList = computed(() => [
    props.variant && `is-${props.variant}`,
    props.disabled && `is-disabled`,
    props.size && `is-${props.size}`,
    props.icon && `has-icon`,
    props.loading && `is-loading is-disabled`,
    props.block && `is-block`,
  ]);

  const sizeIcon = computed(() => {
    if(props.size === 'small') return 18
    return 24
  })
</script>

<template>
  <a
    href=""
    class="button-control"
    :class="styleList"
    @click.prevent
  >
    <div
      v-if="loading"
      class="button-control__loading"
    >
      <IconControl
        :size="sizeIcon"
        name="spin"
      />
    </div>
    <span
      v-if="icon"
      class="button-control__icon"
    >
      <IconControl
        :size="sizeIcon"
        :name="icon"
      />
    </span>
    <span
      v-if="slots.default"
      class="button-control__text"
    >
      <slot />
    </span>
  </a>
</template>

<style scoped>
  .button-control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 24px;
    gap: 6px;
    line-height: 1;
    background-color: var(--color-brand);
    border: 1px solid var(--color-brand);
    color: var(--color-white);
    min-height: var(--control-height);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-control);
    transition: 0.2s;
    cursor: pointer;
    white-space: nowrap;
    position: relative;

    &:hover {
      background-color: var(--color-brand-light);
    }

    &:active {
      box-shadow: none;
    }

    &.is-block {
      width: 100%;
    }

    &.is-secondary {
      background-color: var(--color-white);
      border: 1px solid var(--color-border);
      color: var(--color-default);

      &:hover {
        background-color: var(--color-background);
      }
    }

    &.is-error {
      background-color: var(--color-error);
      border: 1px solid var(--color-error);
      color: var(--color-white);

      &:hover {
        background-color: var(--color-error-light);
      }
    }

    &.is-success {
      background-color: var(--color-success);
      border: 1px solid var(--color-success);
      color: var(--color-white);

      &:hover {
        background-color: var(--color-success-light);
      }
    }

    &.is-link {
      background-color: transparent;
      border: 1px solid transparent;
      box-shadow: none;
      color: var(--color-default);

      &:hover {
        background-color: var(--color-background-dark);
      }
    }

    &.is-link-error {
      background-color: transparent;
      border: 1px solid transparent;
      box-shadow: none;
      color: var(--color-error);

      &:hover {
        background-color: var(--color-background-dark);
      }
    }

    &.is-small {
      padding: 4px 12px;
      min-height: var(--control-height-small);
      font-size: 14px;
    }

    &.is-disabled {
      pointer-events: none;
      opacity: 0.6;
    }

    &.is-loading {
      .button-control__text,
      .button-control__icon {
        opacity: 0;
      }
    }
  }

  .button-control__icon {
    display: flex;
  }

  .button-control__loading {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: loading 2s linear infinite;
  }

  @keyframes loading {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
