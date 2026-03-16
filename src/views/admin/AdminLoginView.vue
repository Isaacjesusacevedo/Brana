<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/useAdminStore'

const router = useRouter()
const adminStore = useAdminStore()

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080/api'

const form = ref({ username: '', password: '' })
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
      error.value = json.errors?.[0] ?? json.message ?? 'Credenciales incorrectas.'
      return
    }

    const token: string = json.data?.token ?? json.token
    if (!token) {
      error.value = 'El servidor no devolvió un token válido.'
      return
    }

    adminStore.setToken(token)
    router.push({ name: 'admin-dashboard' })
  } catch {
    error.value = 'No se pudo conectar con el servidor. Verificá tu conexión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Logo -->
      <div class="login-logo">
        <span class="logo-text">BRANA</span>
        <span class="logo-sub">ADMIN</span>
      </div>

      <h1 class="login-title">Panel de Administración</h1>
      <p class="login-subtitle">Ingresá con tus credenciales de administrador</p>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Usuario</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="admin"
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="error-msg" role="alert">
          {{ error }}
        </div>

        <button type="submit" class="login-btn" :disabled="loading">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  padding: 24px;
}

.login-card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 12px;
  padding: 48px 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
}

.login-logo {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 32px;
  justify-content: center;
}

.logo-text {
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 6px;
  color: #DAA520;
}

.logo-sub {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 4px;
  color: #666;
  border: 1px solid #333;
  padding: 2px 8px;
  border-radius: 4px;
}

.login-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin-bottom: 36px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #aaa;
  letter-spacing: 0.5px;
}

.form-group input {
  background: #0a0a0a;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
}

.form-group input::placeholder {
  color: #444;
}

.form-group input:focus {
  border-color: #DAA520;
}

.error-msg {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
  color: #f87171;
  font-size: 13px;
}

.login-btn {
  background: #DAA520;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 4px;
}

.login-btn:hover:not(:disabled) {
  background: #FFD700;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
