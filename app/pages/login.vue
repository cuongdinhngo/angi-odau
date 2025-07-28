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
        :loading="false"
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
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'fullview',
});

import { useField, useForm } from 'vee-validate';

const { mdAndDown } = useDisplay();

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

const submit = handleSubmit(values => {
  console.log('Form submitted:', values);
  alert(JSON.stringify(values, null, 2))
})
</script>