<script lang="ts" setup>
  import { computed, ref, onMounted, onUnmounted, nextTick } from '#imports';
  import { useEditor, EditorModelValue, useHeaderObserver } from './editor'
  import { useIntersectionObserver } from '@vueuse/core'
  import EditorControlTools from './EditorControlTools.vue';

  const props = defineProps<{
    modelValue: EditorModelValue;
  }>();

  const toolEl = ref<HTMLDivElement | null>(null);
  const isStickyTools = ref(false)

  const emit = defineEmits<{
    'update:modelValue': [value: EditorModelValue];
  }>();

  const input = computed({
    get() {
      return props.modelValue;
    },
    set(value: EditorModelValue) {
      emit('update:modelValue', value);
    },
  });

  const { headerRect } = useHeaderObserver()
  const top = computed(() => `${headerRect.value.height}px`)

  const { editor, instance, EditorContent } = useEditor({
    content: input.value?.json,
    onUpdate(e) {
      const data = {
        html: e.editor.getHTML(),
        json: e.editor.getJSON(),
        text: e.editor.getText()
      }

      input.value = data
    }
  })
  onMounted(async () => {
    await nextTick()
    if(toolEl.value) {
      useIntersectionObserver(toolEl, ([{ isIntersecting }]) => {
        isStickyTools.value = !isIntersecting
      })
    }
  })

  onUnmounted(() => {
    instance.value?.value?.destroy()
  })
</script>

<template>
  <div
    :class="$style['editor']"
  >
    <div :class="$style['area']">
      <div ref="toolEl" />
      <div
        :class="[$style['tools'], isStickyTools && $style['is-sticky']]"
      >
        <EditorControlTools
          v-if="editor"
          :editor="editor"
        />
      </div>
      <EditorContent
        :class="$style['content']"
        :editor="editor"
      />
    </div>
  </div>
</template>

<style module>
  .editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .area {
    box-shadow: var(--box-shadow-control-small);
    background-color: var(--color-white);
    border-radius: var(--border-radius);
    border: 1px solid var(--color-border-light);
  }

  .content {
    min-height: 200px;
  }

  .content :global(.tiptap img) {
    max-width: 100%;
  }

  .content :global(.tiptap .has-focus) {
    background-color: var(--color-background);
    box-shadow: 0 0 0 4px var(--color-background);
    border-radius: 2px;
  }

  .content :global(.tiptap) {
    outline: none;
    padding: 16px;
  }

  .tools {
    position: sticky;
    overflow: auto;
    top: v-bind(top);
    padding: 8px;
    display: flex;
    gap: 8px;
    border-bottom: 1px solid var(--color-border-light);
    background-color: var(--color-white);
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    z-index: 2;
    transition: .2s;
    width: 100%;

    &.is-sticky {
      box-shadow: var(--box-shadow-large);
    }
  }
</style>
