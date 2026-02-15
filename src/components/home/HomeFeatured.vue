<template>
  <section class="section-wrapper featured-section">
    <div class="section-header">
      <h2 class="section-title">{{ title }}</h2>
      <router-link :to="viewAllRoute" class="section-link">
        {{ viewAllText }} <span class="arrow">→</span>
      </router-link>
    </div>
    
    <BaseCarousel
      :items="items"
      mode="circular"
      variant="hero"
      :autoRotate="autoRotate"
      :rotationInterval="rotationInterval"
      :centerText="centerText"
      @itemClick="handleItemClick"
    >
      <template #item="{ item, isActive }">
        <div class="featured-card" :class="{ active: isActive }">
          <div class="card-inner">
            <img :src="item.imagen" :alt="item.titulo" class="featured-image" />
            <div class="featured-overlay">
              <div class="overlay-content">
                <span class="featured-category">{{ item.categoria }}</span>
                <h3 class="featured-title">{{ item.titulo }}</h3>
                <div class="featured-symbol">✦</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseCarousel>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseCarousel from '@/components/ui/BaseCarrusel.vue';
import type { FeaturedItem, CarouselItem } from '@/types/Index';

interface Props {
  items: FeaturedItem[];
  title?: string;
  viewAllText?: string;
  viewAllRoute?: string;
  autoRotate?: boolean;
  rotationInterval?: number;
  centerText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'COLECCIÓN DESTACADA',
  viewAllText: 'VER TODO',
  viewAllRoute: '/coleccion',
  autoRotate: true,
  rotationInterval: 5000,
  centerText: 'EXPLORA',
});

const emit = defineEmits<{
  itemClick: [item: FeaturedItem];
}>();

const router = useRouter();

const handleItemClick = (index: number, item: CarouselItem) => {
  // Convertir CarouselItem a FeaturedItem
  const featuredItem: FeaturedItem = {
    id: item.id,
    imagen: item.imagen,
    titulo: item.titulo || item.nombre || '',
    categoria: item.categoria || '',
  };
  emit('itemClick', featuredItem);
  // Puedes agregar navegación aquí si lo necesitas
  // router.push(`/producto/${item.id}`);
};
</script>

<style scoped>
.section-wrapper {
  padding: 8rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(218, 165, 32, 0.2);
}

.section-title {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--gold);
  margin: 0;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.section-link {
  color: var(--gold);
  text-decoration: none;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.section-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--gold);
  transition: width 0.3s ease;
}

.section-link:hover::after {
  width: 100%;
}

.section-link:hover .arrow {
  transform: translateX(5px);
}

.arrow {
  transition: transform 0.3s ease;
}

/* Featured Cards */
.featured-card {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  background: #000;
  transition: all 0.4s ease;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.featured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.featured-card:hover .featured-image,
.featured-card.active .featured-image {
  transform: scale(1.1);
}

.featured-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  padding: 3rem;
  transition: opacity 0.3s ease;
}

.overlay-content {
  width: 100%;
  transform: translateY(10px);
  transition: transform 0.4s ease;
}

.featured-card:hover .overlay-content,
.featured-card.active .overlay-content {
  transform: translateY(0);
}

.featured-category {
  display: block;
  font-size: 0.875rem;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.featured-title {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem 0;
  letter-spacing: 0.05em;
}

.featured-symbol {
  font-size: 2rem;
  color: var(--gold);
  animation: symbolPulse 2s ease-in-out infinite;
}

@keyframes symbolPulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .section-wrapper {
    padding: 4rem 1rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .featured-overlay {
    padding: 2rem;
  }
}
</style>