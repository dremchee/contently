<script lang="ts" setup>
  import { useContently, useRoute, ref, navigateTo, onMounted } from '#imports';
  import { useToast } from '#runtime/public/ui/toast'
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ButtonControl from '../../../ui/ButtonControl.vue';
  import { RouterName } from '#runtime/public/core/const';
  import DashboardContentForm from './components/DashboardContentForm.vue';
  import { fields } from '#runtime/public/dashboard/entities/fields'

  const route = useRoute();
  const { api, t } = useContently();

  const { toastShow } = useToast()

  const collection = await api.getCollectionById(String(route.params.id));
  const contentForm = ref<InstanceType<typeof DashboardContentForm>>()

  const form = ref({
    published: false,
    content: {} as Record<string, any>
  });

  const isValid = ref(false)

  const createContent = async () => {
    await contentForm.value?.handleSubmit()

    if(isValid.value) {
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
          message: 'Success create document',
          type: 'success'
        })
      }
    } else {
      toastShow({
        message: 'Invalid form',
        type: 'error'
      })
    }
  };

  const validateForm = (e: any) => {
    isValid.value = Boolean(!e)
  }

  onMounted(() => {
    collection.data.fields.forEach(field => {
      const current = fields.find(e => e.type === field.type)
      form.value.content[field.key]  =current?.defaultValue
    })
  })
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
      ref="contentForm"
      v-model="form"
      :fields="collection.data?.fields"
      @validate="validateForm"
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
