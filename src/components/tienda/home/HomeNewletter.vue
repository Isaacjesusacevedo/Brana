<template>
  <section class="section-wrapper newsletter-section">
    <!-- Ornamento superior -->
    <div class="newsletter-ornament top">
      <span class="orn-sym">◈</span>
      <span class="orn-line"></span>
      <span class="orn-sym">✦</span>
      <span class="orn-line"></span>
      <span class="orn-sym">◈</span>
    </div>

    <div class="newsletter-content">
      <!-- Eyebrow -->
      <p class="newsletter-eyebrow">{{ eyebrow }}</p>

      <h2 class="newsletter-title">{{ title }}</h2>
      <p class="newsletter-text">{{ description }}</p>

      <!-- Beneficios de la tribu -->
      <ul class="tribu-benefits">
        <li v-for="benefit in benefits" :key="benefit.id" class="benefit-item">
          <span class="benefit-sym">{{ benefit.simbolo }}</span>
          <span class="benefit-text">{{ benefit.texto }}</span>
        </li>
      </ul>

      <!-- Formulario -->
      <form class="newsletter-form" @submit.prevent="handleSubmit">
        <div class="input-wrapper">
          <span class="input-icon">✉</span>
          <input
            type="email"
            v-model="email"
            :placeholder="placeholder"
            class="newsletter-input"
            required
          />
          <button type="submit" class="newsletter-button" :disabled="isSubmitting">
            <span v-if="!isSubmitting">{{ buttonText }}</span>
            <span v-else class="loading-dots">
              <span>·</span><span>·</span><span>·</span>
            </span>
          </button>
        </div>
      </form>

      <!-- Mensaje de respuesta -->
      <p v-if="message" class="form-message" :class="messageType">{{ message }}</p>

      <!-- Nota legal pequeña -->
      <p class="newsletter-note">{{ note }}</p>
    </div>

    <!-- Ornamento inferior -->
    <div class="newsletter-ornament bottom">
      <span class="orn-line long"></span>
      <span class="orn-sym small">◆</span>
      <span class="orn-line long"></span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useNewsletter } from '@/composables/useNewsletter';

interface Benefit {
  id: string;
  simbolo: string;
  texto: string;
}

interface Props {
  eyebrow?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  note?: string;
  benefits?: Benefit[];
}

const props = withDefaults(defineProps<Props>(), {
  eyebrow: 'ACCEDÉ AL ARCANO',
  title: 'UNITE A LA TRIBU',
  description:
    'Cada lanzamiento de Brana comienza 90 días antes del día D. Quienes están en la tribu los ven venir.',
  placeholder: 'TU EMAIL',
  buttonText: 'ACCEDER →',
  note: 'Sin spam. Solo lanzamientos reales, eventos y contenido de la comunidad Brana.',
  benefits: () => [
    { id: '1', simbolo: '◈', texto: 'Preventa exclusiva 48hs antes del lanzamiento oficial' },
    { id: '2', simbolo: '◆', texto: 'Acceso anticipado a teasers de cada colección' },
    { id: '3', simbolo: '✦', texto: 'Descuentos para eventos y activaciones en CABA' },
  ],
});

const emit = defineEmits<{
  submit: [email: string];
}>();

// BUG-007 corregido: useNewsletter tiene try/catch real sobre la llamada a la API.
// El try/catch local anterior envolvía emit() — que es síncrono y nunca propaga
// excepciones del padre — por lo que siempre mostraba éxito aunque la API fallara.
const { email, isSubmitting, message, hasError, subscribe } = useNewsletter();

// messageType derivado del estado real del composable
const messageType = computed(() => (hasError.value ? 'error' : 'success'));

const handleSubmit = async () => {
  if (!email.value) return;

  const submittedEmail = email.value;
  await subscribe();

  // Notificar al padre solo si la suscripción fue exitosa
  if (!hasError.value) {
    emit('submit', submittedEmail);
  }
};
</script>

<style scoped>
@import '@/assets/css/components/home-newsletter.css';
</style>
