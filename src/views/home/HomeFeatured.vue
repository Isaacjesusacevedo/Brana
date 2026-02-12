<template>
    <section class="home-featured section">
      <div class="container container-xl">
        <!-- Header -->
        <div class="home-featured__header">
          <h2 class="section-title text-glitch" data-text="PIEZAS_DESTACADAS">
            PIEZAS_DESTACADAS
          </h2>
          <div class="title-divider"></div>
        </div>
  
        <!-- Grid -->
        <div class="home-featured__grid">
          <ProductCard
            v-for="(product, index) in featuredProducts"
            :key="product.id"
            :product="product"
            :style="{ animationDelay: `${0.1 * (index + 1)}s` }"
          />
        </div>
  
        <!-- CTA -->
        <div class="home-featured__cta">
          <BaseButton
            variant="secondary"
            size="lg"
            tag="a"
            :arrow="true"
            href="https://www.instagram.com/brana.ok/"
            target="_blank"
            rel="noopener noreferrer"
          >
            VER_CATÁLOGO_COMPLETO
          </BaseButton>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import ProductCard from '@/components/product/ProductCard.vue';
  import BaseButton from '@/components/ui/BaseButton.vue';
  
  interface ProductVariant {
    color: string;
    colorHex: string;
    image: string;
  }
  
  interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    badge?: string;
    size?: 'normal' | 'featured' | 'wide' | 'tall';
    variants?: ProductVariant[];
  }
  
  const featuredProducts = ref<Product[]>([
    {
      id: 1,
      name: 'OBSIDIAN_ESSENCE',
      price: '$89.000',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop',
      badge: 'EXCLUSIVO',
      size: 'featured',
      variants: [
        {
          color: 'Negro',
          colorHex: '#1a1a1a',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop',
        },
        {
          color: 'Dorado',
          colorHex: '#D4AF37',
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop',
        },
        {
          color: 'Blanco',
          colorHex: '#f5f5f5',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop',
        },
      ],
    },
    {
      id: 2,
      name: 'GOLDEN_VOID',
      price: '$85.000',
      image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
      variants: [
        {
          color: 'Negro',
          colorHex: '#1a1a1a',
          image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
        },
        {
          color: 'Gris',
          colorHex: '#6b7280',
          image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
        },
        {
          color: 'Azul Oscuro',
          colorHex: '#1e3a8a',
          image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
        },
      ],
    },
    {
      id: 3,
      name: 'AMBER_RITUAL',
      price: '$92.000',
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
      variants: [
        {
          color: 'Dorado',
          colorHex: '#D4AF37',
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=800&fit=crop',
        },
        {
          color: 'Negro',
          colorHex: '#1a1a1a',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop',
        },
        {
          color: 'Café',
          colorHex: '#854d0e',
          image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop',
        },
      ],
    },
    {
      id: 4,
      name: 'ELDRITCH_LUXURY',
      price: '$88.000',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=600&fit=crop',
      size: 'wide',
      variants: [
        {
          color: 'Blanco',
          colorHex: '#f5f5f5',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=600&fit=crop',
        },
        {
          color: 'Negro',
          colorHex: '#1a1a1a',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&h=600&fit=crop',
        },
      ],
    },
    {
      id: 5,
      name: 'SOLAR_GOLD',
      price: '$90.000',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
    },
    {
      id: 6,
      name: 'COSMIC_GOLD',
      price: '$95.000',
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=900&fit=crop',
      size: 'tall',
    },
  ]);
  </script>