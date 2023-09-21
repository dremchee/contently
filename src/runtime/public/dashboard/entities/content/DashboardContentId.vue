<script lang="ts" setup>
  import { useContently, useRoute, useRouter, ref, computed, watch } from '#imports';
  import { useToast } from '#contently/public/core/toast'
  import { DocumentType, Collections } from '#contently/api/types'
  import { RouterName } from './../../../../plugins/const';
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ButtonControl from '../../../core/ButtonControl.vue';
  import DashboardContentItem from './components/DashboardContentItem.vue';
  import DashboardContentForm from './components/DashboardContentForm.vue';
  import PaginationControl from '#contently/public/core/PaginationControl.vue';

  const route = useRoute();
  const router = useRouter();
  const { api, t } = useContently();
  const { toastShow } = useToast()

  const pagination = ref({
    limit: 20,
    skip: 0
  })

  const page = ref({} as DocumentType<Collections>);

  const isPending = ref(false)

  const form = ref({
    key: '',
    published: false,
    content: {},
  });

  const isSinglePage = computed(() => page.value?.singleton)

  const paginationState = computed(() => {
    if(page.value?.total) {
      if(page.value.total < pagination.value.limit) {
        return {
          items: 0
        }
      }
      return {
        items: page.value.total / pagination.value.limit
      }
    }
  })

  const currentPage = ref(1)

  const getCollections = async () => {
    const { data } = await api.getCollectionById(String(route.params.id), pagination.value);

    if (data?.singleton) {
      const [item] = data.items;
      const { key, published, content } = item;
      form.value = {
        key,
        published,
        content,
      };
    }

    if(data) {
      page.value = data
    }
  }

  await getCollections()

  const toPaginate = (num: number) => {
    pagination.value.skip = num * pagination.value.limit

    getCollections()
  }

  watch(currentPage, (value) => {
    toPaginate(value - 1)
  })

  const routeToAdd = () => {
    router.push({
      name: RouterName.CONTENT_ADD,
      params: {
        id: route.params.id,
      },
    });
  };

  const routeToPage = (pageId: string) => {
    router.push({
      name: RouterName.CONTENT_EDIT,
      params: {
        id: route.params.id,
        resource: pageId
      },
    });
  };

  const routeToCollection = () => {
    router.push({
      name: RouterName.COLLECTIONS_ID,
      params: {
        id: route.params.id,
      },
    });
  }

  const updateSingleResource = async () => {
    isPending.value = true
    if (page.value?._id) {
      const [item] = page.value.items;
      await api.updateCollectionByResourceId(page.value._id, item._id, form.value);
      isPending.value = false

      toastShow({
        text: 'Success update DocumentType',
        type: 'success'
      })
    }
  };
</script>

<template>
  <DashboardMainWrapper>
    <template #header>
      <DashboardHeader>
        <template #title>
          {{ page.name }}
        </template>
        <template #action>
          <ButtonControl
            size="small"
            icon="pencil"
            variant="link"
            @click="routeToCollection"
          >
            {{ t('edit') }}
          </ButtonControl>
          <template v-if="isSinglePage">
            <ButtonControl
              size="small"
              icon="check"
              :loading="isPending"
              variant="secondary"
              @click="updateSingleResource"
            >
              {{ t('save') }}
            </ButtonControl>
          </template>

          <template v-else>
            <ButtonControl
              size="small"
              icon="plus"
              variant="secondary"
              @click="routeToAdd"
            >
              {{ t('addPage') }}
            </ButtonControl>
          </template>
        </template>
      </DashboardHeader>
    </template>

    <div class="dashboard-content-id">
      <NuxtPage />
      <template v-if="isSinglePage">
        <DashboardContentForm
          v-if="page"
          v-model="form"
          :fields="page.fields"
        />
      </template>

      <template v-else>
        <div class="dashboard-content-id__form">
          <ControlsGroup :label="t('key')">
            <InputField
              v-model="form.key"
              disabled
            />
          </ControlsGroup>
          <ControlsGroup :label="t('name')">
            <InputField v-model="form.name" />
          </ControlsGroup>
          <ControlsGroup>
            <CheckboxControl
              v-model="form.published"
              :label="t('published')"
            />
          </ControlsGroup>
        </div>
        <div class="dashboard-content-id__list">
          <DashboardContentItem
            v-for="item in page?.items"
            :key="item._id"
            :label="item.name"
            :alias="item.key"
            :date="item.updatedAt"
            @click="routeToPage(item._id)"
          />
        </div>
        <PaginationControl
          v-if="paginationState"
          v-model:page="currentPage"
          :total="paginationState.items"
        />
      </template>
    </div>
  </DashboardMainWrapper>
</template>

<style scoped>
  .dashboard-content-id {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .dashboard-content-id__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .pagination-control {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .pagination-control__item {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background-color: var(--color-white);
    border-radius: var(--border-radius);
    color: var(--color-default);
    font-size: 14px;

    &:hover {
      background-color: var(--color-border-light);
    }
  }
</style>
