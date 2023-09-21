<template>
  <div :class="$style['layout']">
    <div :class="$style['sidebar']">
      <slot name="sidebar" />
    </div>
    <div :class="$style['main']">
      <slot />
    </div>
  </div>
</template>

<style module>
  .layout {
    display: flex;
    width: 100%;
    height: 100vh;
  }

  .main {
    flex-grow: 1;
    overflow: auto;
    height: 100vh;
  }
</style>
