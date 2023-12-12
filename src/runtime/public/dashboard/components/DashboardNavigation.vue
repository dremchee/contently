<script lang="ts" setup>
  import { ref, computed, useContently, useRuntimeConfig } from '#imports';
  import { useDraggable } from '@vueuse/core';
  import IconControl from '../../ui/IconControl.vue';
  import TooltipControl from '#runtime/public/ui/TooltipControl.vue';
  import DropdownControl from '#runtime/public/ui/DropdownControl.vue';
  import { RouterName } from '#runtime/public/core/const'

  const { t, breakpoint } = useContently();

  const drag = ref<HTMLDivElement | null>(null);
  const isDragMenu = ref(false);

  const { x } = useDraggable(drag, {
    initialValue: { x: 360, y: 0 },
    onStart() {
      isDragMenu.value = true;
    },
    onEnd() {
      isDragMenu.value = false;
    },
  });

  const config = useRuntimeConfig()

  const extensionRouter = config.public.contently.extensions.map((e: any) => {
    const { name, icon, title, route } = e
    return {
      name,
      icon,
      title,
      route: {
        name: `admin-extension-${route}`
      }
    }
  })


  const items = computed(() => [
    {
      name: 'main',
      icon: 'home',
      title: t('main'),
      route: {
        name: RouterName.CONTENT,
      },
    },
    {
      name: 'files',
      title: t('files'),
      icon: 'folder',
      route: {
        name: RouterName.FILES,
      },
      children: [],
    },
    {
      name: 'settings',
      title: t('settings'),
      icon: 'settings',
      route: {
        name: RouterName.SETTINGS,
      },
    },
    ...extensionRouter
  ]);
</script>

<template>
  <div :class="[$style['navigation'], !breakpoint.phablet.value && $style['is-compact']]">
    <div
      v-if="breakpoint.phablet.value"
      :class="$style['logo']"
    >
      <IconControl
        name="copy"
        :size="32"
      />
    </div>
    <div :class="$style['list']">
      <div :class="$style['item']">
        <a
          href="/"
          :class="$style['link']"
          target="_blank"
        >
          <span :class="$style['icon']">
            <IconControl name="eye" />
          </span>
        </a>
      </div>

      <NuxtLink
        v-for="item in items"
        :key="item.name"
        v-slot="{ navigate, href, isActive }"
        :to="item.route"
        custom
      >
        <div :class="$style['item']">
          <a
            :href="href"
            :class="[
              $style['link'],
              isActive && $style['is-active']
            ]"
            @click.prevent="navigate()"
          >
            <TooltipControl
              :text="String(item.title)"
              placement="right"
              :timeout="1000"
            >
              <span :class="$style['icon']">
                <IconControl :name="item.icon" />
              </span>
            </TooltipControl>
          </a>
        </div>
      </NuxtLink>

      <div
        :class="[
          $style['item'],
          $style['is-last'],
        ]"
      >
        <a
          href=""
          :class="$style['link']"
          @click.prevent
        >
          <IconControl name="user" />
        </a>
      </div>
    </div>
  </div>
</template>

<style module>
  .navigation {
    display: flex;
    flex-direction: column;
    min-width: 60px;
    height: 100%;
    background-color: var(--color-border-light);

    &.is-compact {
      flex-direction: row;
      min-width: 100%;
    }
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 60px;
    height: 60px;
    background-color: var(--color-brand);
    color: var(--color-white);
  }
  .list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .is-compact & {
      flex-direction: row;
    }
  }

  .item {

    &.is-last {
      margin-top: auto;
    }

    .is-compact & {
      width: 100%;
    }

  }

  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    color: var(--color-default);
    transition: .2s;
    &.is-active {
      background-color: var(--color-white);
    }
  }


  .user {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    margin-top: auto;
  }
</style>
../../core/const
