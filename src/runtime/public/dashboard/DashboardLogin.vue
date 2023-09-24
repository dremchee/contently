<script lang="ts" setup>
  import { RouterName } from '../../plugins/const';
  import config from '../../../config.json';
  import { navigateTo, ref, useContently } from '#imports';
  import InputField from '../core/InputField.vue';
  import ButtonControl from '../core/ButtonControl.vue';
  const { api, t } = useContently();
  import { version } from '../../../../package.json'

  const form = ref({
    email: import.meta.env.DEV ? config.userLogin : '',
    password: import.meta.env.DEV ? config.userPassword : '',
  });

  const login = async () => {
    const user = await api.loginUser(form.value);

    if (user?.data) {
      navigateTo({
        name: RouterName.CONTENT,
      });
    }
  };
</script>

<template>
  <div class="dashboard-login">
    <div class="dashboard-login__container">
      <div class="dashboard-login__title">
        {{ t('controlPanel') }}
      </div>
      <div class="dashboard-login__form">
        <InputField
          v-model="form.email"
          :placeholder="t('email')"
        />
        <InputField
          v-model="form.password"
          type="password"
          :placeholder="t('password')"
        />
        <ButtonControl @click="login">
          {{ t('login') }}
        </ButtonControl>
      </div>
      <div class="dashboard-login__note">
        {{ t('version') }}: {{ version }}
      </div>
    </div>
  </div>
</template>

<style scoped>
  .dashboard-login {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    align-self: center;
  }

  .dashboard-login__container {
    width: 320px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dashboard-login__form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dashboard-login__title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 16px;
  }

  .dashboard-login__note {
    text-align: center;
    font-size: 14px;
  }
</style>
