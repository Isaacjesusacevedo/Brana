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
@import '@/assets/css/components/home-philosophy.css';
</style>
