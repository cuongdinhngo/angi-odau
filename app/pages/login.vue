<template>
  <v-card
    class="py-2 elevation-0"
    :width="mdAndDown ? '100%' : '50%'"
  >
    <v-list-item link class="px-2 text-center">
    <template #title>
      <v-img
        :src="iconPath('kiosk_trolley.svg')"
        width="40"
        height="40"
        cover
        class="mx-auto"
      />
    </template>
    <template #subtitle>
      <span class="text-caption font-weight-bold text-black">Ăn gì, Ở đâu</span>
    </template>
  </v-list-item>
    <v-divider></v-divider>
    <v-card-text>
      <form @submit.prevent="submit">
        <v-text-field
          v-model="email.value.value"
          :error-messages="email.errorMessage.value"
          label="E-mail"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="password.value.value"
          :counter="6"
          :error-messages="password.errorMessage.value"
          label="Password"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
        ></v-text-field>
      </form>
    </v-card-text>
    <v-card-actions class="d-flex justify-end">
      <v-btn
        @click="submit"
        class="me-4"
        type="submit"
        variant="flat"
        color="primary"
        :loading="loading"
        prepend-icon="mdi-login"
      >
        Login
      </v-btn>

      <v-btn
        @click="handleReset"
        variant="tonal"
        prepend-icon="mdi-autorenew"
      >
        Clear
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-snackbar
    v-model="snackbar.visible"
    :timeout="snackbar.timeout"
    :color="snackbar.color"
  >
    <span class="text-h6">{{ snackbar.message }}</span>

    <template v-slot:actions>
      <v-btn
        color="white"
        variant="elevated"
        @click="snackbar.visible = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'fullview',
});

import { useField, useForm } from 'vee-validate';

const { storeUserIntoLocalStorage, get:getUserInfo } = useUsers();
const { mdAndDown } = useDisplay();
const loading = ref(false);

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    password (value) {
      if (typeof value === 'string' && value.length >= 0) return true

      return 'Password is required.'
    },
    email (value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

      return 'Must be a valid e-mail.'
    }
  },
});

const password = useField('password');
const email = useField('email');
const showPassword = ref(false);
const snackbar = reactive({
  visible: false,
  message: '',
  timeout: 5000,
  color: 'green',
});

const submit = handleSubmit(async values => {
  console.log('Form submitted:', values);
  loading.value = true;
  const { data, error } = await useSupabaseClient().auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });
  if (error) {
    console.error('Login error:', error);
    snackbar.visible = true;
    snackbar.color = 'red';
    snackbar.message = 'Something went wrong. Please try again.';
    setTimeout(() => {
      snackbar.visible = false;
      loading.value = false;
    }, snackbar.timeout);
  } else {
    const { data:userInfo, error:userError } = await getUserInfo(data.user.id);
    if (userError) {
      console.error('Error fetching user info:', userError);
      snackbar.visible = true;
      snackbar.color = 'red';
      snackbar.message = 'Failed to fetch user information.';
      loading.value = false;
      return;
    }
    storeUserIntoLocalStorage(userInfo);
    console.log('Current User => ', userInfo);
    snackbar.visible = true;
    snackbar.message = 'Welcome back!';
    setTimeout(() => {
      navigateTo({ name: 'index' });
    }, 1500);
  }
})
</script>