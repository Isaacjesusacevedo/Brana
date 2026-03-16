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
/* ========================
   SECTION WRAPPER
======================== */
.pilares-section {
  position: relative;
  padding: 8rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  z-index: 1;
}

/* ========================
   HEADER
======================== */
.pilares-header {
  text-align: center;
  margin-bottom: 5rem;
}

.header-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.ornament-line {
  width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold, #daa520), transparent);
}

.ornament-symbol {
  color: var(--gold, #daa520);
  font-size: 1.4rem;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.pilares-title {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 900;
  color: var(--gold, #daa520);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.pilares-subtitle {
  font-size: clamp(0.95rem, 1.5vw, 1.15rem);
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
}

/* ========================
   GRID
======================== */
.pilares-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 5rem;
}

/* ========================
   PILAR CARD
======================== */
.pilar-card {
  position: relative;
  padding: 2.5rem 2rem 2.5rem;
  background: linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.4) 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 4px;
  cursor: default;
  transition: transform 0.4s ease, border-color 0.4s ease;
  overflow: hidden;
}

.pilar-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.15);
}

/* Número de orden */
.pilar-number {
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.12);
  font-family: monospace;
}

/* Símbolo */
.pilar-symbol {
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  transition: transform 0.4s ease, filter 0.4s ease;
  display: block;
  filter: drop-shadow(0 0 8px currentColor);
}

.pilar-card:hover .pilar-symbol {
  transform: scale(1.2) rotate(15deg);
  filter: drop-shadow(0 0 20px currentColor);
}

/* Contenido */
.pilar-content {
  position: relative;
  z-index: 2;
}

.pilar-name {
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent, #daa520);
  margin: 0 0 1rem;
}

.pilar-description {
  font-size: 0.88rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* Línea inferior */
.pilar-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  transition: width 0.5s ease;
  opacity: 0.8;
}

.pilar-card:hover .pilar-border {
  width: 100%;
}

/* Glow */
.pilar-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(
    ellipse at 50% 100%,
    color-mix(in srgb, var(--glow-color, #daa520) 10%, transparent),
    transparent 70%
  );
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.pilar-card:hover .pilar-glow {
  opacity: 1;
}

/* ========================
   CLOSING
======================== */
.pilares-closing {
  text-align: center;
}

.closing-quote {
  font-size: clamp(1rem, 1.8vw, 1.3rem);
  font-style: italic;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.05em;
  line-height: 1.8;
  max-width: 680px;
  margin: 0 auto 2rem;
}

.closing-ornament {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
}

.closing-dot {
  font-size: 0.5rem;
  color: var(--gold, #daa520);
  opacity: 0.4;
}

.closing-dot:nth-child(3) {
  opacity: 1;
  font-size: 0.7rem;
}

/* ========================
   RESPONSIVE — TABLET
======================== */
@media (max-width: 1024px) {
  .pilares-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ========================
   RESPONSIVE — MOBILE
======================== */
@media (max-width: 640px) {
  .pilares-section {
    padding: 5rem 1.5rem;
  }

  .pilares-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .pilar-card {
    padding: 2rem 1.5rem;
  }

  .ornament-line {
    width: 40px;
  }

  .pilares-title {
    letter-spacing: 0.15em;
  }
}
</style>