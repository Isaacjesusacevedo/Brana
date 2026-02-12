<template>
    <section class="home-philosophy section">
      <div class="container container-xl">
        <div class="home-philosophy__header">
          <h2 class="section-title text-glitch" data-text="FILOSOFÍA_DIGITAL">
            FILOSOFÍA_DIGITAL
          </h2>
          <div class="title-divider"></div>
        </div>
  
        <div class="home-philosophy__grid">
          <div
            v-for="(card, index) in philosophyCards"
            :key="card.id"
            class="philosophy-card"
            :style="{ animationDelay: `${0.1 * (index + 1)}s` }"
          >
            <!-- Image Wrapper -->
            <div class="philosophy-card__image-wrapper">
              <img
                :src="card.image"
                :alt="card.title"
                class="philosophy-card__image"
              />
              
              <!-- Code Overlay -->
              <div class="image-code-overlay">
                <div class="code-stream">
                  <span v-for="code in card.codes" :key="code">{{ code }}</span>
                </div>
              </div>
              
              <!-- Golden Fracture -->
              <div class="golden-fracture"></div>
            </div>
  
            <!-- Content -->
            <div class="philosophy-card__content">
              <h3 class="philosophy-card__title">{{ card.title }}</h3>
              <p class="philosophy-card__text">{{ card.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  interface PhilosophyCard {
    id: number;
    title: string;
    description: string;
    image: string;
    codes: string[];
  }
  
  const philosophyCards = ref<PhilosophyCard[]>([
    {
      id: 1,
      title: 'IDENTIDAD_DIGITAL',
      description:
        'La intersección entre lo clásico y lo digital. Cada pieza es un fragmento de eternidad codificado en el presente.',
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=1000&fit=crop',
      codes: ['0x1A4F', getRandomCode(), getRandomCode()],
    },
    {
      id: 2,
      title: 'ALQUIMIA_MODERNA',
      description:
        'Transformación perpetua. El oro no solo como material, sino como símbolo de la evolución constante.',
      image: 'https://images.unsplash.com/photo-1577720643272-265f49bec990?w=800&h=1000&fit=crop',
      codes: [getRandomCode(), '0xGOLD', getRandomCode()],
    },
    {
      id: 3,
      title: 'TRASCENDENCIA_TEMPORAL',
      description:
        'Más allá del tiempo lineal. Cada prenda es un portal hacia dimensiones paralelas de expresión.',
      image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&h=1000&fit=crop',
      codes: [getRandomCode(), getRandomCode(), '0xETERNAL'],
    },
  ]);
  
  function getRandomCode(): string {
    const codes = ['0x1A2B', '0xDEAD', '0xC0DE', '0xF00D', '0xBEEF', '0xCAFE', '0xBABE'];
    return codes[Math.floor(Math.random() * codes.length)]!;
  }
  </script>