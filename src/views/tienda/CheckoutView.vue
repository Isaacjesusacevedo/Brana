<template>
  <div class="checkout-container">
    <StarsBackground :particleCount="35" />

    <div class="checkout-content">
      <!-- ── Header ──────────────────────────────────────────────────── -->
      <header class="checkout-header">
        <div class="header-ornament">
          <span class="orn-line"></span>
          <span class="orn-sym">✦</span>
          <span class="orn-line"></span>
        </div>
        <h1 class="checkout-title">CHECKOUT</h1>
        <p class="checkout-subtitle">Completá tu pedido</p>
      </header>

      <!-- ── Breadcrumb de pasos ────────────────────────────────────── -->
      <nav class="steps-nav" aria-label="Pasos del checkout">
        <div
          v-for="(step, i) in STEPS"
          :key="step.id"
          class="step-item"
          :class="{
            active:    currentStep === step.id,
            completed: completedSteps.has(step.id),
          }"
        >
          <span class="step-num">{{ i + 1 }}</span>
          <span class="step-name">{{ step.label }}</span>
          <span v-if="i < STEPS.length - 1" class="step-connector"></span>
        </div>
      </nav>

      <!-- Carrito vacío -->
      <div v-if="cart.isEmpty" class="empty-checkout">
        <span class="empty-sym">◈</span>
        <p>Tu carrito está vacío.</p>
        <router-link to="/catalogo" class="btn-back">EXPLORAR COLECCIÓN</router-link>
      </div>

      <div v-else class="checkout-body">

        <!-- ══════════════════════════════════════════
             PASO 1 — DATOS PERSONALES
        ═══════════════════════════════════════════ -->
        <Transition name="step-fade" mode="out-in">
          <section v-if="currentStep === 'datos'" key="datos" class="step-section">
            <h2 class="step-title">Datos personales</h2>

            <div class="form-grid">
              <div class="field-group full">
                <BaseInput
                  v-model="form.nombre"
                  label="Nombre completo *"
                  placeholder="TU NOMBRE"
                  :error="errors.nombre"
                />
              </div>

              <div class="field-group">
                <BaseInput
                  v-model="form.email"
                  label="Email *"
                  type="email"
                  placeholder="TU@EMAIL.COM"
                  :error="errors.email"
                />
              </div>

              <div class="field-group">
                <BaseInput
                  v-model="form.telefono"
                  label="Teléfono *"
                  type="tel"
                  placeholder="+54 11 XXXX XXXX"
                  :error="errors.telefono"
                />
              </div>

              <div class="field-group full">
                <BaseInput
                  v-model="form.notasAdicionales"
                  label="Notas adicionales"
                  type="textarea"
                  placeholder="INSTRUCCIONES ESPECIALES, DEDICATORIAS..."
                  :rows="3"
                />
              </div>
            </div>

            <div class="step-actions">
              <router-link to="/carrito" class="btn-outline">← Volver al carrito</router-link>
              <button class="btn-primary" @click="goToStep('envio')">
                Continuar → Envío
              </button>
            </div>
          </section>

          <!-- ══════════════════════════════════════════
               PASO 2 — OPCIONES DE ENVÍO
          ═══════════════════════════════════════════ -->
          <section v-else-if="currentStep === 'envio'" key="envio" class="step-section">
            <h2 class="step-title">Opciones de envío</h2>

            <div class="shipping-options">
              <label
                v-for="opt in SHIPPING_OPTIONS"
                :key="opt.id"
                class="shipping-option"
                :class="{ selected: form.shippingOption === opt.id }"
              >
                <input
                  v-model="form.shippingOption"
                  type="radio"
                  :value="opt.id"
                  class="sr-only"
                />
                <div class="opt-radio">
                  <span v-if="form.shippingOption === opt.id" class="opt-radio-inner">◆</span>
                </div>
                <div class="opt-info">
                  <p class="opt-name">{{ opt.name }}</p>
                  <p class="opt-desc">{{ opt.description }}</p>
                </div>
                <div class="opt-price">
                  <span v-if="opt.price === 0" class="free-tag">GRATIS</span>
                  <span v-else>$ {{ fmt(opt.price) }}</span>
                </div>
              </label>
            </div>

            <!-- Dirección (solo envío a domicilio) -->
            <Transition name="step-fade">
              <div v-if="form.shippingOption !== 'pickup'" class="address-form">
                <h3 class="address-title">Dirección de entrega</h3>
                <div class="form-grid">
                  <div class="field-group full">
                    <BaseInput
                      v-model="form.address.calle"
                      label="Calle y número *"
                      placeholder="AV. CORRIENTES 1234"
                      :error="errors.calle"
                    />
                  </div>
                  <div class="field-group">
                    <BaseInput
                      v-model="form.address.ciudad"
                      label="Ciudad *"
                      placeholder="BUENOS AIRES"
                      :error="errors.ciudad"
                    />
                  </div>
                  <div class="field-group">
                    <BaseInput
                      v-model="form.address.cp"
                      label="Código postal"
                      placeholder="C1000"
                    />
                  </div>
                </div>
              </div>
            </Transition>

            <div class="step-actions">
              <button class="btn-outline" @click="currentStep = 'datos'">← Datos</button>
              <button class="btn-primary" @click="goToStep('resumen')">
                Continuar → Resumen
              </button>
            </div>
          </section>

          <!-- ══════════════════════════════════════════
               PASO 3 — RESUMEN + CONFIRMAR
          ═══════════════════════════════════════════ -->
          <section v-else-if="currentStep === 'resumen'" key="resumen" class="step-section">
            <h2 class="step-title">Resumen del pedido</h2>

            <!-- Datos personales resumen -->
            <div class="summary-block">
              <div class="summary-block-header">
                <span class="block-title">Datos personales</span>
                <button class="edit-btn" @click="currentStep = 'datos'">Editar</button>
              </div>
              <p class="summary-text">{{ form.nombre }}</p>
              <p class="summary-text muted">{{ form.email }} · {{ form.telefono }}</p>
            </div>

            <!-- Envío resumen -->
            <div class="summary-block">
              <div class="summary-block-header">
                <span class="block-title">Envío</span>
                <button class="edit-btn" @click="currentStep = 'envio'">Editar</button>
              </div>
              <p class="summary-text">{{ selectedShippingOption?.name }}</p>
              <p v-if="form.shippingOption !== 'pickup'" class="summary-text muted">
                {{ form.address.calle }}, {{ form.address.ciudad }}
              </p>
            </div>

            <!-- Items -->
            <div class="summary-block">
              <div class="summary-block-header">
                <span class="block-title">Piezas seleccionadas</span>
                <router-link to="/carrito" class="edit-btn">Editar carrito</router-link>
              </div>

              <div v-for="item in cart.items" :key="item.lineId" class="order-line">
                <div class="order-line-img">
                  <img :src="item.imagen" :alt="item.nombre" />
                </div>
                <div class="order-line-info">
                  <p class="ol-name">{{ item.nombre }}</p>
                  <p class="ol-meta">
                    <span v-if="item.talla">Talle: {{ item.talla }}</span>
                    <span v-if="item.talla && item.color"> · </span>
                    <span v-if="item.color">
                      Color:
                      <span class="ol-color" :style="{ backgroundColor: item.color }"></span>
                    </span>
                    <span> · x{{ item.cantidad }}</span>
                  </p>
                </div>
                <p class="ol-price">$ {{ fmt(item.precio * item.cantidad) }}</p>
              </div>
            </div>

            <!-- Totales -->
            <div class="summary-block totals">
              <div class="total-line">
                <span>Subtotal</span>
                <span>$ {{ fmt(cart.subtotal) }}</span>
              </div>
              <div class="total-line">
                <span>Envío</span>
                <span :class="{ 'free-text': shippingTotal === 0 }">
                  {{ shippingTotal === 0 ? 'GRATIS' : `$ ${fmt(shippingTotal)}` }}
                </span>
              </div>
              <div v-if="cart.discountAmount > 0" class="total-line discount">
                <span>Descuento ({{ cart.promoCode }})</span>
                <span>− $ {{ fmt(cart.discountAmount) }}</span>
              </div>
              <div class="total-line grand-total">
                <span>TOTAL</span>
                <span>$ {{ fmt(finalTotal) }}</span>
              </div>
            </div>

            <!-- Error API -->
            <p v-if="submitError" class="submit-error">{{ submitError }}</p>

            <div class="step-actions">
              <button class="btn-outline" @click="currentStep = 'envio'">← Envío</button>
              <button
                class="btn-primary btn-confirm"
                :disabled="submitting"
                @click="handleSubmit"
              >
                <span v-if="submitting" class="loading-dots">
                  <span></span><span></span><span></span>
                </span>
                <span v-else>CONFIRMAR PEDIDO</span>
              </button>
            </div>
          </section>

          <!-- ══════════════════════════════════════════
               PASO 4 — CONFIRMACIÓN
          ═══════════════════════════════════════════ -->
          <section v-else-if="currentStep === 'confirmacion'" key="confirmacion" class="step-section confirmation">
            <div class="confirmation-icon">◈</div>
            <h2 class="confirmation-title">¡PEDIDO REALIZADO!</h2>
            <p class="confirmation-sub">
              Te confirmamos la recepción de tu pedido. Nos pondremos en contacto a
              <strong>{{ form.email }}</strong> para coordinar los detalles.
            </p>
            <p v-if="orderId" class="order-id">
              ID de pedido: <strong>#{{ orderId }}</strong>
            </p>
            <div class="confirmation-actions">
              <router-link to="/catalogo" class="btn-outline">Seguir comprando</router-link>
              <router-link to="/" class="btn-primary">IR AL INICIO</router-link>
            </div>
          </section>
        </Transition>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import StarsBackground from '@/components/tienda/common/StarBackground.vue';
