<script lang="ts" setup>
  import { useRoute, useRouter } from '#app';
  import { ref, computed, useContently, onMounted } from '#imports';
  import { useDraggable } from '@vueuse/core';
  import IconControl from '../../core/IconControl.vue';
  import { RouterName } from '../../../plugins/const';

  const { t, collections } = useContently();

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

  const styleMenu = computed(() => ({
    width: `${x.value - 60}px`,
  }));

  const currentRoute = useRoute();
  const router = useRouter();

  const items = computed(() => [
    {
      id: 'content',
      name: 'main',
      icon: 'home',
      route: {
        name: RouterName.CONTENT,
      },
    },
    {
      id: 'files',
      name: 'files',
      icon: 'folder',
      route: {
        name: RouterName.FILES,
      },
      children: [],
    },
    {
      id: 'settings',
      name: 'settings',
      icon: 'settings',
      route: {
        name: RouterName.SETTINGS,
      },
    },
  ]);

  // const currentItem = computed(
  //   () =>
  //     items.value.find(e => e.id === router.currentRoute.value.meta?.parent)?.children ||
  //     []
  // );

  // const routeToPage = async (item: typeof items.value[number], navigate?: any) => {
  //   const [first] = item.children;

  //   if (first) {
  //     return router.push(first.route);
  //   }

  //   return navigate();
  // };
</script>

<template>
  <div :class="$style['navigation']">
    <div :class="$style['logo']">
      <IconControl
        name="copy"
        :size="32"
      />
    </div>
    <div :class="$style['list']">
      <a
        href="/"
        :class="$style['item']"
        target="_blank"
      >
        <span :class="$style['icon']">
          <IconControl name="eye" />
        </span>
      </a>
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        v-slot="{ navigate, href, isActive }"
        :to="item.route"
        custom
      >
        <a
          :href="href"
          :class="[
            $style['item'],
            isActive && $style['is-active']]"
          @click.prevent="navigate()"
        >
          <span :class="$style['icon']">
            <IconControl :name="item.icon" />
          </span>
        </a>
      </NuxtLink>
    </div>
    <div :class="$style['user']">
      <IconControl name="user" />
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
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    background-color: var(--color-brand);
    color: var(--color-white);
  }
  .list {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .item {
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
