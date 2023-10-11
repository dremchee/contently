<script lang="ts" setup>
  import { computed, ref, useContently } from '#imports';
  import ControlsGroup from '../../../../ui/ControlsGroup.vue';
  import InputField from '../../../../ui/InputField.vue';
  import ButtonControl from '../../../../ui/ButtonControl.vue';
  import CheckboxControl from '../../../../ui/CheckboxControl.vue';

  const emit = defineEmits<{
    create: [typeof form.value];
  }>();

  const { t } = useContently();

  const form = ref({
    key: '',
    name: '',
    singleton: false,
  });

  const isInvalid = computed(
    () => !(Boolean(form.value.key.length) && Boolean(form.value.name.length))
  );

  const add = () => {
    !isInvalid.value && emit('create', form.value);
  };

  defineExpose({ form });
</script>

<template>
  <div class="dashboard-create-collection">
    <ControlsGroup
      :label="t('key')"
      :message="t('keyMuxstBeUnique')"
    >
      <InputField
        v-model="form.key"
      />
    </ControlsGroup>
    <ControlsGroup :label="t('name')">
      <InputField v-model="form.name" />
    </ControlsGroup>
    <ControlsGroup
      :label="t('typeCollection')"
      :message="t('cannotChangeItsType')"
    >
      <CheckboxControl
        v-model="form.singleton"
        :label="t('singleton')"
      />
    </ControlsGroup>
    <ButtonControl
      @click="add"
    >
      {{ t('create') }}
    </ButtonControl>
  </div>
</template>

<style scoped>
  .dashboard-create-collection {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
