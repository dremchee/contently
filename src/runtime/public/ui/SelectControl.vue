<script lang="ts" setup>
  import { ref, computed } from '#imports';
  import IconControl from './IconControl.vue';
  import DropdownControl from './DropdownControl.vue';

  export type SelectType = {
    name: string;
    value: string | number | any;
    [key: string]: any;
  };

  const emit = defineEmits<{
    (e: 'update:modelValue', value: SelectType): void;
  }>();

  const props = defineProps<{
    modelValue: Partial<SelectType>;
    options: SelectType[];
    disabled?: boolean;
    cleanable?: boolean;
    placeholder?: string;
  }>();

  const dropdown = ref<InstanceType<typeof DropdownControl> | null>(null);

  const currentValue = computed(() => props.modelValue);

  const selectOption = (item: SelectType) => {
    emit('update:modelValue', item);
    dropdown.value?.close();
  };

  const clear = () => {
    emit('update:modelValue', {} as SelectType)
  }
</script>

<template>
  <DropdownControl
    ref="dropdown"
    class="select-control"
  >
    <template #default="{ options }">
      <div
        class="select-control__trigger"
        :class="[options.isOpen && 'is-open']"
      >
        <div
          class="select-control__trigger-text"
          :class="[!currentValue?.name && 'is-empty']"
        >
          <template v-if="currentValue?.name">
            {{ currentValue?.name }}
          </template>
          <template v-else>
            Please select
          </template>
        </div>
        <div
          v-if="cleanable && currentValue?.name"
          class="select-control__trigger-clear"
          @click.stop="clear"
        >
          <IconControl name="close" />
        </div>
        <div class="select-control__trigger-caret">
          <IconControl name="chevron" />
        </div>
      </div>
    </template>
    <template #dropdown>
      <div
        v-if="options && !!options?.length"
        class="select-control__dropdown"
      >
        <template v-if="options && !!options?.length">
          <template
            v-for="(option, index) in options"
            :key="index"
          >
            <div
              class="select-control__dropdown-item"
              :class="[currentValue?.value === option.value && 'is-active']"
              @click="selectOption(option)"
            >
              {{ option.name }}
            </div>
          </template>
        </template>
      </div>
    </template>
  </DropdownControl>
</template>

<style scoped>
  .select-control__trigger {
    display: flex;
    align-items: center;
    border: 1px solid var(--color-border);
    min-height: var(--control-height);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow-control-small);
    padding: 4px 10px;
    cursor: pointer;
    background-color: var(--color-white);

    &.is-open {
      .select-control__trigger-caret {
        transform: scale(1);
      }
    }
  }

  .select-control__trigger-text {
    width: 100%;
    &.is-empty {
      color: var(--color-secondary);
    }
  }

  .select-control__trigger-caret {
    justify-self: flex-end;
    transition: transform 0.2s;
    transform: scale(-1);
  }

  .select-control__trigger-clear {
    justify-self: flex-end;
    color: var(--color-border);

    &:hover {
      color: var(--color-default);
    }
  }

  .select-control__dropdown {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 4px;
  }

  .select-control__dropdown-item {
    font-size: 14px;
    padding: 6px 10px;
    cursor: pointer;
    border-radius: var(--border-radius);
    transition: background-color 0.2s;

    &:hover {
      background-color: var(--color-background-dark);
    }

    &.is-active {
      background-color: var(--color-background-dark);
      color: var(--color-default);
    }
  }
</style>
