<template>
  <header :class="['navbar', { 'scrolled': isScrolled }]">
    <!-- Línea esotérica superior -->
    <div class="esoteric-line"></div>

    <!-- Mensajes rotativos -->
    <div class="rotating-messages">
      <p class="message-text">
        {{ hyperstitionMessages[currentMessage] }}
      </p>
    </div>

    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <RouterLink to="/" class="logo-link">
          <div class="logo-image-wrapper">
            <img 
              src="@/assets/images/logos/logobrana.png" 
              alt="Logo Brana" 
              class="logo-infinity"
            />
          </div>
          <span class="logo-text">BRANA</span>
        </RouterLink>
      </div>

      <!-- Menú Desktop -->
      <nav class="menu desktop-menu">
        <RouterLink to="/noticias" class="menu-link">NOTICIAS</RouterLink>
        <RouterLink to="/catalogo" class="menu-link icon-link">
          <el-icon :size="22"><ShoppingBag /></el-icon>
        </RouterLink>
        <RouterLink to="/contacto" class="menu-link icon-link">
          <el-icon :size="22"><Message /></el-icon>
        </RouterLink>
      </nav>

      <!-- Botón menú móvil -->
      <button class="mobile-menu-toggle" @click="mobileMenuOpen = !mobileMenuOpen">
        <el-icon :size="24" v-if="!mobileMenuOpen"><Expand /></el-icon>
        <el-icon :size="24" v-else><Fold /></el-icon>
      </button>
    </div>

    <!-- Línea esotérica inferior -->
    <div class="esoteric-line"></div>

    <!-- Menú móvil -->
    <transition name="mobile-fade">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <nav class="mobile-nav">
          <RouterLink to="/noticias" class="mobile-link" @click="mobileMenuOpen = false">
            NOTICIAS
          </RouterLink>
          <RouterLink to="/catalogo" class="mobile-link" @click="mobileMenuOpen = false">
            <el-icon :size="20"><ShoppingBag /></el-icon>
            <span>CATÁLOGO</span>
          </RouterLink>
          <RouterLink to="/contacto" class="mobile-link" @click="mobileMenuOpen = false">
            <el-icon :size="20"><Message /></el-icon>
            <span>CONTACTO</span>
          </RouterLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ShoppingBag, Message, Expand, Fold } from '@element-plus/icons-vue';

const currentMessage = ref(0);
const isScrolled = ref(false);
const mobileMenuOpen = ref(false);

const hyperstitionMessages = [
  "HYPERSTITION CLUB",
  "THE ETERNAL GENERATION",
  "WE ARE HYPERSTITION MADE REAL"
];

let messageInterval: ReturnType<typeof setInterval> | null = null;
let scrollHandler: (() => void) | null = null;

onMounted(() => {
  // Rotating messages
  messageInterval = setInterval(() => {
    currentMessage.value = (currentMessage.value + 1) % hyperstitionMessages.length;
  }, 3000);

  // Scroll handler
  scrollHandler = () => {
    isScrolled.value = window.scrollY > 50;
  };
  window.addEventListener('scroll', scrollHandler);
});

onUnmounted(() => {
  if (messageInterval) clearInterval(messageInterval);
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
});
</script>

<style scoped>
/* Variables */
:root {
  --navbar-bg: rgba(10, 10, 10, 0.95);
  --gold: #DAA520;
}

/* Navbar principal */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--navbar-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(218, 165, 32, 0.2);
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(0, 0, 0, 0.98);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  border-bottom-color: rgba(218, 165, 32, 0.4);
}

/* Línea esotérica */
.esoteric-line {
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--gold) 50%,
    transparent
  );
  opacity: 0.3;
}

/* Mensajes rotativos */
.rotating-messages {
  padding: 0.5rem;
  text-align: center;
  background: rgba(218, 165, 32, 0.1);
  overflow: hidden;
}

.message-text {
  margin: 0;
  font-size: 0.75rem;
  color: var(--gold);
  letter-spacing: 0.2em;
  font-weight: 600;
  text-transform: uppercase;
  animation: messagePulse 3s ease-in-out infinite;
}

@keyframes messagePulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* Container principal */
.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo-link:hover {
  transform: translateY(-2px);
}

.logo-image-wrapper {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo-infinity {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 0 15px rgba(218, 165, 32, 0.6));
  animation: logoRotate 8s linear infinite;
  transition: all 0.3s ease;
}

@keyframes logoRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.logo-link:hover .logo-infinity {
  filter: drop-shadow(0 0 25px rgba(218, 165, 32, 0.9));
  animation-duration: 4s;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--gold);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(218, 165, 32, 0.5);
}

/* Menú Desktop */
.desktop-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.menu-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  position: relative;
}

.menu-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--gold);
  transition: width 0.3s ease;
}

.menu-link:hover {
  color: var(--gold);
}

.menu-link:hover::after {
  width: 80%;
}

.icon-link {
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.icon-link:hover {
  background: rgba(218, 165, 32, 0.1);
  transform: scale(1.1);
}

/* Menú móvil toggle */
.mobile-menu-toggle {
  display: none;
  background: transparent;
  border: 2px solid var(--gold);
  color: var(--gold);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover {
  background: rgba(218, 165, 32, 0.1);
  transform: scale(1.05);
}

/* Menú móvil */
.mobile-menu {
  background: rgba(10, 10, 10, 0.98);
  border-top: 1px solid rgba(218, 165, 32, 0.2);
  padding: 1rem 0;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 2rem;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.1em;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.mobile-link:hover {
  background: rgba(218, 165, 32, 0.1);
  color: var(--gold);
  transform: translateX(5px);
}

/* Transiciones */
.mobile-fade-enter-active,
.mobile-fade-leave-active {
  transition: all 0.3s ease;
}

.mobile-fade-enter-from,
.mobile-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }

  .mobile-menu-toggle {
    display: block;
  }

  .navbar-container {
    padding: 0.75rem 1rem;
  }

  .logo-text {
    font-size: 1.2rem;
    letter-spacing: 0.2em;
  }

  .logo-image-wrapper {
    width: 40px;
    height: 40px;
  }

  .rotating-messages {
    padding: 0.4rem;
  }

  .message-text {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }

  .logo-image-wrapper {
    width: 45px;
    height: 45px;
  }
}
</style>