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

/* Tablet (641px - 1024px) */
@media (min-width: 641px) and (max-width: 1024px) {
  .categories-container {
    padding: 3rem 0;
  }

  .categories-intro {
    margin-bottom: 4rem;
    padding: 0 1.5rem;
  }

  .intro-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
  }

  .intro-text {
    font-size: 1.1rem;
  }
}

/* Móvil (<= 640px) */
@media (max-width: 640px) {
  .categories-container {
    padding: 3rem 0;
  }

  .categories-intro {
    margin-bottom: 3rem;
    padding: 0 1.5rem;
  }

  .intro-title {
    font-size: clamp(1.6rem, 7vw, 2rem);
    letter-spacing: 0.08em;
    margin-bottom: 0.75rem;
  }

  .intro-text {
    font-size: 0.95rem;
    line-height: 1.6;
  }
}

/* Móvil pequeño (<= 375px) */
@media (max-width: 375px) {
  .categories-intro {
    padding: 0 0.75rem;
  }

  .intro-title {
    font-size: 1.6rem;
  }

  .intro-text {
    font-size: 0.95rem;
  }
}
</style>