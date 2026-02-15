<template>
    <component
      :is="tag"
      :class="buttonClasses"
      :href="tag === 'a' ? href : undefined"
      :target="tag === 'a' ? target : undefined"
      :rel="tag === 'a' ? rel : undefined"
      @click="handleClick"
    >
      <span class="button-content">
        <slot />
        <span v-if="arrow" class="button-arrow">→</span>
      </span>
    </component>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface Props {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    tag?: 'button' | 'a';
    arrow?: boolean;
    href?: string;
    target?: string;
    rel?: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    tag: 'button',
    arrow: false
  });
  
  const emit = defineEmits<{
    click: [event: Event];
  }>();
  
  const buttonClasses = computed(() => {
    return [
      'base-button',
      `base-button--${props.variant}`,
      `base-button--${props.size}`
    ];
  });
  
  const handleClick = (event: Event) => {
    emit('click', event);
  };
  </script>
  
  <style scoped>
  .base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    font-family: 'Courier New', Courier, monospace;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 50px;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    position: relative;
    overflow: hidden;
  }
  
  .base-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  .base-button:hover::before {
    width: 300px;
    height: 300px;
  }
  
  .button-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .button-arrow {
    transition: transform 0.3s ease;
  }
  
  .base-button:hover .button-arrow {
    transform: translateX(5px);
  }
  
  /* Variants */
  .base-button--primary {
    background: linear-gradient(135deg, #DAA520 0%, #FFD700 100%);
    color: #000;
    border-color: #DAA520;
    box-shadow: 0 0 20px rgba(218, 165, 32, 0.4);
  }
  
  .base-button--primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 40px rgba(218, 165, 32, 0.6);
  }
  
  .base-button--secondary {
    background: transparent;
    border: 2px solid #DAA520;
    color: #DAA520;
  }
  
  .base-button--secondary:hover {
    background: rgba(218, 165, 32, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(218, 165, 32, 0.3);
  }
  
  .base-button--outline {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #ffffff;
  }
  
  .base-button--outline:hover {
    border-color: #DAA520;
    color: #DAA520;
  }
  
  /* Sizes */
  .base-button--sm {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }
  
  .base-button--md {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
  
  .base-button--lg {
    padding: 1.25rem 2.5rem;
    font-size: 1.125rem;
  }
  </style>
  