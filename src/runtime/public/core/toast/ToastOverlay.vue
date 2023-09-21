<script lang="ts" setup>
  import ToastControl from './ToastControl.vue'
  import { useToast } from '.'

  const { toasts, hideToast } = useToast()
</script>

<template>
  <div
    class="toast-overlay"
  >
    <TransitionGroup
      name="toast"
    >
      <ToastControl
        v-for="toast in toasts"
        :key="toast.id"
        :text="toast.text"
        :type="toast.type"
        @close="hideToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<style>
  .toast-enter-active,
  .toast-leave-active {
    transition: .2s;
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(8px);
    opacity: 0;
  }
</style>

<style scoped>
  .toast-overlay {
    position: fixed;
    pointer-events: none;
    width: 100vw;
    height: 100vh;
    display: flex;
    gap: 8px;
    flex-direction: column-reverse;
    padding: 16px;
  }
</style>
