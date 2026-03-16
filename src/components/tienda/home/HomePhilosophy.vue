<template>
  <section class="section-wrapper philosophy-section">
    <!-- Imagen decorativa de fondo -->
    <div class="philosophy-decoration-image">
      <img
        :src="backgroundImage"
        :alt="title"
        class="philosophy-bg"
      />
    </div>

    <!-- Contenido principal -->
    <div class="philosophy-content">
      <!-- Etiqueta superior -->
      <div class="philosophy-eyebrow">
        <span class="eyebrow-icon">{{ icon }}</span>
        <span class="eyebrow-line"></span>
        <span class="eyebrow-text">MANIFIESTO</span>
        <span class="eyebrow-line"></span>
      </div>

      <h2 class="philosophy-title">{{ title }}</h2>

      <!-- Cita principal del manifiesto -->
      <blockquote class="philosophy-quote">
        <p class="quote-text">{{ quoteText }}</p>
        <cite class="quote-source">— Filosofía Brana</cite>
      </blockquote>

      <!-- Texto expandido -->
      <p class="philosophy-text">{{ text }}</p>

      <!-- Mención de los 4 pilares -->
      <div class="philosophy-pilares-hint">
        <span
          v-for="pilar in pilares"
          :key="pilar.simbolo"
          class="pilar-hint"
        >
          <span class="pilar-hint-sym">{{ pilar.simbolo }}</span>
          <span class="pilar-hint-name">{{ pilar.nombre }}</span>
        </span>
      </div>

      <router-link :to="ctaRoute" class="cta-button primary">
        {{ ctaText }}
      </router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BRAND_PILARES, type PilarHint } from '@/data/brandPilares';

interface Props {
  title?: string;
  text?: string;
  quoteText?: string;
  icon?: string;
  backgroundImage?: string;
  ctaText?: string;
  ctaRoute?: string;
  pilares?: PilarHint[];
}

withDefaults(defineProps<Props>(), {
  title: 'NUESTRA FILOSOFÍA',
  quoteText:
    'Fusionamos la sabiduría ancestral del tarot con la estética del futuro. Cada pieza es un símbolo, cada diseño una carta del destino tecnológico.',
  text: 'Brana parte de una premisa: la ropa puede ser un vehículo de transformación simbólica. Inspirada en la noción de hiperstición —la idea de que la ficción se vuelve real a través de la acción colectiva— cada prenda no solo cubre el cuerpo sino que activa algo en quien la usa.',
  icon: '☿',
  backgroundImage: '/images/logos/toquealoeterno.png',
  ctaText: 'LEER EL MANIFIESTO COMPLETO',
  ctaRoute: '/filosofia',
  // PilarHint = Pick<BrandPilar, 'simbolo' | 'nombre'> — BRAND_PILARES es compatible
  pilares: () => BRAND_PILARES,
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
  border-radius: 4px;
  padding: 6rem 4rem;
  overflow: hidden;
  border: 1px solid rgba(218, 165, 32, 0.08);
}

/* Imagen de fondo */
.philosophy-decoration-image {
  position: absolute;
  top: 50%;
  right: -5%;
  transform: translateY(-50%);
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.philosophy-bg {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.07;
  filter: grayscale(100%) sepia(100%) hue-rotate(30deg) saturate(2);
}

/* Contenido */
.philosophy-content {
  position: relative;
  z-index: 2;
  max-width: 640px;
}

/* Eyebrow */
.philosophy-eyebrow {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.eyebrow-icon {
  color: var(--gold, #daa520);
  font-size: 1.3rem;
}

.eyebrow-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, var(--gold, #daa520), transparent);
}

.eyebrow-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
}

/* Título */
.philosophy-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: var(--gold, #daa520);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0 0 2.5rem;
  line-height: 1.2;
}

/* Cita */
.philosophy-quote {
  margin: 0 0 2rem;
  padding: 1.8rem 2rem;
  border-left: 3px solid var(--gold, #daa520);
  background: rgba(218, 165, 32, 0.04);
}

.quote-text {
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.8;
  margin: 0 0 0.8rem;
}

.quote-source {
  font-size: 0.7rem;
  font-style: normal;
  letter-spacing: 0.25em;
  color: var(--gold, #daa520);
  opacity: 0.7;
  text-transform: uppercase;
}

/* Texto expandido */
.philosophy-text {
  font-size: clamp(0.9rem, 1.3vw, 1rem);
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 2.5rem;
}

/* Pilares hint */
.philosophy-pilares-hint {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.pilar-hint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pilar-hint-sym {
  font-size: 0.9rem;
  color: var(--gold, #daa520);
  opacity: 0.7;
}

.pilar-hint-name {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: rgba(255, 255, 255, 0.3);
  text-transform: uppercase;
}

/* CTA */
.cta-button.primary {
  display: inline-flex;
  align-items: center;
  padding: 1.1rem 2.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-decoration: none;
  border-radius: 2px;
  color: #000;
  background: linear-gradient(135deg, var(--gold, #daa520), #f5c842);
  border: 2px solid var(--gold, #daa520);
  transition: all 0.3s ease;
}

.cta-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.3);
}

/* Tablet */
@media (max-width: 1024px) {
  .philosophy-section {
    padding: 5rem 3rem;
  }

  .philosophy-decoration-image {
    width: 40%;
    opacity: 0.05;
  }
}

/* Mobile */
@media (max-width: 640px) {
  .section-wrapper {
    padding: 3rem 1rem;
  }

  .philosophy-section {
    padding: 3.5rem 1.5rem;
    border-radius: 4px;
  }

  .philosophy-decoration-image {
    display: none;
  }

  .philosophy-pilares-hint {
    gap: 1rem;
  }

  .philosophy-quote {
    padding: 1.2rem 1.5rem;
  }
}
</style>