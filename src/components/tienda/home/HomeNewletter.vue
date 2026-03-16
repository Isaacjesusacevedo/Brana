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
/* ========================
   SECTION
======================== */
.section-wrapper {
  padding: 6rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.newsletter-section {
  text-align: center;
}

/* ========================
   ORNAMENTOS
======================== */
.newsletter-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.newsletter-ornament.bottom {
  margin-top: 3rem;
  margin-bottom: 0;
}

.orn-sym {
  color: var(--gold, #daa520);
  font-size: 1rem;
  opacity: 0.5;
}

.orn-sym.small {
  font-size: 0.5rem;
}

.orn-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(218, 165, 32, 0.3), transparent);
}

.orn-line.long {
  width: 120px;
}

/* ========================
   CONTENIDO
======================== */
.newsletter-content {
  max-width: 620px;
  margin: 0 auto;
}

.newsletter-eyebrow {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5em;
  color: var(--gold, #daa520);
  text-transform: uppercase;
  margin: 0 0 1rem;
  opacity: 0.8;
}

.newsletter-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 1.2rem;
  line-height: 1.1;
}

.newsletter-text {
  font-size: clamp(0.95rem, 1.4vw, 1.05rem);
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  margin: 0 0 2.5rem;
}

/* ========================
   BENEFICIOS
======================== */
.tribu-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  text-align: left;
  max-width: 440px;
  margin-left: auto;
  margin-right: auto;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.benefit-sym {
  color: var(--gold, #daa520);
  font-size: 0.7rem;
  opacity: 0.8;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.benefit-text {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

/* ========================
   FORMULARIO
======================== */
.newsletter-form {
  margin-bottom: 1rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(218, 165, 32, 0.2);
  border-radius: 2px;
  overflow: hidden;
  transition: border-color 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: rgba(218, 165, 32, 0.6);
}

.input-icon {
  padding: 0 1rem;
  color: rgba(218, 165, 32, 0.4);
  font-size: 0.9rem;
  flex-shrink: 0;
}

.newsletter-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 1.1rem 0.5rem;
  color: #fff;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.2em;
}

.newsletter-button {
  background: linear-gradient(135deg, var(--gold, #daa520), #f5c842);
  color: #000;
  border: none;
  padding: 1.1rem 1.8rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.3s ease;
}

.newsletter-button:hover:not(:disabled) {
  opacity: 0.9;
}

.newsletter-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading dots */
.loading-dots {
  display: flex;
  gap: 2px;
}

.loading-dots span {
  animation: dotBlink 1.2s ease-in-out infinite;
  font-size: 1.2rem;
  line-height: 1;
}

.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotBlink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}

/* ========================
   FEEDBACK
======================== */
.form-message {
  margin-top: 1rem;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
}

.form-message.success {
  color: var(--gold, #daa520);
}

.form-message.error {
  color: #dc2626;
}

.newsletter-note {
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.2);
  margin: 0.8rem 0 0;
}

/* ========================
   MOBILE
======================== */
@media (max-width: 640px) {
  .section-wrapper {
    padding: 4rem 1.5rem;
  }

  .input-wrapper {
    flex-direction: column;
    border-radius: 4px;
  }

  .input-icon {
    display: none;
  }

  .newsletter-input {
    padding: 1.1rem 1.5rem;
    width: 100%;
    border-bottom: 1px solid rgba(218, 165, 32, 0.1);
    text-align: center;
  }

  .newsletter-button {
    width: 100%;
    padding: 1.1rem;
  }

  .tribu-benefits {
    max-width: 100%;
  }
}
</style>