import BaseInput       from '@/components/ui/BaseInput.vue';

import { useCartStore }  from '@/stores/useCartStore';
import { pedidosApi }    from '@/services/tienda/api';

const router = useRouter();
const cart   = useCartStore();

// ── Pasos ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'datos',        label: 'Datos' },
  { id: 'envio',        label: 'Envío' },
  { id: 'resumen',      label: 'Resumen' },
  { id: 'confirmacion', label: 'Confirmación' },
] as const;

type StepId = typeof STEPS[number]['id'];

const currentStep    = ref<StepId>('datos');
const completedSteps = ref(new Set<StepId>());

// ── Opciones de envío ────────────────────────────────────────────────────────
const SHIPPING_OPTIONS = [
  {
    id: 'pickup',
    name: 'Retiro en punto de entrega — CABA',
    description: 'Coordinar punto de entrega dentro de Capital Federal.',
    price: 0,
  },
  {
    id: 'andreani',
    name: 'Envío Andreani — Domicilio',
    description: '3 a 5 días hábiles según destino.',
    price: 5_000,
  },
  {
    id: 'correo',
    name: 'Correo Argentino — Domicilio',
    description: '5 a 8 días hábiles. Opción más económica.',
    price: 3_500,
  },
] as const;

type ShippingId = typeof SHIPPING_OPTIONS[number]['id'];

