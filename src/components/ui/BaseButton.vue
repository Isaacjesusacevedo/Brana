<template>
    <component
      :is="tag"
      :class="buttonClasses"
      :type="type"
      :disabled="disabled"
      @click="handleClick"
    >
      <span v-if="$slots.icon" class="button__icon button__icon--left">
        <slot name="icon"></slot>
      </span>
      
      <span class="button__text">
        <slot></slot>
      </span>
      
      <span v-if="$slots.iconRight || arrow" class="button__icon button__icon--right">
        <slot name="iconRight">
          <span v-if="arrow">→</span>
        </slot>
      </span>
      
      <span class="button__bg"></span>
    </component>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    tag?: 'button' | 'a';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    fullWidth?: boolean;
    arrow?: boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    variant: 'primary',
    size: 'md',
    tag: 'button',
    type: 'button',
    disabled: false,
    fullWidth: false,
    arrow: false,
  });
  
  const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
  }>();
  
  const buttonClasses = computed(() => [
    'base-button',
    `base-button--${props.variant}`,
    `base-button--${props.size}`,
    {
      'base-button--disabled': props.disabled,
      'base-button--full-width': props.fullWidth,
    },
  ]);
  
  const handleClick = (event: MouseEvent) => {
    if (!props.disabled) {
      emit('click', event);
    }
  };
  </script>
  
  <style scoped>
  /* ========== BASE BUTTON ========== */
  .base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    font-family: var(--font-heading);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-widest);
    text-transform: uppercase;
    text-decoration: none;
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all var(--transition-base) var(--ease-smooth);
    white-space: nowrap;
  }
  
  .base-button:disabled,
  .base-button--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  /* ========== SIZES ========== */
  .base-button--sm {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: var(--font-size-xs);
  }
  
  .base-button--md {
    padding: var(--spacing-md) var(--spacing-2xl);
    font-size: var(--font-size-sm);
  }
  
  .base-button--lg {
    padding: var(--spacing-lg) var(--spacing-3xl);
    font-size: var(--font-size-base);
  }
  
  /* ========== VARIANTS ========== */
  
  /* Primary (Gold Filled) */
  .base-button--primary {
    background: transparent;
    border: 2px solid var(--color-gold-primary);
    color: var(--color-white);
    clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
  }
  
  .base-button--primary .button__bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--color-gold-primary), var(--color-gold-light));
    transform: translateX(-100%);
    transition: transform var(--transition-base) var(--ease-smooth);
    z-index: -1;
  }
  
  .base-button--primary:hover:not(:disabled) {
    color: var(--color-black);
    border-color: var(--color-gold-light);
    box-shadow: var(--shadow-gold-lg);
    transform: translateY(-2px);
  }
  
  .base-button--primary:hover:not(:disabled) .button__bg {
    transform: translateX(0);
  }
  
  /* Secondary (Outline) */
  .base-button--secondary {
    background: transparent;
    border: 2px solid rgba(212, 175, 55, 0.5);
    color: var(--color-gold-primary);
    clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
  }
  
  .base-button--secondary .button__bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(255, 215, 0, 0.2));
    transform: translateY(100%);
    transition: transform var(--transition-base) var(--ease-smooth);
    z-index: -1;
  }
  
  .base-button--secondary:hover:not(:disabled) {
    border-color: var(--color-gold-light);
    color: var(--color-gold-light);
    box-shadow: var(--shadow-gold-md);
    transform: translateY(-3px);
  }
  
  .base-button--secondary:hover:not(:disabled) .button__bg {
    transform: translateY(0);
  }
  
  /* Outline */
  .base-button--outline {
    background: transparent;
    border: 1px solid rgba(212, 175, 55, 0.5);
    color: var(--color-white);
  }
  
  .base-button--outline:hover:not(:disabled) {
    border-color: var(--color-gold-primary);
    color: var(--color-gold-primary);
    box-shadow: var(--shadow-gold-sm);
  }
  
  /* Ghost */
  .base-button--ghost {
    background: transparent;
    border: none;
    color: var(--text-secondary);
  }
  
  .base-button--ghost:hover:not(:disabled) {
    color: var(--color-gold-primary);
    text-shadow: var(--text-shadow-gold);
  }
  
  /* ========== ICON STYLING ========== */
  .button__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform var(--transition-base) var(--ease-out);
  }
  
  .base-button:hover:not(:disabled) .button__icon--right {
    transform: translateX(5px);
  }
  
  .base-button:hover:not(:disabled) .button__icon--left {
    transform: translateX(-5px);
  }
  
  /* ========== TEXT ========== */
  .button__text {
    position: relative;
    z-index: 1;
  }
  
  /* ========== FULL WIDTH ========== */
  .base-button--full-width {
    width: 100%;
  }
  
  /* ========== RESPONSIVE ========== */
  @media (max-width: 768px) {
    .base-button--sm {
      padding: 0.5rem 1rem;
      font-size: 0.625rem;
    }
  
    .base-button--md {
      padding: 0.75rem 1.5rem;
      font-size: 0.75rem;
    }
  
    .base-button--lg {
      padding: 1rem 2rem;
      font-size: 0.875rem;
    }
  }
  </style>