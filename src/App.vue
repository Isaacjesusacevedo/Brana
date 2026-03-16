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

<style>
/* Reset y estilos globales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #000;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Espacio para el header fijo */
.main-content {
  flex: 1;
  padding-top: 140px; /* Altura del header + banner */
  min-height: calc(100vh - 140px);
}

/* Admin: sin padding-top, ocupa todo el viewport */
.admin-app {
  background: #0f0f0f;
}

.admin-content {
  flex: 1;
  padding-top: 0;
  min-height: 100vh;
}

/* Variables globales */
:root {
  --gold: #DAA520;
  --gold-light: #FFD700;
  --bg-dark: #0a0a0a;
  --bg-darker: #050505;
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-darker);
}

::-webkit-scrollbar-thumb {
  background: var(--gold);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gold-light);
}
</style>