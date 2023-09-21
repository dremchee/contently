<script lang="ts" setup>
  import { computed, useContently } from '#imports';

  const { api } = useContently();
  const { data } = await api.getCollectionByKey('home');
  const content = computed(() => data?.items[0].content)
</script>

<template>
  <div>
    <header class="masthead text-center text-white">
      <div class="masthead-content">
        <div class="container px-5">
          <h1 class="masthead-heading mb-0">
            {{ content?.title }}
          </h1>
          <h2 class="masthead-subheading mb-0">
            {{ content?.description }}
          </h2>
          <a
            class="btn btn-primary btn-xl rounded-pill mt-5"
            href="#scroll"
          >
            {{ content?.button }}
          </a>
        </div>
      </div>
      <div class="bg-circle-1 bg-circle" />
      <div class="bg-circle-2 bg-circle" />
      <div class="bg-circle-3 bg-circle" />
      <div class="bg-circle-4 bg-circle" />
    </header>
    <div
      v-if="content?.content"
      v-html="content?.content.html"
    />
    <section id="scroll">
      <div
        v-for="(fact, index) in content?.facts"
        :key="fact.id"
        class="container px-5"
      >
        <div class="row gx-5 align-items-center">
          <div
            class="col-lg-6"
            :class="{'order-lg-2': index % 2}"
          >
            <div class="p-5">
              <img
                class="img-fluid rounded-circle"
                src="../assets/img/01.jpg"
                alt="..."
              >
            </div>
          </div>
          <div class="col-lg-6 order-lg-1">
            <div class="p-5">
              <h2 class="display-4">
                {{ fact.name }}
              </h2>
              <p>{{ fact.note }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="container p-5">
        <div class="row gx-5 align-items-center">
          <p>{{ content?.introtext }}</p>
        </div>
      </div>
    </section>
  </div>
</template>
