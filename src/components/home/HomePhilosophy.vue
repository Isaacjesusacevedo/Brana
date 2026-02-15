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

@media (max-width: 768px) {
  .section-wrapper {
    padding: 4rem 1rem;
  }

  .philosophy-section {
    padding: 4rem 2rem;
  }

  .philosophy-decoration-image {
    right: -30%;
    width: 400px;
    height: 400px;
  }
}
</style>