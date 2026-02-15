<template>
    <div class="stars-background">
      <div
        v-for="n in particleCount"
        :key="n"
        class="star"
        :style="getStarStyle(n)"
      ></div>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Props {
    particleCount?: number;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    particleCount: 80
  });
  
  const getStarStyle = (index: number) => {
    return {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
      width: `${1 + Math.random() * 2}px`,
      height: `${1 + Math.random() * 2}px`,
    };
  };
  </script>
  
  <style scoped>
  .stars-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }
  
  .star {
    position: absolute;
    background: #ffffff;
    border-radius: 50%;
    opacity: 0.6;
    animation: twinkle 3s ease-in-out infinite;
  }
  
  @keyframes twinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.2);
    }
  }
  </style>
  