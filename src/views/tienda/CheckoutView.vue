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
/* ========================
   BASE
======================== */
.checkout-container {
  position: relative;
  min-height: 100vh;
  background: #000;
  overflow-x: hidden;
}

.checkout-content {
  position: relative;
  z-index: 1;
  max-width: 860px;
  margin: 0 auto;
  padding: 8rem 2rem 6rem;
}

/* ========================
   HEADER
======================== */
.checkout-header { text-align: center; margin-bottom: 3rem; }

.header-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.orn-line {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold, #daa520), transparent);
}

.orn-sym { color: var(--gold, #daa520); font-size: 0.7rem; }

.checkout-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  letter-spacing: 0.3em;
  color: #fff;
  text-transform: uppercase;
  margin: 0 0 0.6rem;
}

.checkout-subtitle {
  font-size: 0.82rem;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
}

/* ========================
   PASOS NAV
======================== */
.steps-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 3.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.step-item.active  { color: #fff; }
.step-item.completed { color: var(--gold, #daa520); }

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid currentColor;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.step-item.active .step-num  { background: var(--gold, #daa520); border-color: var(--gold, #daa520); color: #000; }
.step-item.completed .step-num { background: rgba(218, 165, 32, 0.15); }

.step-name { white-space: nowrap; }

.step-connector {
  width: 40px;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 0.8rem;
  flex-shrink: 0;
}

/* ========================
   EMPTY
======================== */
.empty-checkout {
  text-align: center;
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
}

.empty-sym { font-size: 3rem; color: var(--gold, #daa520); opacity: 0.2; }

.empty-checkout p { font-size: 0.85rem; color: rgba(255, 255, 255, 0.4); letter-spacing: 0.1em; text-transform: uppercase; }

/* ========================
   STEP SECTION
======================== */
.step-section { display: flex; flex-direction: column; gap: 2rem; }

.step-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--gold, #daa520);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(218, 165, 32, 0.15);
}

/* ========================
   FORM GRID
======================== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.field-group.full { grid-column: 1 / -1; }

/* ========================
   SHIPPING OPTIONS
======================== */
.shipping-options { display: flex; flex-direction: column; gap: 0.8rem; }

.shipping-option {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.shipping-option:hover { border-color: rgba(218, 165, 32, 0.25); }
.shipping-option.selected { border-color: rgba(218, 165, 32, 0.5); background: rgba(218, 165, 32, 0.04); }

.opt-radio {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.2s ease;
}

.shipping-option.selected .opt-radio { border-color: var(--gold, #daa520); }

.opt-radio-inner { font-size: 0.55rem; color: var(--gold, #daa520); }

.opt-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.opt-desc { font-size: 0.78rem; color: rgba(255, 255, 255, 0.35); margin-top: 0.2rem; }

.opt-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gold, #daa520);
  white-space: nowrap;
}

.free-tag {
  font-size: 0.72rem;
  color: #4ade80;
  font-weight: 700;
  letter-spacing: 0.1em;
}

/* Address form */
.address-form {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
}

.address-title {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  margin-bottom: 1.2rem;
}

/* ========================
   SUMMARY BLOCKS
======================== */
.summary-block {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 4px;
  padding: 1.5rem;
}

.summary-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.block-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--gold, #daa520);
  text-transform: uppercase;
}

.edit-btn {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.2s ease;
  text-decoration: none;
}

.edit-btn:hover { color: rgba(218, 165, 32, 0.8); }

.summary-text { font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin: 0; line-height: 1.5; }
.summary-text.muted { font-size: 0.82rem; color: rgba(255, 255, 255, 0.35); }

/* Order lines */
.order-line {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.order-line:last-child { border-bottom: none; }

.order-line-img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  flex-shrink: 0;
}

.order-line-img img { width: 100%; height: 100%; object-fit: cover; }

.ol-name {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ol-meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  flex-wrap: wrap;
}

.ol-color {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  vertical-align: middle;
}

.ol-price {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--gold, #daa520);
  white-space: nowrap;
}

/* Totals */
.summary-block.totals { border-color: rgba(218, 165, 32, 0.15); }

.total-line {
  display: flex;
  justify-content: space-between;
  padding: 0.7rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.total-line:last-child { border-bottom: none; }

.total-line .free-text { color: #4ade80; font-weight: 600; }
.total-line.discount   { color: #4ade80; }

.total-line.grand-total {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.total-line.grand-total span:last-child { color: var(--gold, #daa520); font-size: 1.4rem; }

/* ========================
   STEP ACTIONS
======================== */
.step-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  align-items: center;
  padding-top: 0.5rem;
}

/* Buttons */
.btn-primary,
.btn-outline,
.btn-back {
  padding: 1rem 2rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--gold, #daa520), #f5c842);
  color: #000;
  border: none;
}

.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(218, 165, 32, 0.3); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.5);
}

.btn-outline:hover { border-color: rgba(255, 255, 255, 0.3); color: #fff; }

.btn-back {
  background: linear-gradient(135deg, var(--gold, #daa520), #f5c842);
  color: #000;
  border: none;
}

.btn-confirm { min-width: 200px; }

/* Submit error */
.submit-error {
  font-size: 0.8rem;
  color: #dc2626;
  text-align: center;
  padding: 0.8rem 1rem;
  background: rgba(220, 38, 38, 0.06);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 4px;
}

/* Loading dots */
.loading-dots { display: flex; gap: 4px; align-items: center; }
.loading-dots span {
  width: 6px;
  height: 6px;
  background: #000;
  border-radius: 50%;
  animation: dotBounce 0.9s ease-in-out infinite;
}
.loading-dots span:nth-child(2) { animation-delay: 0.15s; }
.loading-dots span:nth-child(3) { animation-delay: 0.3s; }

@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(1); opacity: 0.6; }
  40% { transform: scale(1.4); opacity: 1; }
}

/* ========================
   CONFIRMACIÓN
======================== */
.confirmation {
  align-items: center;
  text-align: center;
  padding: 3rem 0;
}

.confirmation-icon {
  font-size: 5rem;
  color: var(--gold, #daa520);
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }

.confirmation-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  letter-spacing: 0.3em;
  color: var(--gold, #daa520);
  text-transform: uppercase;
}

.confirmation-sub {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.8;
  max-width: 500px;
}

.confirmation-sub strong { color: rgba(255, 255, 255, 0.8); }

.order-id {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
}

.order-id strong { color: rgba(218, 165, 32, 0.7); }

.confirmation-actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

/* ========================
   TRANSICIONES
======================== */
.step-fade-enter-active,
.step-fade-leave-active { transition: all 0.3s ease; }

.step-fade-enter-from,
.step-fade-leave-to { opacity: 0; transform: translateY(12px); }

/* ========================
   SCREENREADER only
======================== */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ========================
   RESPONSIVE
======================== */
@media (max-width: 640px) {
  .checkout-content { padding: 6rem 1rem 4rem; }

  .steps-nav { gap: 0; overflow-x: auto; padding-bottom: 0.5rem; }
  .step-name  { display: none; }
  .step-connector { width: 24px; margin: 0 0.4rem; }

  .form-grid { grid-template-columns: 1fr; }
  .field-group.full { grid-column: 1; }

  .step-actions { flex-direction: column; }
  .btn-primary,
  .btn-outline { width: 100%; }

  .shipping-option { grid-template-columns: 24px 1fr; }
  .opt-price { grid-column: 2; justify-self: end; }

  .order-line { grid-template-columns: 48px 1fr auto; }
  .order-line-img { width: 48px; height: 48px; }

  .confirmation-actions { flex-direction: column; width: 100%; }
}
</style>