<template>
  <v-navigation-drawer
    app
    width="100"
    v-model="navMenu"
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

    <!-- Menu items -->
    <v-list>
      <v-list-item
        v-for="item in menu"
        :key="item.value"
        link
        class="pa-2 text-center"
        @click="handleSearchQuery(item.value)"
        :value="item.value"
        color="primary"
      >
        <template #title>
          <v-img
            :src="iconPath(item.icon)"
            width="40"
            height="40"
            cover
            class="mx-auto"
            :alt="item.icon"
          />
        </template>
      <template #subtitle>
        <span class="text-caption font-weight-bold text-black">{{ item.label }}</span>
      </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
const { mdAndDown } = useDisplay();
const searchQuery = useSearchQuery();
const route = useRoute();

const navMenu = defineModel(
  'navMenu',
  {
    type: Boolean,
    default: false,
  }
);

function handleSearchQuery(value: string) {
  searchQuery.value.tags = [value];
  searchQuery.value.isWishlist = false;
  searchQuery.value.isFavorite = false;
  navMenu.value = false;
  if (route.name !== 'index') {
    navigateTo({ name: 'index', query: { ...route.query, tags: value } });
  }
}

const menu = [
  {
    label: 'Ăn Sáng',
    value: 'an-sang',
    icon: 'an_sang.svg',
  },
  {
    label: 'Ăn Trưa',
    value: 'an-trua',
    icon: 'an_trua.svg',
  },
  {
    label: 'Ăn Tối',
    value: 'an-toi',
    icon: 'an_toi.svg',
  },
  {
    label: 'Đi Cafe',
    value: 'di-cafe',
    icon: 'soft_drink_juice.svg',
  },
  {
    label: 'Ăn Vặt',
    value: 'an-vat',
    icon: 'an_vat.svg',
  },
  {
    label: 'Ăn Nhậu',
    value: 'an-nhau',
    icon: 'an_nhau.svg',
  },
  {
    label: 'Ăn Chay',
    value: 'an-chay',
    icon: 'an_chay.svg',
  }
];
</script>