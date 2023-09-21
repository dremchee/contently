<template>
  <div class="dashboard">
    <slot />
  </div>
</template>

<style>
  @import 'normalize.css';

  :root {
    --color-default: #21201e;
    --color-brand: #3a5c58;
    --color-brand-light: #537c77;
    --color-primary: #0080ff;
    --color-secondary: #c0c1b7;
    --color-secondary-dark: #847f78;
    --color-accent: #ff0062;
    --color-success: #1ead6d;
    --color-success-light: #18c476;
    --color-error: #f74808;
    --color-error-light: #fd6b35;
    --color-warning: #ff8c00;
    --color-warning-light: #e5a557;
    --color-white: #ffffff;
    --color-background: #f6f6f5;
    --color-background-dark: #ebebe8;
    --color-border-light: #dfdfd5;
    --color-border: #cfcec6;
    --control-height-small: 36px;
    --control-height: 48px;
    --control-height-large: 52px;
    --border-radius: 4px;
    --border-radius-large: 8px;
    --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    --box-shadow-small: 0 1px 2px rgba(0, 0, 0, 0.05);
    --box-shadow-large: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1);
    --box-shadow-control-small: 0 1px 2px rgba(0, 0, 0, 0.1);
    --box-shadow-control: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.2);
    --box-shadow-inset-control: inset 0 1px 2px rgba(0, 0, 0, 0.2);
    --font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --font-monospace: SFMono-Regular, Menlo, Monaco,Consolas, "Liberation Mono", "Courier New",monospace;
  }

  * {
    box-sizing: border-box;

    ::before {
      box-sizing: border-box;
    }

    ::after {
      box-sizing: border-box;
    }
  }

  a {
    color: var(--color-brand);
    text-decoration: none;

    &:hover {
      color: var(--color-brand-light);
    }
  }

  html,
  body {
    font-family: var(--font-sans-serif);
    min-height: 100%;
  }
</style>

<style scoped>
  .dashboard {
    min-height: 100vh;
    width: 100%;
    background-color: var(--color-background);
  }
</style>
