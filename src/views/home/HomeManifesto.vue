<template>
    <section class="home-manifesto section">
      <div class="container container-lg">
        <div class="home-manifesto__content">
          <div class="art-deco-frame">
            <!-- Floating Holographic Particles -->
            <div class="holo-particles">
              <div
                v-for="n in 15"
                :key="n"
                class="holo-particle"
                :style="getHoloParticleStyle(n)"
              ></div>
            </div>
  
            <!-- Title -->
            <h2 class="home-manifesto__title">EL_MANIFIESTO</h2>
  
            <!-- Gold Bar -->
            <div class="gold-bar"></div>
  
            <!-- Manifesto Text -->
            <p class="manifesto-text">
              No vendemos ropa. <span class="text-gold-glow">Forjamos identidades</span>.
            </p>
  
            <p class="manifesto-text">
              Cada prenda es un <span class="text-amber-glow">portal dimensional</span>, un ancla
              entre el ahora y lo que viene.
            </p>
  
            <p class="manifesto-text">
              BRANA es <span class="text-gold-glow">hiperstición</span> materializada. El futuro que
              tejemos <span class="text-amber-glow">usando el presente</span>.
            </p>
  
            <!-- Mystic Code -->
            <div class="mystic-code">
              <span class="code-fragment">{{ mysticCode[0] }}</span>
              <span class="code-divider">◆</span>
              <span class="code-fragment">{{ mysticCode[1] }}</span>
              <span class="code-divider">◆</span>
              <span class="code-fragment">{{ mysticCode[2] }}</span>
            </div>
  
            <!-- Luxury Icons -->
            <div class="luxury-icons">
              <div
                v-for="icon in luxuryIcons"
                :key="icon.label"
                class="luxury-icon"
              >
                <div class="icon-symbol">{{ icon.symbol }}</div>
                <span class="icon-label">{{ icon.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface LuxuryIcon {
    symbol: string;
    label: string;
  }
  
  const mysticCode = ref<string[]>(['0xBRANA', '0xETERNAL', '0xFUTURE']);
  
  const luxuryIcons = ref<LuxuryIcon[]>([
    { symbol: '◆', label: 'LUXURY' },
    { symbol: '✦', label: 'ETERNAL' },
    { symbol: '◆', label: 'ARCANE' },
  ]);
  
  function getHoloParticleStyle(index: number): Record<string, string> {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      width: `${2 + Math.random() * 4}px`,
      height: `${2 + Math.random() * 4}px`,
    };
  }
  </script>