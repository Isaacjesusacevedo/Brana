<template>
  <div class="catalogo-view">
    <!-- Products Grid -->
    <section class="catalogo-section">
      <div class="container">
        <h1 class="catalogo-title">PIEZAS SELECTAS</h1>

        <!-- Subtitle with ornament -->
        <div class="catalogo-subtitle">
          <div class="subtitle-ornament">
            <span class="ornament-symbol">✦</span>
            <p class="subtitle-text">COLECCIÓN ARCANA</p>
            <span class="ornament-symbol">✦</span>
          </div>
        </div>

        <div class="products-grid">
          <div
            v-for="(product, index) in products"
            :key="index"
            class="product-card tarot-card"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <!-- Card ornamental frame -->
            <div class="card-frame">
              <div class="card-corner card-tl"></div>
              <div class="card-corner card-tr"></div>
              <div class="card-corner card-bl"></div>
              <div class="card-corner card-br"></div>
            </div>

            <div class="product-image-container">
              <img
                :src="product.image"
                :alt="product.name"
                class="product-image"
              />
              <!-- Overlay gradient -->
              <div class="image-overlay"></div>
            </div>

            <div class="product-info">
              <!-- Top symbol -->
              <div class="product-symbol">
                <span>✧</span>
              </div>

              <p class="product-category">
                {{ product.category }}
              </p>

              <h3 class="product-name">
                {{ product.name }}
              </h3>

              <p class="product-price">
                {{ product.price }}
              </p>

              <button class="product-button">
                <span class="button-text">AÑADIR AL RITUAL</span>
                <div class="button-bg"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const products = ref([
  {
    name: "OBSIDIAN ESSENCE",
    category: "Remera Premium",
    price: "$89.000",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=800&fit=crop"
  },
  {
    name: "GOLDEN AURA",
    category: "Campera Exclusiva",
    price: "$245.000",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop"
  },
  {
    name: "MIDNIGHT RITUAL",
    category: "Conjunto Ceremonial",
    price: "$165.000",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop"
  },
  {
    name: "ETERNAL THREAD",
    category: "Jean Signature",
    price: "$125.000",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop"
  },
  {
    name: "VOID WALKER",
    category: "Buzo Oversize",
    price: "$135.000",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop"
  },
  {
    name: "STELLAR CROWN",
    category: "Gorra Edición Limitada",
    price: "$65.000",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&h=800&fit=crop"
  },
  {
    name: "SHADOW WEAVE",
    category: "Camisa Ceremonial",
    price: "$115.000",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop"
  },
  {
    name: "COSMIC WALKER",
    category: "Zapatillas Premium",
    price: "$185.000",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop"
  }
]);
</script>
