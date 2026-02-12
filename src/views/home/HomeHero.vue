<template>
    <section class="home-hero">
      <!-- Holographic Circle -->
      <div class="holographic-circle">
        <div class="circle-ring"></div>
        <div class="circle-ring circle-ring--2"></div>
        <div class="circle-ring circle-ring--3"></div>
        <div class="circle-core"></div>
      </div>
  
      <div class="home-hero__content">
        <!-- Logo/Symbol -->
        <div class="home-hero__symbol">
          <svg viewBox="0 0 200 200" class="luxury-emblem">
            <path
              d="M 100 60 L 130 100 L 100 140 L 70 100 Z"
              fill="none"
              stroke="url(#goldGrad)"
              stroke-width="2"
            />
            <circle
              cx="100"
              cy="100"
              r="45"
              fill="none"
              stroke="url(#goldGrad)"
              stroke-width="1.5"
              opacity="0.6"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="url(#goldGrad)"
              stroke-width="1"
              opacity="0.3"
            />
  
            <line x1="100" y1="40" x2="100" y2="55" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
            <line x1="100" y1="145" x2="100" y2="160" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
            <line x1="40" y1="100" x2="55" y2="100" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
            <line x1="145" y1="100" x2="160" y2="100" stroke="#D4AF37" stroke-width="1" opacity="0.5" />
  
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color: #d4af37; stop-opacity: 1" />
                <stop offset="50%" style="stop-color: #ffd700; stop-opacity: 1" />
                <stop offset="100%" style="stop-color: #b8860b; stop-opacity: 1" />
              </linearGradient>
            </defs>
          </svg>
  
          <!-- Digital Code Overlay -->
          <div class="digital-overlay">
            <span v-for="(line, index) in codeLines" :key="`code-${index}`" class="code-line">
              {{ line }}
            </span>
          </div>
        </div>
  
        <!-- Title -->
        <h1 class="home-hero__title text-glitch" data-text="BRANA">BRANA</h1>
  
        <!-- Divider -->
        <div class="home-hero__divider">
          <span class="luxury-diamond">◆</span>
          <div class="gold-line"></div>
          <span class="luxury-star rotate">✦</span>
          <div class="gold-line"></div>
          <span class="luxury-diamond">◆</span>
        </div>
  
        <!-- Subtitle -->
        <p class="home-hero__subtitle">
          HIPERSTICIÓN <span class="text-gold-glow">VESTIBLE</span><br />
          PARA LA <span class="text-amber-glow">GENERACIÓN</span> ETERNA
        </p>
  
        <!-- CTA Button -->
        <BaseButton
          variant="primary"
          size="lg"
          tag="a"
          :arrow="true"
          href="https://www.instagram.com/brana.ok/"
          target="_blank"
          rel="noopener noreferrer"
        >
          EXPLORAR_COLECCIÓN
        </BaseButton>
  
        <!-- Ornament -->
        <div class="home-hero__ornament">
          <div class="pulse-diamond">
            <div class="diamond-glow"></div>
          </div>
        </div>
      </div>
  
      <!-- Particles -->
      <div class="particle-system">
        <div
          v-for="n in particleCount"
          :key="`particle-${n}`"
          class="particle"
          :style="getParticleStyle(n)"
        ></div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  // Configuration
  const particleCount = ref<number>(20);
  const codeUpdateInterval = ref<number>(3000); // 3 seconds
  
  // State
  const codeLines = ref<string[]>([
    'const reality = new Dimension()',
    'hyperstition.manifest()',
    'identity.transcend()',
  ]);
  
  let intervalId: number | null = null;
  
  /**
   * Get random particle style
   */
  function getParticleStyle(index: number): Record<string, string> {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
    };
  }
  
  /**
   * Generate random hex code
   */
   function getRandomCode(): string {
  const codes = ['0x1A2B', '0xDEAD', '0xC0DE', '0xF00D', '0xBEEF', '0xCAFE', '0xBABE'];
  return codes[Math.floor(Math.random() * codes.length)]!;
}
  
  /**
   * Update code lines periodically
   */
  function updateCodeLines(): void {
    codeLines.value = [getRandomCode(), getRandomCode(), getRandomCode()];
  }
  
  // Lifecycle
  onMounted(() => {
    intervalId = window.setInterval(updateCodeLines, codeUpdateInterval.value);
  });
  
  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
  });
  </script>