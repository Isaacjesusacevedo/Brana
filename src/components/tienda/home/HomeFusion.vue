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
/* ========================
   SECTION
======================== */
.fusion-section {
  position: relative;
  padding: 8rem 2rem 6rem;
  max-width: 1400px;
  margin: 0 auto;
  overflow: hidden;
  z-index: 1;
}

/* Separador visual con borde lateral izquierdo */
.fusion-section::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  width: 3px;
  height: 80%;
  background: linear-gradient(
    180deg,
    transparent,
    var(--gold, #daa520) 20%,
    #dc2626 50%,
    var(--gold, #daa520) 80%,
    transparent
  );
  opacity: 0.4;
}

/* ========================
   BG KANJIS
======================== */
.fusion-bg-text {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-kanji {
  position: absolute;
  font-family: serif;
  color: #fff;
  user-select: none;
  transition: opacity 0.5s;
}

/* ========================
   SPLIT LAYOUT
======================== */
.fusion-split {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 3rem;
  margin-bottom: 5rem;
}

/* ========================
   HEMISFERIOS
======================== */
.hemisphere {
  position: relative;
}

.hemi-inner {
  padding: 2.5rem;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.hemisphere--arg .hemi-inner {
  background: linear-gradient(135deg, rgba(0, 85, 164, 0.08), rgba(252, 209, 22, 0.04));
  border-color: rgba(0, 85, 164, 0.2);
}

.hemisphere--jp .hemi-inner {
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(0, 0, 0, 0.2));
  border-color: rgba(220, 38, 38, 0.2);
}

.hemi-label {
  display: block;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1.5rem;
}

.hemi-symbols {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  margin-bottom: 1.5rem;
}

.hemi-sym {
  font-size: 2.5rem;
  color: var(--gold, #daa520);
}

.hemi-sym.secondary {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
  font-family: serif;
}

.hemi-refs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.hemi-refs li {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.1em;
  padding-left: 1rem;
  position: relative;
}

.hemi-refs li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.7rem;
}

/* ========================
   FUSION CENTER
======================== */
.fusion-center {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fusion-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  animation: ringRotate linear infinite;
}

.fusion-ring.outer {
  inset: 0;
  border-color: rgba(218, 165, 32, 0.3);
  animation-duration: 12s;
}

.fusion-ring.middle {
  inset: 15px;
  border-color: rgba(220, 38, 38, 0.25);
  animation-duration: 8s;
  animation-direction: reverse;
}

.fusion-ring.inner {
  inset: 30px;
  border-color: rgba(255, 255, 255, 0.15);
  animation-duration: 5s;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.fusion-nucleus {
  position: relative;
  z-index: 2;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  border-radius: 50%;
}

.nucleus-symbol {
  font-size: 1.5rem;
  color: var(--gold, #daa520);
  text-shadow: 0 0 20px rgba(218, 165, 32, 0.8);
  animation: nuclearPulse 2.5s ease-in-out infinite;
}

@keyframes nuclearPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.fusion-cross {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cross-h,
.cross-v {
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(218,165,32,0.2), transparent);
}

.cross-h {
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  transform: translateY(-50%);
}

.cross-v {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  transform: translateX(-50%);
  background: linear-gradient(180deg, transparent, rgba(218,165,32,0.2), transparent);
}

/* ========================
   EDITORIAL BLOCK
======================== */
.fusion-editorial {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.editorial-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.ornament-line {
  flex: 1;
  max-width: 80px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.6), transparent);
}

.ornament-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  color: #dc2626;
  text-transform: uppercase;
}

.fusion-title {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  color: #fff;
  line-height: 1.1;
  letter-spacing: 0.05em;
  margin: 0 0 2rem;
  text-transform: uppercase;
}

:deep(.fusion-title em) {
  font-style: normal;
  color: var(--gold, #daa520);
}

.fusion-body {
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 3rem;
}

/* ========================
   PIEZAS CONCEPTUALES
======================== */
.piezas-preview {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.pieza-tag {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 1.2rem;
  border: 1px solid rgba(218, 165, 32, 0.2);
  border-radius: 2px;
  background: rgba(218, 165, 32, 0.04);
  transition: all 0.3s ease;
  cursor: default;
}

.pieza-tag:hover {
  border-color: rgba(218, 165, 32, 0.5);
  background: rgba(218, 165, 32, 0.08);
  transform: translateY(-2px);
}

.pieza-symbol {
  font-size: 1.1rem;
  font-family: serif;
  color: var(--gold, #daa520);
  opacity: 0.8;
}

.pieza-name {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

/* ========================
   CTA
======================== */
.fusion-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.fusion-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 1.1rem 2.8rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-decoration: none;
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 2px;
  color: #dc2626;
  background: rgba(220, 38, 38, 0.06);
  transition: all 0.4s ease;
}

.fusion-cta-btn:hover {
  background: rgba(220, 38, 38, 0.12);
  border-color: #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.15);
  transform: translateY(-2px);
}

.cta-arrow {
  transition: transform 0.3s ease;
}

.fusion-cta-btn:hover .cta-arrow {
  transform: translateX(4px);
}

.cta-note {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  margin: 0;
}

/* ========================
   RESPONSIVE — TABLET
======================== */
@media (max-width: 1024px) {
  .fusion-split {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .fusion-center {
    margin: 0 auto;
  }
}

/* ========================
   RESPONSIVE — MOBILE
======================== */
@media (max-width: 640px) {
  .fusion-section {
    padding: 5rem 1.5rem;
  }

  .fusion-section::before {
    display: none;
  }

  .piezas-preview {
    gap: 0.6rem;
  }

  .pieza-tag {
    padding: 0.5rem 0.9rem;
  }
}
</style>