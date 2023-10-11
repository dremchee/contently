import { commandAction } from "./editor";

export const commands = [
  {
    id: "bold",
    icon: "bold",
    name: "Bold",
    action() {
      commandAction.bold();
    },
  },
  {
    id: "italic",
    icon: "italic",
    name: "Italic",
    action() {
      commandAction.italic();
    },
  },
  {
    id: "underline",
    icon: "underline",
    name: "Underline",
    action() {
      commandAction.underline();
    },
  },
  {
    id: "bulletList",
    icon: "list-bullet",
    name: "Bulletlist",
    action() {
      commandAction.bulletList();
    },
  },
  {
    id: "orderedList",
    icon: "list-ordered",
    name: "Orderlist",
    action() {
      commandAction.orderedList();
    },
  },
  {
    id: "code",
    icon: "code",
    name: "Code",
    action() {
      commandAction.code();
    },
  },
  {
    id: "clear",
    icon: "format-clear",
    name: "Clear",
    action() {
      commandAction.clear();
    },
  },
  {
    id: "separator",
    icon: "separator",
    name: "Separator",
    action() {
      commandAction.separator();
    },
  },
];
