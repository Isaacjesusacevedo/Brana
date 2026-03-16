<template>
  <section class="hero-section">
    <!-- Símbolo de Agujero Negro -->
    <div class="black-hole-symbol">
      <div class="black-hole-core">
        <div class="event-horizon"></div>
        <div class="accretion-disk"></div>
        <div class="diamond-symbol">◈</div>
      </div>
    </div>

    <div class="hero-content">
      <h1 class="hero-title">{{ title }}</h1>
      <div class="hero-divider">
        <span class="divider-icon">◆</span>
        <span class="divider-line"></span>
        <span class="divider-icon">★</span>
        <span class="divider-line"></span>
        <span class="divider-icon">◆</span>
      </div>
      <p class="hero-subtitle" v-html="subtitle"></p>
      <div class="hero-cta">
        <!-- primaryCta: isExternal detecta http://, href presente, o type='external' -->
        <a
          v-if="isExternal(primaryCta)"
          :href="getHref(primaryCta)"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-button primary"
        >
          {{ primaryCta.text }} →
        </a>
        <RouterLink
          v-else
          :to="getRoute(primaryCta)"
          class="cta-button primary"
        >
          {{ primaryCta.text }} →
        </RouterLink>

        <!-- secondaryCta: mismo patrón -->
        <a
          v-if="isExternal(secondaryCta)"
          :href="getHref(secondaryCta)"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-button secondary"
        >
          {{ secondaryCta.text }}
        </a>
        <RouterLink
          v-else
          :to="getRoute(secondaryCta)"
          class="cta-button secondary"
        >
          {{ secondaryCta.text }}
        </RouterLink>
      </div>
    </div>

    <!-- Símbolos flotantes adicionales -->
    <div class="floating-symbols">
      <span v-for="n in 12" :key="n" class="symbol" :style="getSymbolStyle(n)">✦</span>
    </div>
  </section>
</template>

<script setup lang="ts">
// BUG-013 corregido: tipo flexible que acepta tanto la forma nueva (type + href/route)
// como la forma legacy que HomeView puede estar pasando ({ text, route/href sin type }).
interface CtaButton {
  text: string;
  type?: 'external' | 'internal';
  href?: string;   // URL externa
  route?: string;  // ruta Vue Router (puede ser también una URL externa legacy)
}

interface Props {
  title?: string;
  subtitle?: string;
  primaryCta?: CtaButton;
  secondaryCta?: CtaButton;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'BRANA',
  subtitle: 'HIPERSTICIÓN <span class="highlight">VESTIBLE</span><br />PARA LA <span class="highlight">GENERACIÓN</span> ETERNA.',
  primaryCta: () => ({ type: 'external' as const, text: 'EXPLORAR_COLECCIÓN', href: 'https://www.instagram.com/brana_eg/' }),
  secondaryCta: () => ({ type: 'internal' as const, text: 'NUESTRA FILOSOFÍA', route: '/filosofia' }),
});

// Detecta si un CTA es externo:
// 1. type === 'external' explícito, o
// 2. href presente (forma nueva), o
// 3. route empieza con http/https (forma legacy de HomeView)
const isExternal = (cta: CtaButton): boolean =>
  cta.type === 'external' ||
  !!cta.href ||
  (!!cta.route && /^https?:\/\//.test(cta.route));

// Devuelve la URL real sea cual sea la forma del objeto
const getHref = (cta: CtaButton): string => cta.href ?? cta.route ?? '/';
const getRoute = (cta: CtaButton): string => cta.route ?? '/';

const getSymbolStyle = (n: number) => {
  const positions = [
    { top: '15%', left: '10%', animationDelay: '0s' },
    { top: '25%', right: '15%', animationDelay: '1s' },
    { top: '45%', left: '8%', animationDelay: '2s' },
    { top: '60%', right: '12%', animationDelay: '3s' },
    { top: '75%', left: '18%', animationDelay: '1.5s' },
    { top: '35%', right: '25%', animationDelay: '2.5s' },
    { top: '80%', right: '20%', animationDelay: '0.5s' },
    { top: '20%', left: '30%', animationDelay: '3.5s' },
    { top: '50%', left: '25%', animationDelay: '1.8s' },
    { top: '65%', right: '30%', animationDelay: '2.2s' },
    { top: '40%', left: '15%', animationDelay: '3.2s' },
    { top: '55%', right: '18%', animationDelay: '0.8s' },
  ];

  return positions[n - 1] || positions[0];
};
</script>

<style scoped>
@import '@/assets/css/components/home-hero.css';
</style>
