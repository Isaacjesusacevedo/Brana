<template>
  <div class="home-view">
    <!-- ========== GLOBAL EFFECTS ========== -->
    
    <!-- Starfield -->
    <div class="starfield">
      <div
        v-for="i in starCount"
        :key="`star-${i}`"
        class="star"
        :style="getStarStyle(i)"
      ></div>
    </div>

    <!-- Scan Lines -->
    <div class="scan-lines"></div>

    <!-- Matrix Overlay -->
    <div class="matrix-overlay">
      <div class="code-rain"></div>
    </div>

    <!-- ========== SUB-VIEWS ========== -->
    
    <HomeHero />
    <HomePhilosophy />
    <HomeCategories />
    <HomeFeatured />
    <HomeManifesto />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import HomeHero from './HomeHero.vue';
import HomePhilosophy from './HomePhilosophy.vue';
import HomeCategories from './HomeCategories.vue';
import HomeFeatured from './HomeFeatured.vue';
import HomeManifesto from './HomeManifesto.vue';

// Configuration
const starCount = ref<number>(150);

/**
 * Generate random style for each star
 */
function getStarStyle(index: number): Record<string, string> {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
  };
}
</script>

<style scoped>
.home-view {
  position: relative;
  min-height: 100vh;
  background: var(--bg-primary);
  overflow-x: hidden;
}

/* ========== MATRIX OVERLAY ========== */
.matrix-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 3;
  opacity: 0.15;
  overflow: hidden;
}

.code-rain {
  position: absolute;
  top: -100%;
  width: 100%;
  height: 200%;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 20px,
    rgba(212, 175, 55, 0.05) 20px,
    rgba(212, 175, 55, 0.05) 21px
  );
  animation: codeRainFall 20s linear infinite;
}

@keyframes codeRainFall {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(50%);
  }
}
</style>