<script lang="ts" setup>
  import { ref, useContently } from '#imports'
  import { useTimeAgo } from '@vueuse/core';
  import IconControl from '#contently/public/core/IconControl.vue';
  import { DragHandle } from 'vue-slicksort'
  import DropdownControl from '#contently/public/core/DropdownControl.vue';

  defineProps<{
    label: string;
    date: number;
  }>();

  const { t } = useContently()

  const emit = defineEmits(['copy', 'remove'])

  const formatDate = (value: number) => useTimeAgo(value).value;

  const dropdown = ref<InstanceType<typeof DropdownControl>>()
</script>

<template>
  <div :class="[$style['item'], dropdown?.isOpen && $style['is-open-more']]">
    <DragHandle :class="$style['icon']">
      <IconControl
        name="draggable"
      />
    </DragHandle>
    <div :class="$style['label']">
      {{ label }}
    </div>
    <div :class="$style['date']">
      {{ formatDate(date) }}
    </div>
    <div
      :class="$style['more']"
      @click.stop
    >
      <DropdownControl
        ref="dropdown"
        placement="bottom-end"
      >
        <div :class="[$style['more-icon'], dropdown?.isOpen && $style['is-active']]">
          <IconControl
            name="more"
          />
        </div>
        <template #dropdown>
          <div :class="$style['more-list']">
            <div
              :class="$style['more-item']"
              @click="emit('copy')"
            >
              <IconControl
                :size="18"
                name="copy-paste"
                :class="$style['more-item-icon']"
              />
              {{ t('copy') }}
            </div>
            <div
              :class="$style['more-item']"
              @click="emit('remove')"
            >
              <IconControl
                :size="18"
                name="trash"
                :class="$style['more-item-icon']"
              />
              {{ t('remove') }}
            </div>
          </div>
        </template>
      </DropdownControl>
    </div>
  </div>
</template>

<style module>
  .item {
    display: flex;
    align-items: center;
    gap: 16px;
    background-color: var(--color-white);
    padding: 12px 16px;
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
    cursor: pointer;
    box-shadow: var(--box-shadow-small);

    &:hover {
      background-color: var(--color-background);
    }

    &.is-open-more {
      background-color: var(--color-background);
    }
  }

  .label {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    cursor: ns-resize;
    color: var(--color-border);
    margin-left: -8px;

    &:hover {
      color: var(--color-default);
    }
  }

  .more {
    margin-right: -8px;
  }

  .more-icon {
    color: var(--color-border);

    &:hover {
      color: var(--color-default);
    }

    &.is-active {
      color: var(--color-default);
    }
  }

  .more-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .more-item {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 8px;
    font-size: 14px;

    &:hover {
      background-color: var(--color-background-dark);
    }
  }

  .date {
    margin-left: auto;
    color: var(--color-secondary);
    font-size: 12px;
    white-space: nowrap;
  }
</style>
