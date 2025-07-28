<template>
  <v-card
    class="py-2 elevation-0 mx-auto my-15"
    :width="mdAndDown ? '100%' : '50%'"
  >
    <v-card-title class="text-center">
      <span class="text-h6 font-weight-bold text-black">Ăn gì, Ở đâu</span>
    </v-card-title>
    <v-card-text>
      <form @submit.prevent="submit">
        <v-text-field
          v-model="name.value.value"
          :error-messages="name.errorMessage.value"
          label="Name"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="address.value.value"
          :error-messages="address.errorMessage.value"
          label="Address"
          variant="outlined"
        ></v-text-field>

        <v-text-field
          v-model="description.value.value"
          :error-messages="description.errorMessage.value"
          label="description"
          variant="outlined"
        ></v-text-field>

        <v-file-input
          v-model="selectedPhoto"
          @change="handleFileUpload"
          accept="image/*"
          label="Photo"
          variant="outlined"
        ></v-file-input>
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
        prepend-icon="mdi-plus"
      >
        Add
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
    {{ snackbar.message }}
  </v-snackbar>
</template>
<script setup lang="ts">
import { useField, useForm } from 'vee-validate';

const { mdAndDown } = useDisplay();
const { uploadPhoto } = usePhotos();
const { insert:addNewPlace } = useFoodPlaces();
const { getLatLongFromAddress } = useLocations();

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name (value) {
      if (typeof value === 'string' && value.length >= 0) return true

      return 'Name is required.'
    },
    address (value) {
      if (typeof value === 'string' && value.length >= 0) return true

      return 'Name is required.'
    },
  },
});

const name = useField('name', undefined, { initialValue: 'goc.coffee' });
const address = useField('address', undefined, { initialValue: '192 Hoàng Diệu, Phước Ninh, Hải Châu, Đà Nẵng 550000, Vietnam' });
const description = useField('description', undefined, { initialValue: 'Chào bạn ghé thăm GÓC quán nhỏ của tụi mình' });
const tags = useField('tags');
const selectedPhoto = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const loading = ref(false);
const snackbar = reactive({
  visible: false,
  message: '',
  timeout: 3000,
  color: 'success'
});

const handleFileUpload = (event:any) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    selectedPhoto.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const submit = handleSubmit(async values => {
  loading.value = true;
  let photoUrl = null;
  if (selectedPhoto.value) {
    photoUrl = await uploadPhoto(selectedPhoto.value);
  }

  const { lat, lng } = await getLatLongFromAddress(address.value.value);

  const data = {
    ...values,
    photo: photoUrl,
    lat,
    lng,
  };

  const { error } = await addNewPlace(data);
  loading.value = false;
  if (error) {
    console.error('Error adding new place:', error);
    snackbar.visible = true;
    snackbar.color = 'red';
    snackbar.message = 'Failed to add new place. Please try again.';
  } else {
    console.log('New place added successfully:', data);
    handleReset();
    snackbar.visible = true;
    snackbar.message = 'New place added successfully!';
    snackbar.color = 'green';
  }
  console.log('Form submitted with values:', data);
})
</script>