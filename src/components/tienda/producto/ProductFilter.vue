<template>
    <aside class="product-filter">
      <div class="filter-header">
        <h3 class="filter-title">FILTROS</h3>
        <button
          v-if="hasActiveFilters"
          class="filter-reset"
          @click="resetFilters"
          aria-label="Limpiar filtros"
        >
          LIMPIAR ✕
        </button>
      </div>
  
      <!-- ── Ordenamiento ───────────────────────────────────────────────────── -->
      <div class="filter-group">
        <label class="group-label">ORDENAR POR</label>
        <div class="select-wrapper">
          <select v-model="localOrder" class="filter-select" @change="emitChange">
            <option value="">Relevancia</option>
            <option value="nombre-asc">Nombre A→Z</option>
            <option value="nombre-desc">Nombre Z→A</option>
            <option value="precio-asc">Precio menor</option>
            <option value="precio-desc">Precio mayor</option>
            <option value="nuevo-desc">Más nuevos</option>
          </select>
          <span class="select-arrow">▾</span>
        </div>
      </div>
  
      <!-- ── Precio ─────────────────────────────────────────────────────────── -->
      <div class="filter-group">
        <label class="group-label">PRECIO</label>
        <div class="price-inputs">
          <div class="price-input-wrap">
            <span class="price-prefix">$</span>
            <input
              v-model.number="localMinPrecio"
              type="number"
              min="0"
              placeholder="Mín"
              class="filter-input"
              @change="emitChange"
            />
          </div>
          <span class="price-sep">—</span>
          <div class="price-input-wrap">
            <span class="price-prefix">$</span>
            <input
              v-model.number="localMaxPrecio"
              type="number"
              min="0"
              placeholder="Máx"
              class="filter-input"
              @change="emitChange"
            />
          </div>
        </div>
      </div>
  
      <!-- ── Colores ────────────────────────────────────────────────────────── -->
      <div v-if="availableColors.length" class="filter-group">
        <label class="group-label">COLORES</label>
        <div class="color-options">
          <button
            v-for="color in availableColors"
            :key="color"
            class="color-swatch"
            :class="{ selected: localColors.includes(color) }"
            :style="{ background: color }"
            :aria-label="`Color ${color}`"
            :aria-pressed="localColors.includes(color)"
            @click="toggleColor(color)"
          >
            <span v-if="localColors.includes(color)" class="check">✓</span>
          </button>
        </div>
      </div>
  
      <!-- ── Solo nuevos ────────────────────────────────────────────────────── -->
      <div class="filter-group">
        <label class="filter-toggle" :class="{ active: localSoloNuevos }">
          <span class="toggle-track" @click="toggleNuevos">
            <span class="toggle-thumb"></span>
          </span>
          <span class="toggle-label">Solo nuevos</span>
        </label>
      </div>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  // ── Tipos ─────────────────────────────────────────────────────────────────────
  export interface FilterState {
    minPrecio?: number;
    maxPrecio?: number;
    colores: string[];
    soloNuevos: boolean;
    orderBy?: 'nombre' | 'precio' | 'nuevo';
    desc?: boolean;
  }
  
  interface Props {
    /** Colores disponibles para mostrar como swatches (los provee CatalogoView). */
    availableColors?: string[];
    /** Estado inicial de los filtros (permite sincronización con la URL). */
    modelValue?: FilterState;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    availableColors: () => [],
    modelValue: () => ({
      colores: [],
      soloNuevos: false,
    }),
  });
  
  const emit = defineEmits<{
    /** Emitido en cada cambio de filtro con el estado completo actualizado. */
    'update:modelValue': [state: FilterState];
    /** Alias conveniente para @change en el padre sin necesitar v-model. */
    change: [state: FilterState];
  }>();
  
  // ── Estado local — inicializado desde modelValue ──────────────────────────────
  const localOrder      = ref('');
  const localMinPrecio  = ref<number | undefined>(props.modelValue.minPrecio);
  const localMaxPrecio  = ref<number | undefined>(props.modelValue.maxPrecio);
  const localColors     = ref<string[]>([...props.modelValue.colores]);
  const localSoloNuevos = ref(props.modelValue.soloNuevos);
  
  // ── Computadas ────────────────────────────────────────────────────────────────
  const hasActiveFilters = computed(() =>
    !!localMinPrecio.value ||
    !!localMaxPrecio.value ||
    localColors.value.length > 0 ||
    localSoloNuevos.value ||
    !!localOrder.value,
  );
  
  // ── Helpers ───────────────────────────────────────────────────────────────────
  /** Convierte el string del select ("precio-asc") en campos orderBy + desc */
  function parseOrder(val: string): { orderBy?: FilterState['orderBy']; desc?: boolean } {
    if (!val) return {};
    const [field, dir] = val.split('-');
    return {
      orderBy: field as FilterState['orderBy'],
      desc: dir === 'desc',
    };
  }
  
  // ── Acciones ──────────────────────────────────────────────────────────────────
  function toggleColor(color: string) {
    const idx = localColors.value.indexOf(color);
    if (idx === -1) localColors.value.push(color);
    else localColors.value.splice(idx, 1);
    emitChange();
  }
  
  function toggleNuevos() {
    localSoloNuevos.value = !localSoloNuevos.value;
    emitChange();
  }
  
  function resetFilters() {
    localOrder.value      = '';
    localMinPrecio.value  = undefined;
    localMaxPrecio.value  = undefined;
    localColors.value     = [];
    localSoloNuevos.value = false;
    emitChange();
  }
  
  function emitChange() {
    const state: FilterState = {
      minPrecio:  localMinPrecio.value || undefined,
      maxPrecio:  localMaxPrecio.value || undefined,
      colores:    [...localColors.value],
      soloNuevos: localSoloNuevos.value,
      ...parseOrder(localOrder.value),
    };
    emit('update:modelValue', state);
    emit('change', state);
  }
  </script>
  
  <style scoped>
  .product-filter {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  /* ── Header ── */
  .filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .filter-title {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.3em;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
  }
  
  .filter-reset {
    background: none;
    border: none;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: rgba(218, 165, 32, 0.7);
    cursor: pointer;
    padding: 0;
    transition: color 0.2s ease;
  }
  
  .filter-reset:hover { color: #DAA520; }
  
  /* ── Grupo ── */
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .group-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    color: rgba(255, 255, 255, 0.3);
    text-transform: uppercase;
  }
  
  /* ── Select ── */
  .select-wrapper {
    position: relative;
  }
  
  .filter-select {
    width: 100%;
    padding: 0.65rem 2rem 0.65rem 0.85rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
    letter-spacing: 0.05em;
    appearance: none;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }
  
  .filter-select:focus {
    outline: none;
    border-color: rgba(218, 165, 32, 0.5);
  }
  
  .select-arrow {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(218, 165, 32, 0.5);
    font-size: 0.7rem;
    pointer-events: none;
  }
  
  /* ── Precio ── */
  .price-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .price-input-wrap {
    position: relative;
    flex: 1;
  }
  
  .price-prefix {
    position: absolute;
    left: 0.6rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.3);
    pointer-events: none;
  }
  
  .filter-input {
    width: 100%;
    padding: 0.6rem 0.5rem 0.6rem 1.4rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
    transition: border-color 0.2s ease;
    -moz-appearance: textfield;
  }
  
  .filter-input::-webkit-inner-spin-button,
  .filter-input::-webkit-outer-spin-button { appearance: none; }
  
  .filter-input:focus {
    outline: none;
    border-color: rgba(218, 165, 32, 0.5);
  }
  
  .price-sep {
    color: rgba(255, 255, 255, 0.2);
    font-size: 0.75rem;
    flex-shrink: 0;
  }
  
  /* ── Colores ── */
  .color-options {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .color-swatch {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s ease, transform 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-swatch:hover { transform: scale(1.15); border-color: rgba(255, 255, 255, 0.4); }
  .color-swatch.selected { border-color: #DAA520; border-width: 2.5px; }
  
  .check {
    color: #fff;
    font-size: 0.75rem;
    text-shadow: 0 0 4px rgba(0, 0, 0, 0.9);
  }
  
  /* ── Toggle solo nuevos ── */
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    user-select: none;
  }
  
  .toggle-track {
    width: 40px;
    height: 22px;
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    position: relative;
    transition: background 0.25s ease, border-color 0.25s ease;
    cursor: pointer;
    flex-shrink: 0;
  }
  
  .filter-toggle.active .toggle-track {
    background: rgba(218, 165, 32, 0.25);
    border-color: rgba(218, 165, 32, 0.5);
  }
  
  .toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    transition: transform 0.25s cubic-bezier(0.22, 0.61, 0.36, 1), background 0.25s ease;
  }
  
  .filter-toggle.active .toggle-thumb {
    transform: translateX(18px);
    background: #DAA520;
  }
  
  .toggle-label {
    font-size: 0.82rem;
    color: rgba(255, 255, 255, 0.6);
    letter-spacing: 0.05em;
    transition: color 0.2s ease;
  }
  
  .filter-toggle.active .toggle-label { color: rgba(255, 255, 255, 0.9); }
  </style>