<template>
    <div class="base-input-wrapper" :class="wrapperClasses">
      <!-- Label flotante -->
      <label
        v-if="label"
        :for="inputId"
        class="base-input-label"
        :class="{ float: isFocused || hasValue }"
      >
        {{ label }}
      </label>
  
      <!-- Input + íconos -->
      <div class="base-input-inner">
        <!-- Ícono izquierdo -->
        <span v-if="prefixIcon" class="base-input-icon prefix">
          {{ prefixIcon }}
        </span>
  
        <!-- Input / Textarea -->
        <textarea
          v-if="type === 'textarea'"
          :id="inputId"
          v-bind="$attrs"
          class="base-input base-textarea"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :rows="rows"
          @input="handleInput"
          @focus="isFocused = true"
          @blur="handleBlur"
        ></textarea>
  
        <input
          v-else
          :id="inputId"
          v-bind="$attrs"
          class="base-input"
          :class="{ 'has-prefix': prefixIcon, 'has-suffix': suffixIcon || clearable }"
          :type="currentType"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          @input="handleInput"
          @focus="isFocused = true"
          @blur="handleBlur"
          @keydown.enter="$emit('enter', $event)"
        />
  
        <!-- Ícono de limpiar -->
        <button
          v-if="clearable && hasValue && !disabled"
          type="button"
          class="base-input-icon suffix clear-btn"
          @click="handleClear"
          tabindex="-1"
          aria-label="Limpiar"
        >
          ✕
        </button>
  
        <!-- Toggle contraseña -->
        <button
          v-else-if="type === 'password'"
          type="button"
          class="base-input-icon suffix pass-toggle"
          @click="showPassword = !showPassword"
          tabindex="-1"
          :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        >
          {{ showPassword ? '◉' : '◎' }}
        </button>
  
        <!-- Ícono derecho genérico -->
        <span v-else-if="suffixIcon" class="base-input-icon suffix">
          {{ suffixIcon }}
        </span>
      </div>
  
      <!-- Línea de foco animada -->
      <div class="base-input-focus-line" :class="{ active: isFocused }"></div>
  
      <!-- Mensaje de error / hint -->
      <transition name="msg-fade">
        <p v-if="error" class="base-input-msg error" role="alert">{{ error }}</p>
        <p v-else-if="hint && isFocused" class="base-input-msg hint">{{ hint }}</p>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { getCurrentInstance } from 'vue'
  
  // Deshabilitar herencia de atributos para que $attrs vayan solo al input
  defineOptions({ inheritAttrs: false });
  
  interface Props {
    modelValue?: string | number;
    label?: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'search';
    prefixIcon?: string;
    suffixIcon?: string;
    clearable?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    error?: string;
    hint?: string;
    autocomplete?: string;
    /** Solo para type="textarea" */
    rows?: number;
    /** Variante visual */
    variant?: 'default' | 'ghost' | 'filled';
    size?: 'sm' | 'md' | 'lg';
  }
  
  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    clearable: false,
    disabled: false,
    readonly: false,
    rows: 4,
    variant: 'default',
    size: 'md',
  });
  
  const emit = defineEmits<{
    'update:modelValue': [value: string];
    blur: [event: FocusEvent];
    clear: [];
    enter: [event: KeyboardEvent];
  }>();
  
  // ── Estado local ─────────────────────────────────────────────────────────────
  const isFocused = ref(false);
  const showPassword = ref(false);
  
  // ── Computadas ────────────────────────────────────────────────────────────────
