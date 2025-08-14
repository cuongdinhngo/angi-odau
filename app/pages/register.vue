<template>
  <v-card
    class="py-2 elevation-0"
    :width="mdAndDown ? '100%' : '50%'"
  >
    <v-list-item link class="px-2 text-center">
    <template #title>
      <v-img
        :src="getIconPath('kiosk_trolley.svg')"
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
          v-model="name.value.value"
          :counter="10"
          :error-messages="name.errorMessage.value"
          label="Name"
          variant="outlined"
        ></v-text-field>

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
        prepend-icon="mdi-account-plus"
      >
        Signup
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
    v-model="snackbar"
    :timeout="timeout"
    color="green"
  >
    {{ message }}

    <template v-slot:actions>
      <v-btn
        color="blue"
        variant="text"
        @click="snackbar = false"
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

const { mdAndDown } = useDisplay();

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name (value) {
      if (value?.length >= 2) return true

      return 'Name needs to be at least 2 characters.'
    },
    password (value) {
      if (typeof value === 'string' && value.length >= 6) return true

      return 'Password needs to be at least 6 characters.'
    },
    email (value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

      return 'Must be a valid e-mail.'
    }
  },
});

const name = useField('name', undefined, { initialValue: 'Cuong Ngo' });
const password = useField('password', undefined, { initialValue: '123456' });
const email = useField('email', undefined, { initialValue: 'dinhcuongngo@gmail.com' });
const showPassword = ref(false);
const loading = ref(false);
const snackbar = ref(false);
const message = ref('');
const timeout = ref(3000);

const { insert } = useUsers();

const submit = handleSubmit(async values => {
  loading.value = true;
  snackbar.value = true;
  message.value = 'It is processing ...';
  const { data, error } = await useSupabaseClient().auth.signUp({
    email: values.email,
    password: values.password,
  });

  if (error) {
    console.error('Signup error:', error);
    loading.value = false;
    snackbar.value = true;
    message.value = 'Failed to sign up. Please try again.';
    return;
  } else {
    message.value = 'Signup successful!';
    snackbar.value = true;
    const { error:userError } = await insert({
      id: data.user?.id,
      name: values.name,
      email: values.email,
    });
    if (userError) {
      console.error('User insert error:', userError);
      message.value = 'Failed to create user profile.';
    }
    setTimeout(() => {
      navigateTo({ name: 'index' });
    }, timeout.value);
  }
})
</script>