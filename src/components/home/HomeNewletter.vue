<template>
  <section class="section-wrapper newsletter-section">
    <div class="newsletter-content">
      <h2 class="newsletter-title">{{ title }}</h2>
      <p class="newsletter-text">{{ description }}</p>
      <form class="newsletter-form" @submit.prevent="handleSubmit">
        <input 
          type="email" 
          v-model="email"
          :placeholder="placeholder" 
          class="newsletter-input"
          required
        />
        <button type="submit" class="newsletter-button" :disabled="isSubmitting">
          {{ isSubmitting ? submitingText : buttonText }}
        </button>
      </form>
      <p v-if="message" class="form-message" :class="messageType">{{ message }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  submitingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ÚNETE AL ARCANO',
  description: 'Sé el primero en conocer nuevas colecciones y ofertas exclusivas',
  placeholder: 'TU EMAIL',
  buttonText: 'SUSCRIBIRSE',
  submitingText: 'ENVIANDO...',
});

const emit = defineEmits<{
  submit: [email: string];
}>();

const email = ref('');
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (!email.value) return;

  isSubmitting.value = true;
  message.value = '';

  try {
    // Emitir el evento al padre
    emit('submit', email.value);

    // Simulación de envío (reemplazar con lógica real)
    await new Promise(resolve => setTimeout(resolve, 1000));

    message.value = '¡Gracias por suscribirte! Revisa tu email.';
    messageType.value = 'success';
    email.value = '';
  } catch (error) {
    message.value = 'Hubo un error. Intenta nuevamente.';
    messageType.value = 'error';
  } finally {
    isSubmitting.value = false;
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => {
      message.value = '';
    }, 5000);
  }
};
</script>

<style scoped>
.section-wrapper {
  padding: 8rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.newsletter-section {
  background: linear-gradient(
    135deg,
    rgba(218, 165, 32, 0.1) 0%,
    rgba(10, 10, 10, 0.5) 100%
  );
  border-radius: 20px;
  padding: 4rem;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--gold);
  margin-bottom: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.newsletter-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(218, 165, 32, 0.3);
  border-radius: 50px;
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.newsletter-input:focus {
  outline: none;
  border-color: var(--gold);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(218, 165, 32, 0.3);
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.newsletter-button {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  border: none;
  border-radius: 50px;
  color: #000;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}

.newsletter-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.4);
}

.newsletter-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-message {
  margin-top: 1.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  animation: fadeIn 0.3s ease;
}

.form-message.success {
  color: #4ade80;
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.form-message.error {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .section-wrapper {
    padding: 5rem 1.5rem;
  }

  .newsletter-section {
    padding: 3rem 2.5rem;
  }

  .newsletter-title {
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
  }

  .newsletter-text {
    font-size: 1.05rem;
  }

  .newsletter-form {
    max-width: 450px;
  }

  .newsletter-input,
  .newsletter-button {
    font-size: 0.95rem;
  }

  .newsletter-button {
    padding: 1rem 2rem;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .section-wrapper {
    padding: 4rem 1.5rem;
  }

  .newsletter-section {
    padding: 2.5rem 1.5rem;
    border-radius: 16px;
  }

  .newsletter-content {
    max-width: 100%;
  }

  .newsletter-title {
    font-size: clamp(1.4rem, 6.5vw, 1.8rem);
    letter-spacing: 0.12em;
    margin-bottom: 0.75rem;
  }

  .newsletter-text {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    padding: 0 0.5rem;
  }

  .newsletter-form {
    flex-direction: column;
    max-width: 100%;
    gap: 0.75rem;
  }

  .newsletter-input {
    padding: 0.9rem 1.2rem;
    font-size: 0.85rem;
  }

  .newsletter-button {
    width: 100%;
    padding: 0.9rem 2rem;
    font-size: 0.85rem;
  }

  .form-message {
    font-size: 0.85rem;
    padding: 0.65rem 1.2rem;
    margin-top: 1.2rem;
  }
}

/* Móvil pequeño (<= 375px) */
@media (max-width: 375px) {
  .section-wrapper {
    padding: 2.5rem 0.75rem;
  }

  .newsletter-section {
    padding: 2rem 1.2rem;
  }

  .newsletter-title {
    font-size: 1.4rem;
  }

  .newsletter-text {
    font-size: 0.95rem;
  }

  .newsletter-input,
  .newsletter-button {
    font-size: 0.85rem;
    padding: 0.85rem 1rem;
  }

  .form-message {
    font-size: 0.85rem;
  }
}
</style>