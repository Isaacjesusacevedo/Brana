<template>
    <section class="home-categories section">
      <div class="container container-xl">
        <!-- Header -->
        <div class="home-categories__header">
          <h2 class="section-title">CATEGORÍAS_ARCANAS</h2>
          <p class="subtitle">[ EXPLORA_NUESTRA_DIMENSIÓN_VESTIBLE ]</p>
          <div class="title-divider"></div>
        </div>
  
        <!-- Grid -->
        <div class="home-categories__grid">
          <div
            v-for="(category, index) in categories"
            :key="category.id"
            class="category-card"
            :style="{ animationDelay: `${0.1 * (index + 1)}s` }"
            @click="navigateToCategory(category.slug)"
          >
            <!-- Image Wrapper -->
            <div class="category-card__image-wrapper">
              <img
                :src="category.image"
                :alt="category.name"
                class="category-card__image"
              />
              <div class="image-overlay"></div>
              <div class="cyber-grid-overlay"></div>
            </div>
  
            <!-- Info -->
            <div class="category-card__info">
              <span class="category-card__badge">{{ category.badge }}</span>
              <h3 class="category-card__name">{{ category.name }}</h3>
              <p class="category-card__count">{{ category.count }} DISEÑOS ÚNICOS</p>
              <p class="category-card__description">{{ category.description }}</p>
  
              <BaseButton variant="outline" size="sm" :arrow="true">
                EXPLORAR
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
    badge: string;
    count: number;
    description: string;
  }
  
  const categories = ref<Category[]>([
    {
      id: 1,
      name: 'REMERAS',
      slug: 'remeras',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop',
      badge: 'ESENCIAL',
      count: 12,
      description:
        'Piezas fundamentales que fusionan comfort esotérico con estética cyberpunk. Cada diseño es un portal.',
    },
    {
      id: 2,
      name: 'PANTALONES',
      slug: 'pantalones',
      image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=1000&fit=crop',
      badge: 'ESTRUCTURA',
      count: 8,
      description:
        'Fundamentos de tu identidad dimensional. Diseños que definen territorio entre lo real y lo digital.',
    },
    {
      id: 3,
      name: 'ACCESORIOS',
      slug: 'accesorios',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop',
      badge: 'RITUAL',
      count: 15,
      description:
        'Elementos que completan tu transformación. Cada accesorio amplifica tu presencia interdimensional.',
    },
  ]);
  
  /**
   * Navigate to category page
   */
  function navigateToCategory(slug: string): void {
    // TODO: In production, use router.push(`/productos/${slug}`)
    window.open('https://www.instagram.com/brana.ok/', '_blank');
  }
  </script>