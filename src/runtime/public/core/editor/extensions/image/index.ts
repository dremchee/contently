import { mergeAttributes, Node, nodeInputRule } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";

import Component from "./Component.vue";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageAdvanced: {
      setAdvancedImage: (options: { src: string }) => ReturnType;
    };
  }
}

export const inputRegex =
  /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

export default Node.create({
  name: "imageAdvanced",
  group: "block",
  // content: "block+",
  draggable: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-advanced-item"]',
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "image-advanced-item" }),
    ];
  },
  addCommands() {
    return {
      setAdvancedImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
  // addInputRules() {
  //   return [
  //     nodeInputRule({
  //       find: inputRegex,
  //       type: this.type,
  //       getAttributes: (match) => {
  //         const [, , alt, src, title] = match;

  //         return { src, alt, title };
  //       },
  //     }),
  //   ];
  // },
  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
