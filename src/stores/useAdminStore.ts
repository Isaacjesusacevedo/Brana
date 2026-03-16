import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const TOKEN_KEY = 'brana_admin_token'

export const useAdminStore = defineStore('admin', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  function logout() {
    token.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return { token, isAuthenticated, setToken, logout }
})
