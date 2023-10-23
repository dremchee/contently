<script lang="ts" setup>
  import { useContently, computed } from '#imports';
  import type { DocumentType, File } from '#runtime/api/types'
  import PreviewFileControl from '#runtime/public/ui/PreviewFileControl.vue';

  const emit = defineEmits<{
    'update:checked': [value: boolean]
  }>()

  const { previewUrl } = useContently()

  const props = withDefaults(defineProps<{
    item: DocumentType<File>
    mode?: 'static' | 'default'
    checked?: boolean
  }>(), {
    checked: false,
    mode: 'default'
  })

  const isChecked = computed({
    get() {
      return props.checked
    },
    set(value) {
      emit('update:checked', value)
    }
  })
</script>

<template>
  <PreviewFileControl
    v-model="isChecked"
    v-model:checked="isChecked"
    :name="item.originName"
    :type="item.type"
    :size="item.size"
    :mode="mode"
    :path="previewUrl(item._id, { width: 250, height: 250, quality: 60 })"
  />
</template>
