<template>
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
          <div class="modal-container" :class="size" @click.stop>
            <!-- Header -->
            <div class="modal-header" v-if="!hideHeader">
              <h2 class="modal-title" v-if="title">{{ title }}</h2>
              <button class="modal-close" @click="close" aria-label="Cerrar">
                <span>✕</span>
              </button>
            </div>
  
            <!-- Content -->
            <div class="modal-content">
              <slot></slot>
            </div>
  
            <!-- Footer -->
            <div class="modal-footer" v-if="$slots.footer">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </template>
  
  <script setup lang="ts">
  import { watch } from 'vue';
  
  interface Props {
    modelValue: boolean;
    title?: string;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
    hideHeader?: boolean;
    closeOnOverlayClick?: boolean;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    size: 'medium',
    hideHeader: false,
    closeOnOverlayClick: true,
  });
  
  const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    close: [];
  }>();
  
  const close = () => {
    emit('update:modelValue', false);
    emit('close');
  };
  
  const handleOverlayClick = () => {
    if (props.closeOnOverlayClick) {
      close();
    }
  };
  
  // Bloquear scroll cuando el modal está abierto
  watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 2rem;
    overflow-y: auto;
  }
  
  .modal-container {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    border-radius: 20px;
    border: 1px solid rgba(218, 165, 32, 0.3);
    box-shadow: 
      0 20px 60px rgba(0, 0, 0, 0.8),
      0 0 40px rgba(218, 165, 32, 0.2);
    max-width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  
  .modal-container.small {
    width: 400px;
  }
  
  .modal-container.medium {
    width: 800px;
  }
  
  .modal-container.large {
    width: 1200px;
  }
  
  .modal-container.fullscreen {
    width: 95vw;
    height: 95vh;
    max-height: 95vh;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem;
    border-bottom: 1px solid rgba(218, 165, 32, 0.2);
  }
  
  .modal-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: #DAA520;
    margin: 0;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  .modal-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }
  
  .modal-close:hover {
    color: #DAA520;
    background: rgba(218, 165, 32, 0.1);
    transform: rotate(90deg);
  }
  
  .modal-content {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }
  
  .modal-content::-webkit-scrollbar {
    width: 8px;
  }
  
  .modal-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }
  
  .modal-content::-webkit-scrollbar-thumb {
    background: rgba(218, 165, 32, 0.3);
    border-radius: 4px;
  }
  
  .modal-content::-webkit-scrollbar-thumb:hover {
    background: rgba(218, 165, 32, 0.5);
  }
  
  .modal-footer {
    padding: 1.5rem 2rem;
    border-top: 1px solid rgba(218, 165, 32, 0.2);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  
  /* Transiciones */
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .modal-enter-active .modal-container,
  .modal-leave-active .modal-container {
    transition: transform 0.3s ease;
  }
  
  .modal-enter-from,
  .modal-leave-to {
    opacity: 0;
  }
  
  .modal-enter-from .modal-container {
    transform: scale(0.9) translateY(-20px);
  }
  
  .modal-leave-to .modal-container {
    transform: scale(0.9) translateY(20px);
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .modal-container.large {
      width: 90vw;
    }
  }
  
  @media (max-width: 768px) {
    .modal-overlay {
      padding: 0;
      align-items: flex-end;
    }
  
    .modal-container {
      width: 100% !important;
      max-height: 95vh;
      border-radius: 20px 20px 0 0;
    }
  
    .modal-header {
      padding: 1.5rem;
    }
  
    .modal-content {
      padding: 1.5rem;
    }
  
    .modal-title {
      font-size: 1.4rem;
    }
  }
  </style>