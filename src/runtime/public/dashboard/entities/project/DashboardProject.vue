<script lang="ts" setup>
  import { useContently, ref, watch, onMounted, onUnmounted } from '#imports'
  import { LANGUAGES } from '#runtime/public/core/const'
  import ButtonControl from '../../../ui/ButtonControl.vue';
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ControlsGroup from '../../../ui/ControlsGroup.vue';
  import InputField from '../../../ui/InputField.vue';
  import SelectControl from '../../../ui/SelectControl.vue';
  import { LangType } from '#runtime/api/types';
  // import { useNotification } from '#runtime/public/core/notification'
  import { useToast } from '#runtime/public/ui/toast';
  // import { SSEMethodName } from '#runtime/server/hooks';

  const { api, t, settings, locale } = useContently()
  const { toastShow } = useToast();
  // const { noticeEvent } = useNotification()

  const form = ref({ ...settings.value.meta })
  const isPending = ref(false)

  const langs = LANGUAGES.map(([name, value]) => ({
    name,
    value,
  }))

  const lang = ref(langs.find(e => e.value === settings.value.meta.locale) || langs[0])

  watch(lang, (value) => {
    form.value.locale = value.value as LangType
    locale.value = form.value.locale as LangType
  })

  const updateSettings = async () => {
    isPending.value = true
    await api.updateMetaSettings(form.value)

    toastShow({
      type: 'success',
      message: 'Update settings success'
    })
    isPending.value = false
  }
</script>

<template>
  <DashboardMainWrapper>
    <template #header>
      <DashboardHeader>
        <template #title>
          {{ t('project') }}
        </template>
        <template #action>
          <ButtonControl
            size="small"
            icon="check"
            variant="secondary"
            :loading="isPending"
            @click="updateSettings"
          >
            {{ t('save') }}
          </ButtonControl>
        </template>
      </DashboardHeader>
    </template>
    <div
      class="dashboard-project"
    >
      <ControlsGroup
        label="Title"
      >
        <InputField v-model="form.title" />
      </ControlsGroup>
      <ControlsGroup
        label="Description"
      >
        <InputField v-model="form.description" />
      </ControlsGroup>
      <ControlsGroup
        label="Favicon"
      >
        <InputField v-model="form.favicon" />
      </ControlsGroup>
      <ControlsGroup
        label="Language"
      >
        <SelectControl
          v-model="lang"
          :options="langs"
        />
      </ControlsGroup>
    </div>
  </DashboardMainWrapper>
</template>

<style scoped>
  .dashboard-project {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
