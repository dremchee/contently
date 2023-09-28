<script lang="ts" setup>
  import { useContently, useRoute, ref, navigateTo } from '#imports';
  import { useToast } from '#contently/public/core/toast'
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ButtonControl from '../../../core/ButtonControl.vue';
  import { RouterName } from '../../../../plugins/const';
  import DashboardContentForm from './components/DashboardContentForm.vue';

  const route = useRoute();
  const { api, t } = useContently();

  const { toastShow } = useToast()

  const collection = await api.getCollectionById(String(route.params.id));

  const form = ref({
    published: false,
    content: {} as Record<string, any>
  });

  const createContent = async () => {
    const response = await api.createCollectionById(String(collection.data?._id),
      form.value,
    );

    if (response?.data) {
      navigateTo({
        name: RouterName.CONTENT_ITEMS,
        params: {
          id: String(route.params.id),
        },
      });

      toastShow({
        text: 'Success create document',
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
          {{ collection.data?.name }}
        </template>
        <template #action>
          <ButtonControl
            size="small"
            icon="check"
            variant="secondary"
            @click="createContent"
          >
            {{ t('save') }}
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>

    <DashboardContentForm
      v-model="form"
      :fields="collection.data?.fields"
    />
  </DashboardMainWrapper>
</template>

<style scoped>
  .dashboard-content-add {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
