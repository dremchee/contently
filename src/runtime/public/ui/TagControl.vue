<script lang="ts" setup>
  import IconControl from './IconControl.vue';

  defineProps<{
    label: string
  }>()

  const emit = defineEmits(['remove'])
</script>

<template>
  <div
    :class="$style['tag']"
    :v-bind="$attrs"
  >
    <div :class="$style['label']">
      {{ label }}
    </div>
    <div
      :class="$style['close']"
      @click="emit('remove')"
    >
      <IconControl
        name="close"
        :size="20"
      />
    </div>
  </div>
</template>

<style module>
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    border: 1px solid var(--color-border-light);
    background-color: var(--color-background);
    border-radius: var(--border-radius);
    padding: 4px 8px;
    overflow: hidden;
    box-shadow: var(--box-shadow-small);
    &:hover {
      background-color: var(--color-white);
    }
  }

  .label {
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
  }

  .close {
    cursor: pointer;
    opacity: .2;
    transition: .2s;
    margin-right: -4px;

    &:hover {
      opacity: 1;
    }
  }
</style>
