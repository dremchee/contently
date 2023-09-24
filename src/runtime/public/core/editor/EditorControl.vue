<script lang="ts" setup>
  import { computed, ref, onMounted, onUnmounted, nextTick } from '#imports';
  import { useEditor, EditorModelValue, commandAction } from './editor'
  import { DocumentType, File } from '#contently/api/types'
  import { useIntersectionObserver } from '@vueuse/core'
  import { useContently } from '#imports'
  import DropdownControl from '../DropdownControl.vue';
  import IconControl from '../IconControl.vue';
  import DashboardUploadFiles from '#contently/public/dashboard/entities/files/DashboardUploadFiles.vue'

  const { previewUrl } = useContently()

  const props = defineProps<{
    modelValue: EditorModelValue;
  }>();

  const headingEl = ref<InstanceType<typeof DropdownControl> | null>(null);
  const tableEl = ref<InstanceType<typeof DropdownControl> | null>(null);
  const imageEl = ref<InstanceType<typeof DropdownControl> | null>(null);
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

  const commands = [
    {
      id: "bold",
      icon: "bold",
      name: "Bold",
      action() {
        commandAction.bold()
      },
    },
    {
      id: "italic",
      icon: "italic",
      name: "Italic",
      action() {
        commandAction.italic()
      },
    },
    {
      id: "underline",
      icon: "underline",
      name: "Underline",
      action() {
        commandAction.underline()
      },
    },
    {
      id: "bulletList",
      icon: "list-bullet",
      name: "Bulletlist",
      action() {
        commandAction.bulletList()
      },
    },
    {
      id: "orderedList",
      icon: "list-ordered",
      name: "Orderlist",
      action() {
        commandAction.orderedList()
      },
    },
    {
      id: "code",
      icon: "code",
      name: "Code",
      action() {
        commandAction.code()
      },
    },
    {
      id: "clear",
      icon: "format-clear",
      name: "Clear",
      action() {
        commandAction.clear()
      },
    },
    {
      id: "separator",
      icon: "separator",
      name: "Separator",
      action() {
        commandAction.separator()
      },
    }
  ];

  const setHeading = (level: number) => {
    headingEl.value?.close()
    commandAction.headind(level as any)
  }

  const isSelectedImages = ref(false)

  const selectImage = () => {
    isSelectedImages.value = true
    imageEl.value?.close()
  }

  const setImage = (image: DocumentType<File>) => {
    commandAction.image(previewUrl(image._id))
  }

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
        <div :class="$style['tools-inner']">
          <DropdownControl ref="headingEl">
            <template #default="{options}">
              <div
                :class="[$style['tools-item'], options.isOpen && $style['is-active']]"
              >
                <IconControl
                  :size="18"
                  name="heading"
                />
              </div>
            </template>

            <template #dropdown>
              <div :class="$style['tools-list']">
                <div
                  v-for="num in [1, 2, 3, 4, 5, 6]"
                  :key="num"
                  :class="$style['tools-list-item']"
                  @click="setHeading(num)"
                >
                  Heading {{ num }}
                </div>
              </div>
            </template>
          </DropdownControl>
          <div
            v-for="item in commands"
            :key="item.id"
            :class="[$style['tools-list-item'], editor?.isActive(item.id) && $style['is-active']]"
            @click="item.action"
          >
            <IconControl
              :size="18"
              :name="item.icon"
            />
          </div>
          <DropdownControl ref="tableEl">
            <div :class="$style['tools-list-item']">
              <IconControl
                :size="18"
                name="table"
              />
            </div>

            <template #dropdown>
              <div class="editor-control__tools-table">
                table
              </div>
            </template>
          </DropdownControl>
          <DropdownControl ref="imageEl">
            <template #default="{ options }">
              <div
                :class="[$style['tools-item'], options.isOpen && $style['is-active']]"
              >
                <IconControl
                  :size="18"
                  name="image"
                />
              </div>
            </template>

            <template #dropdown>
              <div :class="$style['tools-list']">
                <div
                  :class="$style['tools-list-item']"
                >
                  Load from computed
                </div>
                <div
                  :class="$style['tools-list-item']"
                  @click="selectImage"
                >
                  Select with filemanager
                </div>
              </div>
            </template>
          </DropdownControl>
          <div :class="$style['tools-list-item']">
            <IconControl
              :size="18"
              name="magic"
            />
          </div>
        </div>
      </div>
      <DashboardUploadFiles
        v-model="isSelectedImages"
        @select="setImage"
      />
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

  .content :global(.tiptap) {
    outline: none;
    padding: 16px;
  }

  .tools {
    position: sticky;
    overflow: auto;
    top: 68px;
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

  .tools-inner {
    display: inline-flex;
    flex-wrap: wrap;
  }

  .tools-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    min-width: 28px;
    transition: .2s;
    border-radius: var(--border-radius);
    cursor: pointer;

    &:hover {
      background-color: var(--color-border-light);
    }

    &.is-active {
      background-color: var(--color-border-light);
    }
  }

  .tools-list {
    display: flex;
    gap: 8px;
    flex-direction: column;
    padding: 4px;
  }

  .tools-list-item {
    border-radius: var(--border-radius);
    padding: 4px 8px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: var(--color-border-light);
    }
  }
</style>
