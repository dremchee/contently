<script lang="ts" setup>
  import { useContently } from '#imports';
  import { DragHandle } from 'vue-slicksort'
  import IconControl from '#runtime/public/ui/IconControl.vue';
  import TooltipControl from '#runtime/public/ui/TooltipControl.vue';

  const { t } = useContently();
  withDefaults(
    defineProps<{
      label: string;
      icon?: string;
      alias?: string;
      hidden?: boolean;
      required?: boolean;
    }>(),
    {
      controls: true,
      alias: '',
      icon: ''
    }
  );
</script>

<template>
  <div :class="$style['field']">
    <DragHandle
      :class="$style['handle']"
    >
      <IconControl name="draggable" />
    </DragHandle>
    <div :class="$style['label']">
      {{ label }}
    </div>
    <div
      v-if="alias"
      :class="$style['alias']"
    >
      {{ alias }}
    </div>
    <div :class="$style['icons']">
      <div
        v-if="hidden"
        :class="$style['icon']"
      >
        <TooltipControl :text="t('readonly') || ''">
          <IconControl
            name="eye-off"
            :size="20"
          />
        </TooltipControl>
      </div>
      <div
        v-if="required"
        :class="$style['icon']"
      >
        <TooltipControl :text="t('required') || ''">
          <IconControl
            name="asterisk"
            :size="20"
          />
        </TooltipControl>
      </div>
    </div>
  </div>
</template>

<style module>
  .field {
    background-color: var(--color-white);
    padding: 12px 4px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
    box-shadow: var(--box-shadow-small);
    display: flex;
    gap: 16px;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: var(--color-background);
    }
  }

  .handle {
    color: var(--color-secondary);

    &:hover {
      color: var(--color-default);
    }
  }

  .alias {
    color: var(--color-secondary);
    font-family: monospace;
  }

  .icons {
    display: flex;
    gap: 16px;
    margin-left: auto;
    margin-right: 16px;
  }

  .icon {
    color: var(--color-secondary);
  }
</style>
