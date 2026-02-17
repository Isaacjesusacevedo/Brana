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
        <a :href="primaryCta.route" target="_blank" rel="noopener noreferrer" class="cta-button primary">
          {{ primaryCta.text }} →
        </a>
        <router-link :to="secondaryCta.route" class="cta-button secondary">
          {{ secondaryCta.text }}
        </router-link>
      </div>
    </div>

    <!-- Símbolos flotantes adicionales -->
    <div class="floating-symbols">
      <span v-for="n in 12" :key="n" class="symbol" :style="getSymbolStyle(n)">✦</span>
    </div>
  </section>
</template>

<script setup lang="ts">
interface CtaButton {
  text: string;
  route: string;
}

interface Props {
  title?: string;
  subtitle?: string;
  primaryCta?: CtaButton;
  secondaryCta?: CtaButton;
}

withDefaults(defineProps<Props>(), {
  title: 'BRANA',
  subtitle: 'HIPERSTICIÓN <span class="highlight">VESTIBLE</span><br />PARA LA <span class="highlight">GENERACIÓN</span> ETERNA.',
  primaryCta: () => ({ text: 'EXPLORAR_COLECCIÓN', route: 'https://www.instagram.com/brana_eg/' }),
  secondaryCta: () => ({ text: 'NUESTRA FILOSOFÍA', route: '/filosofia' }),
});

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
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 2rem 4rem;
  overflow: hidden;
}

/* Símbolo de Agujero Negro */
.black-hole-symbol {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  animation: blackHoleFloat 6s ease-in-out infinite;
}

@keyframes blackHoleFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-20px); }
}

.black-hole-core {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.event-horizon {
  position: absolute;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, #000 0%, transparent 70%);
  border-radius: 50%;
  animation: horizonPulse 3s ease-in-out infinite;
}

@keyframes horizonPulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.accretion-disk {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    rgba(218, 165, 32, 0.3) 25%,
    rgba(255, 215, 0, 0.4) 50%,
    rgba(218, 165, 32, 0.3) 75%,
    transparent 100%
  );
  animation: diskRotate 8s linear infinite;
  filter: blur(8px);
}

.accretion-disk::before {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  background: conic-gradient(
    from 180deg,
    transparent 0%,
    rgba(255, 215, 0, 0.2) 25%,
    rgba(218, 165, 32, 0.3) 50%,
    rgba(255, 215, 0, 0.2) 75%,
    transparent 100%
  );
  animation: diskRotate 6s linear infinite reverse;
  filter: blur(4px);
}

@keyframes diskRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.diamond-symbol {
  position: relative;
  z-index: 2;
  font-size: 3rem;
  color: var(--gold);
  text-shadow: 
    0 0 20px rgba(218, 165, 32, 0.8),
    0 0 40px rgba(218, 165, 32, 0.4);
  animation: symbolGlow 2s ease-in-out infinite;
}

@keyframes symbolGlow {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Hero Content */
.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 900px;
  margin-top: 12rem;
}

.hero-title {
  font-size: clamp(4rem, 10vw, 8rem);
  font-weight: 900;
  color: var(--gold);
  margin: 0 0 2rem 0;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-shadow: 
    0 0 30px rgba(218, 165, 32, 0.5),
    0 0 60px rgba(218, 165, 32, 0.3);
  animation: titlePulse 3s ease-in-out infinite;
}

@keyframes titlePulse {
  0%, 100% { text-shadow: 0 0 30px rgba(218, 165, 32, 0.5), 0 0 60px rgba(218, 165, 32, 0.3); }
  50% { text-shadow: 0 0 40px rgba(218, 165, 32, 0.8), 0 0 80px rgba(218, 165, 32, 0.4); }
}

.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
}

.divider-icon {
  color: var(--gold);
  font-size: 1.5rem;
}

.divider-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.hero-subtitle {
  font-size: clamp(1.2rem, 2.5vw, 1.8rem);
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 3rem 0;
  font-weight: 300;
  letter-spacing: 0.1em;
}

:deep(.highlight) {
  color: var(--gold);
  font-weight: 700;
}

.hero-cta {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 1.2rem 3rem;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-decoration: none;
  border-radius: 50px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
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

.cta-button.secondary {
  background: transparent;
  color: var(--gold);
  border: 2px solid var(--gold);
}

.cta-button.secondary:hover {
  background: rgba(218, 165, 32, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(218, 165, 32, 0.3);
}

/* Símbolos flotantes */
.floating-symbols {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.symbol {
  position: absolute;
  color: var(--gold);
  opacity: 0.4;
  animation: symbolFloat 8s ease-in-out infinite;
}

@keyframes symbolFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.4;
  }
  50% {
    transform: translateY(-40px) rotate(180deg);
    opacity: 0.7;
  }
}

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .hero-section {
    padding: 6rem 1.5rem 3rem;
  }

  .black-hole-symbol {
    top: 12%;
  }

  .black-hole-core {
    width: 180px;
    height: 180px;
  }

  .event-horizon {
    width: 100px;
    height: 100px;
  }

  .accretion-disk,
  .accretion-disk::before {
    width: 180px;
    height: 180px;
  }

  .diamond-symbol {
    font-size: 2.5rem;
  }

  .hero-content {
    margin-top: 10rem;
    padding: 0 1rem;
  }

  .hero-title {
    font-size: clamp(3rem, 8vw, 6rem);
    letter-spacing: 0.2em;
  }

  .hero-subtitle {
    font-size: clamp(1.1rem, 2.2vw, 1.5rem);
  }

  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 0.95rem;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .hero-section {
    min-height: 75vh;
    padding: 3rem 1.5rem 2rem;
  }

  .black-hole-symbol {
    top: 5%;
    margin-bottom: 1.5rem;
  }

  .black-hole-core {
    width: 100px;
    height: 100px;
  }

  .event-horizon {
    width: 60px;
    height: 60px;
  }

  .accretion-disk,
  .accretion-disk::before {
    width: 100px;
    height: 100px;
  }

  .diamond-symbol {
    font-size: 1.5rem;
  }

  .hero-content {
    margin-top: 5rem;
    padding: 0;
  }

  .hero-title {
    font-size: clamp(2rem, 10vw, 2.8rem);
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .hero-divider {
    gap: 0.5rem;
    margin: 1.5rem 0;
  }

  .divider-icon {
    font-size: 1.2rem;
  }

  .divider-line {
    width: 40px;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 4vw, 1.2rem);
    line-height: 1.6;
    margin-bottom: 2rem;
    letter-spacing: 0.05em;
  }

  .hero-cta {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .cta-button {
    width: 100%;
    max-width: 320px;
    padding: 1rem 2rem;
    font-size: 0.9rem;
    letter-spacing: 0.1em;
  }

  .floating-symbols .symbol {
    font-size: 0.8rem;
  }
}

/* Móvil pequeño (<= 375px) */
@media (max-width: 375px) {
  .hero-section {
    padding: 3rem 0.75rem 1.5rem;
  }

  .black-hole-core {
    width: 100px;
    height: 100px;
  }

  .event-horizon {
    width: 60px;
    height: 60px;
  }

  .accretion-disk,
  .accretion-disk::before {
    width: 100px;
    height: 100px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .cta-button {
    max-width: 280px;
    padding: 0.9rem 1.5rem;
  }
}
</style>