// ── Formulario ────────────────────────────────────────────────────────────────
const form = reactive({
  nombre:          '',
  email:           '',
  telefono:        '',
  notasAdicionales:'',
  shippingOption:  'pickup' as ShippingId,
  address: {
    calle:  '',
    ciudad: '',
    cp:     '',
  },
});

const errors = reactive<Record<string, string>>({});

// ── Estado de envío ───────────────────────────────────────────────────────────
const submitting  = ref(false);
const submitError = ref('');
const orderId     = ref<string | null>(null);

// ── Computadas ────────────────────────────────────────────────────────────────
const selectedShippingOption = computed(() =>
  SHIPPING_OPTIONS.find(o => o.id === form.shippingOption),
);

const shippingTotal = computed(() => {
  // Envío gratis si el subtotal supera el threshold
  if (cart.subtotal >= 100_000) return 0;
  return selectedShippingOption.value?.price ?? 0;
});

const finalTotal = computed(() =>
  Math.max(0, cart.subtotal + shippingTotal.value - cart.discountAmount),
);

// ── Formato ───────────────────────────────────────────────────────────────────
const fmt = (v: number) =>
  new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(v);

// ── Validación ────────────────────────────────────────────────────────────────
const validateDatos = (): boolean => {
  Object.keys(errors).forEach(k => delete errors[k]);
  let valid = true;

  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es requerido.'; valid = false;
  }

  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Ingresá un email válido.'; valid = false;
  }

  if (!form.telefono.trim() || form.telefono.trim().length < 8) {
    errors.telefono = 'Ingresá un teléfono válido.'; valid = false;
  }

  return valid;
};

const validateEnvio = (): boolean => {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (form.shippingOption === 'pickup') return true;

  let valid = true;
  if (!form.address.calle.trim()) {
    errors.calle = 'La dirección es requerida.'; valid = false;
  }
  if (!form.address.ciudad.trim()) {
    errors.ciudad = 'La ciudad es requerida.'; valid = false;
  }
  return valid;
};

// ── Navegación de pasos ───────────────────────────────────────────────────────
const goToStep = (next: StepId) => {
  if (currentStep.value === 'datos' && !validateDatos()) return;
  if (currentStep.value === 'envio' && !validateEnvio()) return;

  completedSteps.value.add(currentStep.value);
  currentStep.value = next;
};

// ── Submit ─────────────────────────────────────────────────────────────────────
const handleSubmit = async () => {
  if (submitting.value) return;

  submitError.value = '';
  submitting.value  = true;

  try {
    // Enviar un pedido por cada línea del carrito.
    // Cuando el backend soporte multi-línea, esto se refactoriza a un solo call.
    const results = await Promise.all(
      cart.items.map(item =>
        pedidosApi.create({
          nombre:           form.nombre,
          email:            form.email,
          telefono:         form.telefono,
          productoId:       item.productoId,
          talla:            item.talla ?? 'Única',
          color:            item.color ?? '',
          cantidad:         item.cantidad,
          notasAdicionales: form.notasAdicionales || undefined,
        }),
      ),
    );

    orderId.value = results[0]?.id ?? null;

    completedSteps.value.add('resumen');
    currentStep.value = 'confirmacion';

    // Limpiar carrito tras confirmación
    cart.clear();

  } catch (err) {
    submitError.value = err instanceof Error
      ? err.message
      : 'Ocurrió un error al procesar el pedido. Intentá nuevamente.';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
@import '@/assets/css/views/checkout.css';
</style>