const _uid   = getCurrentInstance()?.uid ?? Math.random().toString(36).slice(2, 7)
const inputId = `brana-input-${_uid}`

  
  const currentType = computed(() => {
    if (props.type === 'password') return showPassword.value ? 'text' : 'password';
    return props.type;
  });
  
  const hasValue = computed(() =>
    props.modelValue !== undefined &&
    props.modelValue !== null &&
    String(props.modelValue).length > 0,
  );
  
  const wrapperClasses = computed(() => [
    `variant-${props.variant}`,
    `size-${props.size}`,
    {
      focused: isFocused.value,
      'has-error': !!props.error,
      disabled: props.disabled,
      'has-value': hasValue.value,
      'has-label': !!props.label,
    },
  ]);
  
  // ── Handlers ─────────────────────────────────────────────────────────────────
  function handleInput(e: Event) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
  }
  
  function handleBlur(e: FocusEvent) {
    isFocused.value = false;
    emit('blur', e);
  }
  
  function handleClear() {
    emit('update:modelValue', '');
    emit('clear');
  }
  </script>
  
  <style scoped>
  /* ========================
     WRAPPER
  ======================== */
  .base-input-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0;
    width: 100%;
  }
  
  /* ========================
     LABEL FLOTANTE
  ======================== */
  .base-input-label {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.35);
    pointer-events: none;
    transition: all 0.25s ease;
    z-index: 2;
  }
  
  .has-label .base-input-label.float,
  .focused .base-input-label {
    top: 0.45rem;
    font-size: 0.6rem;
    color: var(--gold, #daa520);
    transform: none;
  }
  
  /* Cuando hay textarea, el label tiene posición diferente */
  .base-input-wrapper:has(textarea) .base-input-label {
    top: 1.1rem;
    transform: none;
  }
  
  .base-input-wrapper:has(textarea) .base-input-label.float {
    top: 0.45rem;
  }
  
  /* ========================
     INNER CONTAINER
  ======================== */
  .base-input-inner {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  /* ========================
     INPUT BASE
  ======================== */
  .base-input {
    width: 100%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    color: #fff;
    font-family: inherit;
    letter-spacing: 0.05em;
    outline: none;
    transition: background 0.3s ease, border-color 0.3s ease;
    -webkit-appearance: none;
    appearance: none;
  }
  
  .base-input::placeholder {
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 0.8em;
  }
  
  /* Remove number input arrows */
  .base-input[type='number']::-webkit-inner-spin-button,
  .base-input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  
  /* ── Padding según iconos ── */
  .base-input.has-prefix { padding-left: 2.8rem; }
  .base-input.has-suffix { padding-right: 2.8rem; }
  
  /* ── Textarea ── */
  .base-textarea {
    resize: vertical;
    min-height: 100px;
    padding-top: 1.5rem;
    line-height: 1.7;
  }
  
  /* ========================
     TAMAÑOS
  ======================== */
  .size-sm .base-input { padding: 0.6rem 0.9rem; font-size: 0.8rem; }
  .size-md .base-input { padding: 0.9rem 1rem; font-size: 0.85rem; }
  .size-lg .base-input { padding: 1.1rem 1.2rem; font-size: 0.95rem; }
  
  /* Ajuste con label flotante */
  .has-label .base-input { padding-top: 1.4rem; padding-bottom: 0.5rem; }
  
  /* ========================
     VARIANTES
  ======================== */
  .variant-filled .base-input {
    background: rgba(255, 255, 255, 0.06);
    border-color: transparent;
  }
  
  .variant-ghost .base-input {
    background: transparent;
    border-color: transparent;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 0;
  }
  
  /* ========================
     ESTADOS
  ======================== */
  .focused .base-input {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(218, 165, 32, 0.5);
  }
  
  .has-error .base-input {
    border-color: rgba(220, 38, 38, 0.6);
  }
  
  .disabled .base-input {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  /* ========================
     LÍNEA ANIMADA DE FOCO
  ======================== */
  .base-input-focus-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: var(--gold, #daa520);
    transition: width 0.3s ease, left 0.3s ease;
    border-radius: 0 0 2px 2px;
  }
  
  .has-error .base-input-focus-line {
    background: #dc2626;
    width: 100%;
    left: 0;
  }
  
  .focused .base-input-focus-line.active {
    width: 100%;
    left: 0;
  }
  
  /* ========================
     ÍCONOS
  ======================== */
  .base-input-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.3);
    pointer-events: none;
    z-index: 2;
    transition: color 0.2s ease;
    line-height: 1;
  }
  
  .base-input-icon.prefix { left: 0.9rem; }
  .base-input-icon.suffix { right: 0.9rem; }
  
  .focused .base-input-icon.prefix {
    color: rgba(218, 165, 32, 0.7);
  }
  
  /* Clear y password toggle son botones */
  .clear-btn,
  .pass-toggle {
    pointer-events: all;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.3rem;
    border-radius: 50%;
    transition: background 0.2s ease, color 0.2s ease;
  }
  
  .clear-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.7);
  }
  
  .pass-toggle:hover {
    color: var(--gold, #daa520);
  }
  
  /* ========================
     MENSAJES
  ======================== */
  .base-input-msg {
    margin: 0.4rem 0 0;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
  }
  
  .base-input-msg.error { color: #dc2626; }
  .base-input-msg.hint  { color: rgba(255, 255, 255, 0.35); }
  
  /* ========================
     ANIMACIÓN MENSAJE
  ======================== */
  .msg-fade-enter-active,
  .msg-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  .msg-fade-enter-from,
  .msg-fade-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
  </style>