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
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
}

/* ── Sidebar ────────────────────────────────────────────── */
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #111;
  border-right: 1px solid #1e1e1e;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-logo {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 0 8px 28px;
  border-bottom: 1px solid #1e1e1e;
  margin-bottom: 24px;
}

.logo-text {
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 5px;
  color: #DAA520;
}

.logo-badge {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #555;
  border: 1px solid #2a2a2a;
  padding: 2px 6px;
  border-radius: 4px;
}

/* ── Nav items ──────────────────────────────────────────── */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 8px;
  color: #777;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}

.nav-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.nav-item:hover {
  background: #1a1a1a;
  color: #ccc;
}

.nav-item.active {
  background: rgba(218, 165, 32, 0.1);
  color: #DAA520;
}

/* ── Logout ─────────────────────────────────────────────── */
.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 8px;
  color: #555;
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background 0.15s, color 0.15s;
  margin-top: 8px;
}

.logout-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #f87171;
}

/* ── Main content ───────────────────────────────────────── */
.admin-main {
  flex: 1;
  margin-left: 240px;
  padding: 32px;
  min-height: 100vh;
  background: #0a0a0a;
}
</style>
