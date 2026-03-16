<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/useAdminStore'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

function logout() {
  adminStore.logout()
  router.push({ name: 'admin-login' })
}

function isActive(routeName: string) {
  return route.name === routeName
}
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="logo-text">BRANA</span>
        <span class="logo-badge">ADMIN</span>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
          :to="{ name: 'admin-dashboard' }"
          class="nav-item"
          :class="{ active: isActive('admin-dashboard') }"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Dashboard
        </RouterLink>

        <RouterLink
          :to="{ name: 'admin-productos' }"
          class="nav-item"
          :class="{ active: isActive('admin-productos') }"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Productos
        </RouterLink>

        <RouterLink
          :to="{ name: 'admin-pedidos' }"
          class="nav-item"
          :class="{ active: isActive('admin-pedidos') }"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Pedidos
        </RouterLink>

        <RouterLink
          :to="{ name: 'admin-usuarios' }"
          class="nav-item"
          :class="{ active: isActive('admin-usuarios') }"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Usuarios
        </RouterLink>
      </nav>

      <button class="logout-btn" @click="logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Cerrar sesión
      </button>
    </aside>

    <!-- Contenido principal -->
    <div class="admin-main">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/css/layout/admin-layout.css';
</style>
