<script lang="ts" setup>
  import { useContently, useRoute, ref, computed, navigateTo, onMounted } from '#imports';
  import { useToast } from '#contently/public/core/toast'
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import DashboardPagePreloader from '#contently/public/dashboard/components/DashboardPagePreloader.vue';
  import ButtonControl from '../../../core/ButtonControl.vue';
  import { Collection, Collections, DocumentType } from '../../../../api/types';
  import DashboardContentEditForm from './components/DashboardContentForm.vue'
  import { RouterName } from '#contently/plugins/const';

  const { toastShow } = useToast()

  const route = useRoute();
  const { api, t } = useContently();

  const collection = ref<Partial<DocumentType<Collections>>>({});
  const resource = ref({} as DocumentType<Collection>);
  const isUpdating = ref(false)
  const isPending = ref(false)

  const form = ref({
    published: false,
    content: {} as Record<string, any>
  });

  const fetchResource = async () => {
    const response = await api.getCollectionByResourceId(
      String(route.params.id),
      String(route.params.resource)
    );

    if (response.data) {
      resource.value = response.data;
      form.value.published = response.data.published

      Object.keys(response.data?.content || {}).forEach(key => {
        form.value.content[key] = response.data?.content[key];
      });
    }
  };

  const updateContent = async () => {
    isUpdating.value = true

    if (collection.value._id) {
      await api.updateCollectionByResourceId(
        collection.value._id,
        resource.value._id,
        {
          ...form.value
        }
      );

      await fetchResource()
      isUpdating.value = false

      toastShow({
        text: 'Success update document',
        type: 'success'
      })
    }
  };

  const remove = async () => {
    if(collection.value?._id) {
      await api.removeCollectionByResourceId(collection.value?._id, resource.value._id)

      navigateTo({
        name: RouterName.CONTENT_ITEMS,
        params: {
          id: collection.value?._id
        }
      })

      toastShow({
        text: 'Success remove document',
        type: 'warning'
      })
    }
  }

  const title = computed(() => form.value.content[collection.value?.options?.displayField || ''] || collection.value?.name)

  onMounted(async () => {
    isPending.value = true
    collection.value = (await api.getCollectionById(String(route.params.id))).data || {}
    await await fetchResource();
    isPending.value = false
  })
</script>

<template>
  <DashboardMainWrapper>
    <template #header>
      <DashboardHeader>
        <template #title>
          {{ title }}
        </template>
        <template #action>
          <ButtonControl
            variant="link"
            icon="trash"
            size="small"
            @click="remove"
          >
            {{ t('remove') }}
          </ButtonControl>
          <ButtonControl
            variant="secondary"
            icon="check"
            size="small"
            :loading="isUpdating"
            @click="updateContent"
          >
            {{ t('save') }}
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>
    <DashboardPagePreloader v-if="isPending" />
    <DashboardContentEditForm
      v-else
      v-model="form"
      :fields="collection?.fields"
    />
  </DashboardMainWrapper>
</template>

<style scoped>
  .dashboard-content-edit {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
