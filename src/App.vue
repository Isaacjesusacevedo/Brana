<script setup lang="ts">
import { RouterView } from 'vue-router';
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
</script>

<template>
  <div id="app">
    <!-- Header con banner y navbar -->
    <Header />
    
    <!-- Contenido principal (aquí se renderizan las vistas) -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <Footer />
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