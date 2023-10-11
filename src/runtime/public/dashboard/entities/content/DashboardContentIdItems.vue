<script lang="ts" setup>
  import { useContently, useRoute, useRouter, ref, watch, navigateTo, onMounted, useNuxtData } from '#imports';
  import { DocumentType, Collections, Collection } from '#runtime/api/types'
  import { RouterName } from '#runtime/public/core/const';
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ButtonControl from '../../../ui/ButtonControl.vue';
  import DashboardPagePreloader from '#runtime/public/dashboard/components/DashboardPagePreloader.vue';
  import DashboardContentItem from './components/DashboardContentItem.vue';
  import DashboardContentForm from './components/DashboardContentForm.vue';
  import PaginationControl from '#runtime/public/ui/PaginationControl.vue';
  import ModalWindow from '#runtime/public/ui/modal/ModalWindow.vue';
  import { SlickList, SlickItem } from 'vue-slicksort'

  const route = useRoute();
  const router = useRouter();
  const { api, t } = useContently();

  const paginate = ref({
    limit: 20,
    skip: 0
  })

  const collection = ref({} as DocumentType<Collections>);
  const currentPage = ref(1)
  const isCopied = ref(false)
  const isPending = ref(false)
  const copiedData = ref<DocumentType<Collection>>()

  const fetchCollection = async () => {
    const { data } = await api.getCollectionById(String(route.params.id), paginate.value);

    if(data) {
      collection.value = data
    }
  }

  const toPaginate = (num: number) => {
    paginate.value.skip = num * paginate.value.limit

    fetchCollection()
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

  const sortUpdate = async (e: { event: MouseEvent, newIndex: number, oldIndex: number}) => {
    const id = collection.value._id

    if(!collection.value.items?.[e.oldIndex]._id) {
      return
    }

    const data = {
      id: collection.value.items?.[e.oldIndex]._id,
      from: e.oldIndex + paginate.value.skip,
      to: e.newIndex + paginate.value.skip,
    }

    await api.updateOrder(id, data)
  }

  const setLimit = (limit: number) => {
    paginate.value = {
      limit,
      skip: 0
    }

    currentPage.value = 1
    fetchCollection()
  }

  const copyItem = (item: DocumentType<Collection>) => {
    console.log('copyItem', item);
    isCopied.value = true
    copiedData.value = item
  }

  onMounted(async () => {
    isPending.value = true
    await fetchCollection()

  if(collection.value.singleton) {
    navigateTo({
      name: RouterName.CONTENT_EDIT,
      params: {
        resource: collection.value.items?.[0]._id,
      },
    })
  }
    isPending.value = false
  })
</script>

<template>
  <DashboardMainWrapper>
    <template #header>
      <DashboardHeader>
        <template #title>
          {{ collection.name }}
        </template>
        <template #action>
          <ButtonControl
            variant="link"
            icon="pencil"
            size="small"
            @click="routeToCollection"
          >
            {{ t('edit') }}
          </ButtonControl>
          <ButtonControl
            size="small"
            icon="plus"
            variant="secondary"
            @click="routeToAdd"
          >
            {{ t('addPage') }}
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>
    <DashboardPagePreloader v-if="isPending || collection.singleton" />
    <div
      v-else
      :class="$style['content']"
    >
      <SlickList
        v-model:list="collection.items"
        :class="$style['list']"
        axis="y"
        lock-axis="y"
        use-drag-handle
        :helper-class="$style['helper']"
        @sort-end="sortUpdate"
      >
        <SlickItem
          v-for="(item, index) in collection.items"
          :key="item"
          :index="index"
        >
          <DashboardContentItem
            :label="item.content[collection.options?.displayField || ''] || item.key"
            :date="item.updatedAt"
            @click="routeToPage(item._id)"
            @copy="copyItem(item)"
          />
        </SlickItem>
      </SlickList>
      <PaginationControl
        v-model:page="currentPage"
        :limit="collection.limit"
        :total="collection.total"
      />
    </div>

    <ModalWindow
      v-model="isCopied"
      title="Copied data"
    >
      <DashboardContentForm
        v-if="copiedData"
        v-model="copiedData"
        :fields="collection.fields"
      />
      <ButtonControl block>
        {{ t('save') }}
      </ButtonControl>
    </ModalWindow>
  </DashboardMainWrapper>
</template>

<style module>
  .content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .helper {
    box-shadow: var(--box-shadow-large);
  }
</style>
../../../core/const
