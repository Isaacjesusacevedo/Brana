<template>
  <div class="stars-background" aria-hidden="true">
    <div
      v-for="(style, index) in starStyles"
      :key="index"
      class="star"
      :style="style"
    ></div>
  </div>
</template>

<script setup lang="ts">
/**
 * StarBackground.vue — Fondo de partículas/estrellas
 *
 * FIX: la versión anterior llamaba Math.random() dentro de una función
 * usada en el template, lo que provocaba que las posiciones se
 * recalcularan (y las estrellas saltaran) en cada re-render del componente.
 *
 * Solución: pre-computar los estilos en setup() una sola vez con useMemo
 * garantizando que las posiciones son estables durante toda la vida del componente.
 */

import { computed } from 'vue';

interface Props {
  particleCount?: number;
  /** Opacidad base de las estrellas (0-1) */
  opacity?: number;
  /** Habilitar o deshabilitar la animación de parpadeo */
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  particleCount: 80,
  opacity: 0.6,
  animated: true,
});

// ── Estilos pre-computados ─────────────────────────────────────────────────────
// computed() se evalúa una sola vez porque no depende de ningún ref reactivo.
// Las posiciones quedan fijas durante toda la vida del componente.
const starStyles = computed<Record<string, string>[]>(() => {
  return Array.from({ length: props.particleCount }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
    animationDuration: `${(2 + Math.random() * 3).toFixed(2)}s`,
    width: `${(1 + Math.random() * 2).toFixed(1)}px`,
    height: `${(1 + Math.random() * 2).toFixed(1)}px`,
    opacity: props.opacity.toString(),
    animationPlayState: props.animated ? 'running' : 'paused',
  }));
});
</script>

<style scoped>
.stars-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.star {
  position: absolute;
  background: #ffffff;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.3);
  }
}
</style>