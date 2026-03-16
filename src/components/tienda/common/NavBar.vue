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
        <RouterLink to="/catalogo" class="menu-link icon-link" title="Catálogo">
          <el-icon :size="22"><ShoppingBag /></el-icon>
        </RouterLink>
        <RouterLink to="/carrito" class="menu-link icon-link cart-link" title="Carrito">
          <el-icon :size="22"><ShoppingTrolley /></el-icon>
          <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
        </RouterLink>
        <RouterLink to="/contacto" class="menu-link icon-link" title="Contacto">
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
            <el-icon :size="20"><Document /></el-icon>
            <span>NOTICIAS</span>
          </RouterLink>
          <RouterLink to="/catalogo" class="mobile-link" @click="mobileMenuOpen = false">
            <el-icon :size="20"><ShoppingBag /></el-icon>
            <span>CATÁLOGO</span>
          </RouterLink>
          <RouterLink to="/carrito" class="mobile-link cart-mobile" @click="mobileMenuOpen = false">
            <el-icon :size="20"><ShoppingTrolley /></el-icon>
            <span>CARRITO</span>
            <span v-if="cartItemsCount > 0" class="cart-badge-mobile">{{ cartItemsCount }}</span>
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
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { ShoppingBag, Message, Expand, Fold, ShoppingTrolley, Document } from '@element-plus/icons-vue';
// ✅ DESPUÉS
import { useCartStore } from '@/stores/useCartStore'

const cartStore      = useCartStore()
const cartItemsCount = computed(() => cartStore.totalItems)

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
@import '@/assets/css/components/navbar.css';
</style>
