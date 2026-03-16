// src/composables/useNewsletter.ts
import { ref } from 'vue'
// import { newsletterApi } from '@/services/api' // descomentar cuando esté listo

export function useNewsletter() {
  const email        = ref('')
  const isSubmitting = ref(false)
  const message      = ref('')
  const hasError     = ref(false)

  const subscribe = async (emailInput?: string) => {
    const target = emailInput ?? email.value
    if (!target) return

    isSubmitting.value = true
    hasError.value     = false

    try {
      // await newsletterApi.subscribe(target) // TODO: descomentar con endpoint real
      await new Promise(r => setTimeout(r, 600))  // simula latencia
      message.value = '✓ ¡Bienvenida a la tribu!'
      email.value   = ''
    } catch {
      message.value = 'Hubo un problema. Intentá de nuevo.'
      hasError.value = true
    } finally {
      isSubmitting.value = false
      setTimeout(() => { message.value = '' }, 4000)
    }
  }

  return { email, isSubmitting, message, hasError, subscribe }
}