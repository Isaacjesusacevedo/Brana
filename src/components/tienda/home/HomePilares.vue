<template>
  <section class="pilares-section">
    <!-- Header -->
    <div class="pilares-header">
      <div class="header-ornament">
        <span class="ornament-line"></span>
        <span class="ornament-symbol">◈</span>
        <span class="ornament-line"></span>
      </div>
      <h2 class="pilares-title">{{ title }}</h2>
      <p class="pilares-subtitle">{{ subtitle }}</p>
    </div>

    <!-- Grid de pilares -->
    <div class="pilares-grid">
      <div
        v-for="(pilar, index) in pilares"
        :key="pilar.id"
        class="pilar-card"
        :class="`pilar-card--${index}`"
      >
        <!-- Número de orden -->
        <span class="pilar-number">0{{ index + 1 }}</span>

        <!-- Icono / Símbolo -->
        <div class="pilar-symbol" :style="{ color: pilar.color }">
          {{ pilar.simbolo }}
        </div>

        <!-- Contenido -->
        <div class="pilar-content">
          <h3 class="pilar-name" :style="{ '--accent': pilar.color }">
            {{ pilar.nombre }}
          </h3>
          <p class="pilar-description">{{ pilar.descripcion }}</p>
        </div>

        <!-- Línea decorativa inferior -->
        <div class="pilar-border" :style="{ background: pilar.color }"></div>

        <!-- Glow de hover -->
        <div class="pilar-glow" :style="{ '--glow-color': pilar.color }"></div>
      </div>
    </div>

    <!-- Frase cierre -->
    <div class="pilares-closing">
      <p class="closing-quote">{{ closingQuote }}</p>
      <div class="closing-ornament">
        <span v-for="n in 5" :key="n" class="closing-dot">◆</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BRAND_PILARES, type BrandPilar } from '@/data/brandPilares';

interface Props {
  title?: string;
  subtitle?: string;
  closingQuote?: string;
  pilares?: BrandPilar[];
}

// BUG-010 corregido: se eliminó `activeIndex` y los handlers @mouseenter/@mouseleave.
// El ref existía y se actualizaba pero nunca se leía en el template.
// Todo el efecto hover funciona enteramente por CSS (:hover en .pilar-card).
withDefaults(defineProps<Props>(), {
  title: 'LOS CUATRO PILARES',
  subtitle: 'El universo simbólico que sostiene cada decisión de diseño.',
  closingQuote:
    'Cada prenda es un símbolo. Cada símbolo, una intención. Cada intención, una transformación.',
  pilares: () => BRAND_PILARES,
});
</script>

<style scoped>
@import '@/assets/css/components/home-pilares.css';
</style>
