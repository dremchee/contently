<script lang="ts" setup>
  import { computed, ref, watch } from '#imports';
  import IconControl from '../IconControl.vue';

  const props = withDefaults(defineProps<{
    modelValue: boolean;
    title?: string;
    size?: 'small' | 'normal' | 'large'
    direction?: 'center' | 'sidebar' | 'menu'
  }>(), {
    direction: 'center',
    size: 'normal',
    title: ''
  });

  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    close: [value: boolean];
  }>();

  const close = () => {
    emit('close', true);
    emit('update:modelValue', false);
  };

  const isShowModal = ref(props.modelValue)

  const classList = computed(() => {
    return [
      props.size && `is-${props.size}`,
      props.direction && `is-${props.direction}`,
      props.size && `is-${props.size}`
    ]
  })

  watch(() => props.modelValue, value => {
    if(value) {
      isShowModal.value = value
    }
  })

  const hideModal = () => {
    isShowModal.value = false
  }
</script>

<template>
  <Teleport
    v-if="isShowModal"
    to="#modal"
  >
    <Transition
      appear
      name="dialog"
      @after-leave="hideModal"
    >
      <dialog
        v-show="modelValue"
        open
        class="modal-control"
        :class="classList"
        :data-direction="direction"
      >
        <div class="modal-control__header">
          <div class="modal-control__header-title">
            <div class="modal-control__header-title-text">
              {{ title }}
            </div>
          </div>
          <div
            class="modal-control__header-close"
            @click="close"
          >
            <IconControl name="close" />
          </div>
        </div>
        <div class="modal-control__content">
          <slot />
        </div>
      </dialog>
    </Transition>
  </Teleport>
</template>

<style>
  .dialog-enter-active,
  .dialog-leave-active {
    transition: .2s cubic-bezier(0.77, 0, 0.175, 1);
  }

  .dialog-enter-from,
  .dialog-leave-to {
    &[data-direction="center"] {
      opacity: 0;
      transform: scale(0.95);
    }

    &[data-direction="menu"] {
      transform: translateX(-100%);
    }

    &[data-direction="sidebar"] {
      transform: translateX(100%);
    }
  }
</style>

<style scoped>
  .modal-control {
    max-width: 500px;
    max-height: 100vh;
    width: 100%;
    border: none;
    background: var(--color-white);
    padding: 0;
    border-radius: var(--border-radius);
    box-shadow: 0 10px 20px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: auto;

    &.is-sidebar {
      position: absolute;
      right: 0;
      left: auto;
      height: 100%;
      border-radius: 0;

      .modal-control__header {
        flex-direction: row-reverse;
      }

      .modal-control__header-title {
        padding-left: 0;
      }
    }

    &.is-menu {
      position: absolute;
      right: auto;
      left: 0;
      height: 100%;
      border-radius: 0;
    }

    &.is-small {
      max-width: 400px;
    }
    &.is-large {
      max-width: 850px;
    }
  }

  .modal-control__header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-border-light);
    min-height: 58px;
    background-color: var(--color-white);
    z-index: 2;
  }

  .modal-control__header-title {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px 24px;
    font-size: 18px;
    flex-grow: 1;
    overflow: hidden;
  }

  .modal-control__header-title-text {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .modal-control__header-close {
    display: flex;
    min-width: 32px;
    height: 32px;
    align-items: center;
    justify-content: center;
    margin: 0 12px;
    cursor: pointer;
    transition: 0.2s;
    border-radius: var(--border-radius);
    color: var(--color-border);

    &:hover {
      color: var(--color-default);
      background-color: var(--color-border-light);
    }
  }

  .modal-control__content {
    padding: 24px;
    height: 100%;
  }
</style>
