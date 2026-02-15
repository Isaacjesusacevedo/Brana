<template>
  <section class="categories-container">
    <div class="categories-intro">
      <h2 class="intro-title">{{ title }}</h2>
      <p class="intro-text">{{ description }}</p>
    </div>

    <slot></slot>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'EXPLORA EL ARCANO',
  description: 'Descubre nuestra colección organizada por esencia y estilo',
});
</script>

<style scoped>
.categories-container {
  position: relative;
  padding: 4rem 0;
  z-index: 1;
}

.categories-intro {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 6rem;
  padding: 0 2rem;
}

.intro-title {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 700;
  color: var(--gold);
  margin: 0 0 1rem 0;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.intro-text {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
  margin: 0;
}

@media (max-width: 768px) {
  .categories-intro {
    margin-bottom: 3rem;
  }
}
</style>