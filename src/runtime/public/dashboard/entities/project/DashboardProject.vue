<script lang="ts" setup>
  import { useContently, ref, watch } from '#imports'
  import { useToast } from '#contently/public/core/toast'
  import { LANGUAGES } from '../../../../plugins/const'
  import ButtonControl from '../../../core/ButtonControl.vue';
  import DashboardMainWrapper from '../../components/DashboardMainWrapper.vue';
  import DashboardHeader from '../../components/DashboardHeader.vue';
  import ControlsGroup from '../../../core/ControlsGroup.vue';
  import InputField from '../../../core/InputField.vue';
  import SelectControl from '../../../core/SelectControl.vue';


  const { api, t, settings, locale } = useContently()
  const { toastShow } = useToast()

  const form = ref({ ...settings.value.meta })
  const isPending = ref(false)

  const langs = LANGUAGES.map(([name, value]) => ({
    name,
    value,
  }))

  const lang = ref(langs.find(e => e.value === settings.value.meta.locale) || langs[0])

  watch(lang, (value) => {
    form.value.locale = value.value
    locale.value = form.value.locale
  })

  const updateSettings = async () => {
    isPending.value = true
    await api.updateMetaSettings(form.value)
    await api.getSettings()
    isPending.value = false

    toastShow({
      text: 'Update project settings',
      type: 'success'
    })
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
