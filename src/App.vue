<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import Header from './components/tienda/common/Header.vue';
import Footer from './components/tienda/common/Footer.vue';

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith('/admin'));
</script>

<template>
  <div id="app" :class="{ 'admin-app': isAdminRoute }">
    <!-- Header con banner y navbar — oculto en panel de administración -->
    <Header v-if="!isAdminRoute" />

    <!-- Contenido principal -->
    <main :class="isAdminRoute ? 'admin-content' : 'main-content'">
      <RouterView />
    </main>

    <!-- Footer — oculto en panel de administración -->
    <Footer v-if="!isAdminRoute" />
  </div>
</template>
