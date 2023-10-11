<script lang="ts" setup>
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top">
    <div class="container px-5">
      <NuxtLink
        class="navbar-brand"
        to="/"
      >
        Start Bootstrap
      </NuxtLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarResponsive"
        aria-controls="navbarResponsive"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div
        id="navbarResponsive"
        class="collapse navbar-collapse"
      >
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <NuxtLink
              class="nav-link"
              to="/blog"
            >
              Blog
            </NuxtLink>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a
              class="nav-link"
              href="#!"
            >Sign Up</a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link"
              href="#!"
            >Log In</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
