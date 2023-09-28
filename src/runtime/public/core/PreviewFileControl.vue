<script lang="ts" setup>
  import { computed } from '#imports';
  import IconControl from './IconControl.vue';
  import CheckboxControl from './CheckboxControl.vue';

  const emit = defineEmits<{
    'update:checked': [value: boolean]
  }>()

  const props = withDefaults(defineProps<{
    type: string
    size: number
    path: string
    name: string
    mode?: 'static' | 'default'
    checked?: boolean
  }>(), {
    mode: 'default',
    checked: false
  })

  const isChecked = computed({
    get() {
      return props.checked
    },
    set(value) {
      emit('update:checked', value)
    }
  })

  const bytesToSize = (bytes: number = 0): string => {
    const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte'];

    const navigatorLocal = navigator.languages && navigator.languages.length >= 0 ? navigator.languages[0] : 'en-US'
    const unitIndex = Math.max(0, Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1));

    return Intl.NumberFormat(navigatorLocal, {
      style: 'unit',
      unit : units[unitIndex]
    }).format(bytes / (1024 ** unitIndex))
  }

  const isImage = computed(() => props.type?.startsWith('image'))

  const types = computed(() => ([
    {
      enable: props.type?.startsWith('image'),
      icon: 'file-image'
    },
    {
      enable: props.type?.startsWith('video'),
      icon: 'file-video'
    },
    {
      enable: props.type?.startsWith('audio'),
      icon: 'file-audio'
    }
  ]))

  const classList = computed(() => [
    isChecked.value && 'is-checked',
    props.mode && `is-${props.mode}`,
  ])
</script>

<template>
  <div
    class="preview-file-control"
    :class="classList"
  >
    <div class="preview-file-control__preview">
      <div
        v-if="mode !== 'static'"
        class="preview-file-control__mark"
        @click.stop
      >
        <CheckboxControl v-model="isChecked" />
      </div>
      <template v-if="isImage">
        <img
          :src="path"
          :alt="name"
          class="preview-file-control__image"
          loading="lazy"
        >
      </template>
      <div
        v-else
        class="preview-file-control__preview-icon"
      >
        <IconControl
          :size="40"
          :name="types.find(e => e.enable)?.icon || 'file'"
        />
      </div>
    </div>
    <div class="preview-file-control__title">
      <div class="preview-file-control__title-text">
        {{ name }}
      </div>
      <div class="preview-file-control__title-meta">
        {{ type }}, {{ bytesToSize(size) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .preview-file-control {
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-radius: var(--border-radius);
    transition: .2s;

    &:not(.is-static) {
      cursor: pointer;
    }

    &:not(.is-checked):not(.is-static):hover {
      .preview-file-control__preview {
        background-color: var(--color-border);
      }

      .preview-file-control__image {
        opacity: .8;
      }

      .preview-file-control__mark {
        opacity: 1;
      }
    }

    &.is-checked {
      .preview-file-control__mark {
        opacity: 1;
      }

      .preview-file-control__preview {
        box-shadow: 0 0 0 4px var(--color-brand);
        background-color: var(--color-brand);
      }

      .preview-file-control__image {
        opacity: .6;
      }
    }
  }

  .preview-file-control__preview {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background-color: var(--color-border-light);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    aspect-ratio: 1/1;
    transition: .2s;
  }

  .preview-file-control__mark {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    opacity: 0;
    transition: .2s;
    padding: 8px;
  }

  .preview-file-control__preview-icon {
    color: var(--color-white);
  }

  .preview-file-control__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
    transition: opacity .2s;
  }

  .preview-file-control__title-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .preview-file-control__title-meta {
    font-size: 14px;
    color: var(--color-secondary);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
</style>
