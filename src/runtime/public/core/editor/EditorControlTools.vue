<script lang="ts" setup>
  import { ref, useContently } from '#imports';
  import { Editor } from '@tiptap/vue-3';
  import { useEditor, EditorModelValue, commandAction } from './editor'
  import { DocumentType, File } from '#contently/api/types'
  import DashboardUploadFiles from '#contently/public/dashboard/entities/files/DashboardUploadFiles.vue'
  import DropdownControl from '../DropdownControl.vue';
  import IconControl from '../IconControl.vue';

  defineProps<{
    editor: Editor
  }>()

  const { previewUrl } = useContently()
  const headingEl = ref<InstanceType<typeof DropdownControl> | null>(null);
  const tableEl = ref<InstanceType<typeof DropdownControl> | null>(null);
  const imageEl = ref<InstanceType<typeof DropdownControl> | null>(null);

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
    commandAction.heading(level as any)
  }

  const isSelectedImages = ref(false)

  const selectImage = () => {
    isSelectedImages.value = true
    imageEl.value?.close()
  }

  const setImage = (image: DocumentType<File>) => {
    commandAction.image(previewUrl(image._id))
  }

</script>

<template>
  <div :class="$style['tools-inner']">
    <DropdownControl ref="headingEl">
      <template #default="{options}">
        <div
          :class="[$style['tools-item'], (options.isOpen || editor?.isActive('heading')) && $style['is-active']]"
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
            v-for="level in [1, 2, 3, 4, 5, 6]"
            :key="level"
            :class="[
              $style['tools-list-item'],
              $style[`h${level}`],
              editor?.isActive('heading', { level: level }) && $style['is-active']
            ]"
            @click="setHeading(level)"
          >
            Heading {{ level }}
          </div>
        </div>
      </template>
    </DropdownControl>
    <div
      v-for="item in commands"
      :key="item.id"
      :class="[$style['tools-item'], editor?.isActive(item.id) && $style['is-active']]"
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
    <div :class="$style['tools-item']">
      <IconControl
        :size="18"
        name="magic"
      />
    </div>
  </div>
  <DashboardUploadFiles
    v-model="isSelectedImages"
    @select="setImage"
  />
</template>

<style module>
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

    &.h1,
    &.h2,
    &.h3,
    &.h4,
    &.h5,
    &.h6 {
      font-weight: 700;
    }
    &.h1 {
      font-size: 2em;
    }

    &.h2 {
      font-size: 1.8em;
    }

    &.h3 {
      font-size: 1.4em;
    }

    &.h4 {
      font-size: 1.2em;
    }

    &.h5 {
      font-size: 1em;
    }

    &.h6 {
      font-size: 0.8em;
    }

    &.is-active {
      background-color: var(--color-border-light);
    }

    &:hover {
      background-color: var(--color-border-light);
    }
  }
</style>
