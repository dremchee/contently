<script lang="ts" setup>
  import { useContently, ref, onMounted, useRouter } from '#imports';
  import { DocumentType, Collections } from '../../../../api/types';
  import { RouterName } from '../../../../plugins/const';
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import DashboardCollectionsItem from './components/DashboardCollectionsItem.vue';
  import DashboardCollectionAddForm from './components/DashboardCollectionAddForm.vue';
  import ButtonControl from '../../../core/ButtonControl.vue';
  import ModalWindow from '../../../core/modal/ModalWindow.vue';
  import PreloaderControl from '../../../core/PreloaderControl.vue';

  const router = useRouter();
  const { api, t } = useContently();

  const collections = ref<DocumentType<Collections>[]>([]);
  const isOpenForm = ref(false);
  const isPending = ref(true);

  const getCollections = async () => {
    isPending.value = true;
    const response = await api.getCollections();
    isPending.value = false;
    if (response.data) {
      collections.value = response.data;
    }
  };

  const routeToCollection = (id: string) => {
    router.push({
      name: RouterName.COLLECTIONS_ID,
      params: {
        id,
      },
    });
  };

  const removeCollection = async (id: string) => {
    const response = await api.removeCollectionById(id);

    if (response) {
      getCollections();
    }
  };

  const createCollection = async (
    data: InstanceType<typeof DashboardCollectionAddForm>['form']
  ) => {
    const response = await api.createCollection(data);
    if (response?.data) {
      await getCollections();
      isOpenForm.value = false;
    }
  };

  const formAddCollection = () => {
    isOpenForm.value = true;
  };

  onMounted(async () => {
    getCollections();
  });
</script>

<template>
  <DashboardMainWrapper>
    <template #header>
      <DashboardHeader>
        <template #title>
          {{ t('collections') }}
        </template>
        <template #action>
          <ButtonControl
            variant="secondary"
            icon="plus"
            size="small"
            @click="formAddCollection"
          >
            Новая коллекция
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>

    <div class="dashboard-collection">
      <PreloaderControl v-if="isPending" />
      <div
        v-else
        class="dashboard-collection__list"
      >
        <div class="dashboard-collection__list-inner">
          <DashboardCollectionsItem
            v-for="item in collections"
            :key="item._id"
            :item="item"
            @click="routeToCollection(item._id)"
            @remove="removeCollection(item._id)"
          />
        </div>
        <ModalWindow
          v-model="isOpenForm"
          title="Новая коллекция"
        >
          <DashboardCollectionAddForm @create="createCollection" />
        </ModalWindow>
      </div>
    </div>
  </DashboardMainWrapper>
</template>

<style scoped>
  .dashboard-collection {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .dashboard-collection__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .dashboard-collection__list-inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .dashboard-collection__list-header {
    display: grid;
    grid-template-columns: 20% 1fr 10%;
  }

  .dashboard-collection__list-header-item {
    font-size: 14px;
    color: var(--color-secondary-dark);
  }

  .dashboard-collection__form {
    margin-top: 16px;
  }
</style>
