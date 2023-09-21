<script lang="ts" setup>
import { computed, ref } from '#imports'
import { useResizeObserver } from '@vueuse/core'
import IconControl from '#contently/public/core/IconControl.vue';

const props = withDefaults(defineProps<{
  total: number;
  limit: number;
  page: number;
}>(), {
  total: 1,
  limit: 10,
  page: 1
})

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const wrapper = ref<HTMLDivElement>()
const width = 32
const gap = 4
const maxItems = ref(0)

const splitArray = (arr: number[], chunkSize: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        result.push(arr.slice(i, i + chunkSize));
    }
    return result;
};

useResizeObserver(wrapper, ([entry]) => {
  maxItems.value = Math.floor(entry.contentRect.width / (width + gap * 2))
})

const pages = computed(() => Array(Math.ceil(props.total / props.limit)).fill(0).map((_, i) => i + 1))

const items = computed(() => {
  return splitArray(pages.value, maxItems.value || 1)
})

const indexPage = computed(() => items.value.findIndex(e => e.includes(props.page)))

const setPagePrev = () => {
  emit('update:page', props.page <= 1 ? props.page : props.page - 1)
}

const setPageNext = () => {
  emit('update:page', props.page < pages.value.length ? props.page + 1 : props.page)
}
</script>

<template>
  <div
    v-if="pages.length > 1"
    ref="wrapper"
    class="pagination-control"
  >
    <div
      class="pagination-control__item is-arrow is-prev"
      @click="setPagePrev"
    >
      <IconControl name="arrow-left" />
    </div>
    <div class="pagination-control__list">
      <div
        v-for="item in items[indexPage]"
        :key="item"
        class="pagination-control__item"
        :class="{'is-active': item === page}"
        @click="emit('update:page', item)"
      >
        {{ item }}
      </div>
    </div>
    <div
      class="pagination-control__item is-arrow is-next"
      @click="setPageNext"
    >
      <IconControl name="arrow-right" />
    </div>
  </div>
</template>

<style scoped>
  .pagination-control {
    display: flex;
    gap: 4px;
    justify-content: space-between;
    flex-wrap: nowrap;
  }

  .pagination-control__item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--color-white);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
    color: var(--color-default);
    font-size: 14px;

    &:hover {
      background-color: var(--color-border-light);
    }

    &.is-arrow {
      color: var(--color-secondary);
    }

    &.is-active {
      background-color: var(--color-brand);
      border: 1px solid var(--color-brand-light);
      color: var(--color-white);
    }
  }

  .pagination-control__list {
    display: flex;
    gap: 4px;
    flex-wrap: nowrap;
  }
</style>
