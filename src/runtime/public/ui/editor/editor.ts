import { ShallowRef, shallowRef } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { Editor, EditorOptions, JSONContent } from "@tiptap/core";
import { useEditor as useTiptapEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Focus from "@tiptap/extension-focus";
import { Level } from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import ImageAdvanced from "./extensions/image";
import { ref, useState } from "#imports";

export type EditorModelValue = {
  html: string;
  text: string;
  json: JSONContent;
};

const instance = shallowRef<ShallowRef<Editor | undefined>>();

export const commandAction = {
  heading(level: Level) {
    instance.value?.value?.commands.toggleHeading({ level });
  },
  bold() {
    instance.value?.value?.chain().focus().toggleBold().run();
  },
  italic() {
    instance.value?.value?.chain().focus().toggleItalic().run();
  },
  underline() {
    instance.value?.value?.chain().focus().toggleUnderline().run();
  },
  bulletList() {
    instance.value?.value?.chain().focus().toggleBulletList().run();
  },
  orderedList() {
    instance.value?.value?.chain().focus().toggleOrderedList().run();
  },
  code() {
    instance.value?.value?.chain().focus().toggleCode().run();
  },
  clear() {
    instance.value?.value?.chain().focus().clearNodes().unsetAllMarks().run();
  },
  separator() {
    instance.value?.value?.chain().focus().setHorizontalRule().run();
  },
  image(src: string) {
    instance.value?.value?.chain().focus().setImage({ src }).run();
  },
  advancedImage(src: string) {
    instance.value?.value?.chain().focus().setAdvancedImage({ src }).run();
  },
};

const headerElement = ref<HTMLDivElement>();

export const useHeaderObserver = () => {
  const headerRect = ref({ width: 0, height: 0, x: 0, y: 0 });

  useResizeObserver(headerElement.value, ([entry]) => {
    const { width, height, x, y } = entry.contentRect;
    headerRect.value = {
      width,
      height,
      x,
      y,
    };
  });

  return { headerElement, headerRect };
};

export const useEditor = (options: Partial<EditorOptions>) => {
  const editor = useTiptapEditor({
    ...options,
    extensions: [
      StarterKit,
      Underline,
      Focus,
      HorizontalRule,
      Image,
      ImageAdvanced,
    ],
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  });
  instance.value = editor;

  return {
    editor,
    instance,
    EditorContent,
  };
};
