<script lang="ts" setup>
  import { ref } from '#imports';
  import InputField from './InputField.vue';
  import TagControl from './TagControl.vue';
  import ButtonControl from './ButtonControl.vue';

  const props = defineProps<{
    modelValue: string[]
  }>()

  const tag = ref('')
  const list = ref<string[]>([])

  const enterHandler = (e: KeyboardEvent) => {
    const items = tag.value.split(',')

    items.forEach(item => {
      if(item.trim()) {
        list.value.push(item.trim())
      }
    })

    tag.value = ''
  }

  const onDragElement = (e: DragEvent, index: number) => {
    if(e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
      e.dataTransfer.effectAllowed = 'move'
    }
    e.dataTransfer?.setData('item-index', String(index))
  }

  const onDrop = (e: DragEvent) => {
    // console.log(e.dataTransfer?.getData('item-index'));
  }

  const onDropElement = (e: DragEvent, index: number) => {
    const idx = Number(e.dataTransfer?.getData('item-index'))
    const [element] = list.value.splice(idx, 1)
    list.value.splice(index, 0, element)
  }

  const removeItem = (index: number) => {
    list.value.splice(index, 1)
  }

  const clear = () => {
    list.value = []
  }
</script>

<template>
  <div :class="$style['tags']">
    <div :class="$style['field']">
      <InputField
        v-model="tag"
        @keydown.enter.stop="enterHandler"
      />
    </div>
    <div
      v-if="list.length"
      :class="$style['controls']"
      @drop.stop="onDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <TagControl
        v-for="(item, index) in list"
        :key="index"
        :label="item"
        draggable="true"
        :data-index="index"
        @dragstart="onDragElement($event, index)"
        @drop.stop="onDropElement($event, index)"
        @remove="removeItem(index)"
      />
    </div>
    <div
      v-if="list.length"
      :class="$style['clear']"
    >
      <ButtonControl
        variant="link"
        size="small"
        icon="trash"
        @click="clear"
      >
        Clear all
      </ButtonControl>
    </div>
  </div>
</template>

<style module>
  .tags {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .controls {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .clear {

  }
</style>
