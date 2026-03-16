<template>
  <section class="fusion-section">
    <!-- Fondo de kanji / texto decorativo -->
    <div class="fusion-bg-text" aria-hidden="true">
      <span v-for="kanji in bgKanjis" :key="kanji.id" class="bg-kanji" :style="kanji.style">
        {{ kanji.char }}
      </span>
    </div>

    <!-- Contenido principal: dos hemisferios -->
    <div class="fusion-split">

      <!-- Hemisferio izquierdo: Argentina -->
      <div class="hemisphere hemisphere--arg">
        <div class="hemi-inner">
          <span class="hemi-label">BUENOS AIRES</span>
          <div class="hemi-symbols">
            <span class="hemi-sym">☽</span>
            <span class="hemi-sym secondary">ψ</span>
          </div>
          <ul class="hemi-refs">
            <li>San La Muerte</li>
            <li>Gaucho Gil</li>
            <li>La Pampa Liminal</li>
            <li>Lunfardo Esotérico</li>
          </ul>
        </div>
      </div>

      <!-- Centro: el símbolo de fusión -->
      <div class="fusion-center">
        <div class="fusion-ring outer"></div>
        <div class="fusion-ring middle"></div>
        <div class="fusion-ring inner"></div>
        <div class="fusion-nucleus">
          <span class="nucleus-symbol">◈</span>
        </div>
        <div class="fusion-cross">
          <span class="cross-h"></span>
          <span class="cross-v"></span>
        </div>
      </div>

      <!-- Hemisferio derecho: Japón -->
      <div class="hemisphere hemisphere--jp">
        <div class="hemi-inner">
          <span class="hemi-label">日本 · TOKIO</span>
          <div class="hemi-symbols">
            <span class="hemi-sym">⛩</span>
            <span class="hemi-sym secondary">鬼</span>
          </div>
          <ul class="hemi-refs">
            <li>Oni · Yokai</li>
            <li>Visual Kei</li>
            <li>Berserk · Blame!</li>
            <li>Sumi-e Oscuro</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Texto editorial -->
    <div class="fusion-editorial">
      <div class="editorial-ornament">
        <span class="ornament-line"></span>
        <span class="ornament-text">LÍNEA DE FUSIÓN</span>
        <span class="ornament-line"></span>
      </div>

      <h2 class="fusion-title" v-html="title"></h2>
      <p class="fusion-body">{{ body }}</p>

      <!-- Piezas conceptuales preview -->
      <div class="piezas-preview">
        <div
          v-for="pieza in piezasConceptuales"
          :key="pieza.id"
          class="pieza-tag"
        >
          <span class="pieza-symbol">{{ pieza.simbolo }}</span>
          <span class="pieza-name">{{ pieza.nombre }}</span>
        </div>
      </div>

      <div class="fusion-cta">
        <RouterLink :to="ctaRoute" class="cta-button fusion-cta-btn">
          {{ ctaText }} <span class="cta-arrow">→</span>
        </RouterLink>
        <p class="cta-note">{{ ctaNote }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface PiezaConceptual {
  id: string;
  nombre: string;
  simbolo: string;
}

interface Props {
  title?: string;
  body?: string;
  ctaText?: string;
  ctaRoute?: string;
  ctaNote?: string;
  piezasConceptuales?: PiezaConceptual[];
}

withDefaults(defineProps<Props>(), {
  title:
    'SOS DE ACÁ<br/><em>Y DE ALLÁ</em><br/>AL MISMO TIEMPO.',
  body: 'Ninguna marca argentina habla tu idioma visual todavía. Brana es la primera síntesis estética entre el Yokai y el Gaucho, el Lunfardo y el Kanji, la Pampa y el Torii. No es una contradicción — es tu identidad más honesta.',
  ctaText: 'CONOCER LA LÍNEA JP·ARG',
  // Ruta corregida: /coleccion/fusion no existe en el router → caía al catchall y redirigía a home.
  // Usar /catalogo hasta que exista la vista /coleccion/fusion y se registre en el router.
  ctaRoute: '/catalogo',
  ctaNote: 'Próximo lanzamiento · Colección PV 2026',
  piezasConceptuales: () => [
    { id: '01', nombre: 'VIENTO DEL SUR', simbolo: '風' },
    { id: '02', nombre: 'SANTOS YOKAI', simbolo: '鬼' },
    { id: '03', nombre: 'LUNFARDÓN', simbolo: '字' },
    { id: '04', nombre: 'BARDO RÍO', simbolo: '川' },
  ],
});

// Kanjis decorativos de fondo.
// Intencionalmente hardcodeados como constante del módulo: son puramente decorativos,
// no tienen lógica reactiva y no necesitan ser configurables desde el padre.
// Si en el futuro se requiere personalización, exponer como prop `bgKanjis?: BgKanji[]`.
const bgKanjis = [
  { id: 1, char: '永', style: { top: '5%', left: '3%', fontSize: '8rem', opacity: '0.04', transform: 'rotate(-12deg)' } },
  { id: 2, char: '魂', style: { top: '15%', right: '5%', fontSize: '12rem', opacity: '0.03', transform: 'rotate(8deg)' } },
  { id: 3, char: '南', style: { bottom: '10%', left: '8%', fontSize: '10rem', opacity: '0.04', transform: 'rotate(-5deg)' } },
  { id: 4, char: '夢', style: { bottom: '20%', right: '4%', fontSize: '7rem', opacity: '0.05', transform: 'rotate(15deg)' } },
  { id: 5, char: '鬼', style: { top: '45%', left: '1%', fontSize: '6rem', opacity: '0.06', transform: 'rotate(-20deg)' } },
  { id: 6, char: '道', style: { top: '55%', right: '2%', fontSize: '9rem', opacity: '0.035', transform: 'rotate(10deg)' } },
];
</script>

<style scoped>
@import '@/assets/css/components/home-fusion.css';
</style>
