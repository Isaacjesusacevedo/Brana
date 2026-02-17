<template>
  <section class="section-wrapper philosophy-section">
    <div class="philosophy-decoration-image">
      <img 
        :src="backgroundImage" 
        :alt="title"
        class="philosophy-bg"
      />
    </div>
    <div class="philosophy-content">
      <div class="philosophy-icon">{{ icon }}</div>
      <h2 class="philosophy-title">{{ title }}</h2>
      <p class="philosophy-text">{{ text }}</p>
      <router-link :to="ctaRoute" class="cta-button primary">
        {{ ctaText }}
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  text?: string;
  icon?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaRoute?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'NUESTRA FILOSOFÍA',
  text: 'Fusionamos la sabiduría ancestral del tarot con la estética del futuro. Cada pieza es un símbolo, cada diseño una carta del destino tecnológico.',
  icon: '☿',
  backgroundImage: '/images/logos/toquealoeterno.png',
  ctaText: 'DESCUBRE MÁS',
  ctaRoute: '/filosofia',
});
</script>

<style scoped>
.section-wrapper {
  padding: 8rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.philosophy-section {
  position: relative;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  border-radius: 20px;
  padding: 6rem 4rem;
  overflow: hidden;
}

.philosophy-decoration-image {
  position: absolute;
  top: 50%;
  right: -10%;
  transform: translateY(-50%);
  opacity: 0.1;
  width: 600px;
  height: 600px;
  pointer-events: none;
  animation: philosophyFloat 15s ease-in-out infinite;
}

.philosophy-bg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: blur(2px);
}

@keyframes philosophyFloat {
  0%, 100% {
    transform: translateY(-50%) rotate(0deg);
  }
  50% {
    transform: translateY(-50%) rotate(10deg) scale(1.1);
  }
}

.philosophy-content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.philosophy-icon {
  font-size: 5rem;
  color: var(--gold);
  margin-bottom: 2rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.philosophy-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--gold);
  margin-bottom: 2rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.philosophy-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
}

.cta-button {
  display: inline-block;
  padding: 1.2rem 3rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.4s ease;
}

.cta-button.primary {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
  color: #000;
  border: 2px solid var(--gold);
}

.cta-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(218, 165, 32, 0.4);
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .section-wrapper {
    padding: 5rem 1.5rem;
  }

  .philosophy-section {
    padding: 4rem 3rem;
  }

  .philosophy-decoration-image {
    width: 450px;
    height: 450px;
    right: -15%;
  }

  .philosophy-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
  }

  .philosophy-title {
    font-size: clamp(1.8rem, 3.5vw, 2.5rem);
    margin-bottom: 1.5rem;
  }

  .philosophy-text {
    font-size: 1.1rem;
    margin-bottom: 2.5rem;
  }

  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 0.95rem;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .section-wrapper {
    padding: 4rem 1.5rem;
  }

  .philosophy-section {
    padding: 3rem 1.5rem;
    border-radius: 16px;
  }

  .philosophy-decoration-image {
    right: -40%;
    width: 280px;
    height: 280px;
    opacity: 0.08;
  }

  .philosophy-content {
    max-width: 100%;
  }

  .philosophy-icon {
    font-size: 2.8rem;
    margin-bottom: 1.2rem;
  }

  .philosophy-title {
    font-size: clamp(1.4rem, 6.5vw, 1.8rem);
    letter-spacing: 0.12em;
    margin-bottom: 1.2rem;
  }

  .philosophy-text {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    padding: 0 0.5rem;
  }

  .cta-button {
    width: 100%;
    max-width: 320px;
    padding: 1rem 2rem;
    font-size: 0.9rem;
  }
}

/* Móvil pequeño (<= 375px) */
@media (max-width: 375px) {
  .section-wrapper {
    padding: 2.5rem 0.75rem;
  }

  .philosophy-section {
    padding: 2.5rem 1.2rem;
  }

  .philosophy-decoration-image {
    width: 250px;
    height: 250px;
  }

  .philosophy-icon {
    font-size: 2.5rem;
  }

  .philosophy-title {
    font-size: 1.4rem;
  }

  .philosophy-text {
    font-size: 0.95rem;
  }

  .cta-button {
    max-width: 280px;
    padding: 0.9rem 1.8rem;
  }
}
</style>