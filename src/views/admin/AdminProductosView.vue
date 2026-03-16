<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAdminStore } from '@/stores/useAdminStore'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080/api'

const adminStore = useAdminStore()

const TIPOS = ['Remera', 'Buzo', 'Pantalón'] as const
const TALLES = ['S', 'M', 'L', 'XL'] as const

// IDs según el orden de inserción del seeder (Remeras=1, Buzos=2, Pantalones=3)
const TIPO_A_CATEGORIA_ID: Record<string, number> = {
  'Remera':   1,
  'Buzo':     2,
  'Pantalón': 3,
}

type Tipo = typeof TIPOS[number]
type Talle = typeof TALLES[number]

interface ProductForm {
  nombre: string
  precio: number | ''
  descripcion: string
  tipo: Tipo | ''
  talles: Talle[]
  imagen: File | null
}

const form = reactive<ProductForm>({
  nombre: '',
  precio: '',
  descripcion: '',
  tipo: '',
  talles: [],
  imagen: null,
})

const imagePreview = ref<string | null>(null)
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0] ?? null
  form.imagen = file
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
  } else {
    imagePreview.value = null
  }
}

function toggleTalle(talle: Talle) {
  const idx = form.talles.indexOf(talle)
  if (idx === -1) {
    form.talles.push(talle)
  } else {
    form.talles.splice(idx, 1)
  }
}

function resetForm() {
  form.nombre = ''
  form.precio = ''
  form.descripcion = ''
  form.tipo = ''
  form.talles = []
  form.imagen = null
  imagePreview.value = null
  // Limpiar el input de archivo
  const fileInput = document.getElementById('imagen') as HTMLInputElement | null
  if (fileInput) fileInput.value = ''
}

async function handleSubmit() {
  errorMsg.value = ''
  successMsg.value = ''

  if (!form.tipo) {
    errorMsg.value = 'Seleccioná un tipo de producto.'
    return
  }
  if (form.talles.length === 0) {
    errorMsg.value = 'Seleccioná al menos un talle.'
    return
  }
  if (!form.imagen) {
    errorMsg.value = 'Seleccioná una imagen para el producto.'
    return
  }
  if (!form.precio || Number(form.precio) <= 0) {
    errorMsg.value = 'El precio debe ser mayor a 0.'
    return
  }

  loading.value = true

  try {
    const token = adminStore.token
    if (!token) {
      errorMsg.value = 'No hay sesión activa. Volvé a iniciar sesión.'
      return
    }

    const payload = new FormData()
    payload.append('nombre', form.nombre)
    payload.append('precio', String(form.precio))
    payload.append('descripcion', form.descripcion)
    payload.append('categoriaId', String(TIPO_A_CATEGORIA_ID[form.tipo] ?? 0))
    form.talles.forEach(t => payload.append('tallas', t))
    payload.append('imagen', form.imagen)

    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        // No incluir Content-Type: FormData lo setea automáticamente con el boundary correcto
      },
      body: payload,
    })

    const json = await res.json()

    if (!res.ok || !json.success) {
      errorMsg.value = json.errors?.[0] ?? json.message ?? `Error ${res.status}`
      return
    }

    successMsg.value = `Producto "${form.nombre}" creado con éxito.`
    resetForm()
  } catch {
    errorMsg.value = 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-productos">
    <div class="page-header">
      <h1>Nuevo Producto</h1>
      <p>Completá el formulario para agregar un producto al catálogo.</p>
    </div>

    <form class="product-form" @submit.prevent="handleSubmit">

      <!-- ── Nombre ─────────────────────────────────────────── -->
      <div class="form-row">
        <div class="form-group">
          <label for="nombre">Nombre <span class="required">*</span></label>
          <input
            id="nombre"
            v-model="form.nombre"
            type="text"
            required
            placeholder="Ej: Remera Arcana"
          />
        </div>

        <!-- ── Precio ─────────────────────────────────────────── -->
        <div class="form-group">
          <label for="precio">Precio (ARS) <span class="required">*</span></label>
          <input
            id="precio"
            v-model="form.precio"
            type="number"
            required
            min="1"
            step="1"
            placeholder="Ej: 25000"
          />
        </div>
      </div>

      <!-- ── Descripción ─────────────────────────────────────── -->
      <div class="form-group">
        <label for="descripcion">Descripción <span class="required">*</span></label>
        <textarea
          id="descripcion"
          v-model="form.descripcion"
          required
          rows="4"
          placeholder="Descripción del producto..."
        />
      </div>

      <!-- ── Tipo ───────────────────────────────────────────── -->
      <div class="form-group">
        <label for="tipo">Tipo <span class="required">*</span></label>
        <select id="tipo" v-model="form.tipo" required>
          <option value="" disabled>Seleccioná un tipo...</option>
          <option v-for="t in TIPOS" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <!-- ── Talles ─────────────────────────────────────────── -->
      <div class="form-group">
        <label>Talles disponibles <span class="required">*</span></label>
        <div class="talles-group">
          <button
            v-for="talle in TALLES"
            :key="talle"
            type="button"
            class="talle-btn"
            :class="{ selected: form.talles.includes(talle) }"
            @click="toggleTalle(talle)"
          >
            {{ talle }}
          </button>
        </div>
      </div>

      <!-- ── Imagen ─────────────────────────────────────────── -->
      <div class="form-group">
        <label for="imagen">Imagen del producto <span class="required">*</span></label>
        <div class="file-upload-area" :class="{ 'has-image': imagePreview }">
          <input
            id="imagen"
            type="file"
            accept="image/*"
            class="file-input"
            @change="handleFileChange"
          />
          <div v-if="!imagePreview" class="file-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>Clic para seleccionar imagen</span>
            <small>JPG, PNG, WEBP — máx 5 MB</small>
          </div>
          <img v-else :src="imagePreview" alt="Preview" class="image-preview" />
        </div>
        <button
          v-if="imagePreview"
          type="button"
          class="remove-image-btn"
          @click="() => { form.imagen = null; imagePreview = null }"
        >
          Quitar imagen
        </button>
      </div>

      <!-- ── Feedback ───────────────────────────────────────── -->
      <div v-if="errorMsg" class="alert alert-error" role="alert">
        {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="alert alert-success" role="status">
        {{ successMsg }}
      </div>

      <!-- ── Acciones ───────────────────────────────────────── -->
      <div class="form-actions">
        <button type="button" class="btn-secondary" :disabled="loading" @click="resetForm">
          Limpiar
        </button>
        <button type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner" />
          {{ loading ? 'Guardando...' : 'Crear Producto' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.admin-productos {
  max-width: 760px;
}

.page-header {
  margin-bottom: 36px;
}

.page-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.page-header p {
  color: #666;
  font-size: 14px;
}

/* ── Form ───────────────────────────────────────────────── */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #aaa;
  letter-spacing: 0.4px;
}

.required {
  color: #DAA520;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: #111;
  border: 1px solid #222;
  border-radius: 8px;
  padding: 12px 16px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  font-family: inherit;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #444;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #DAA520;
}

.form-group select {
  cursor: pointer;
  appearance: auto;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

/* ── Talles ─────────────────────────────────────────────── */
.talles-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.talle-btn {
  width: 52px;
  height: 52px;
  border: 1px solid #222;
  border-radius: 8px;
  background: #111;
  color: #777;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.talle-btn:hover {
  border-color: #DAA520;
  color: #DAA520;
}

.talle-btn.selected {
  background: rgba(218, 165, 32, 0.12);
  border-color: #DAA520;
  color: #DAA520;
}

/* ── File upload ────────────────────────────────────────── */
.file-upload-area {
  position: relative;
  border: 2px dashed #222;
  border-radius: 10px;
  background: #111;
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
  overflow: hidden;
}

.file-upload-area:hover {
  border-color: #DAA520;
}

.file-upload-area.has-image {
  border-style: solid;
  border-color: #333;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.file-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #555;
  pointer-events: none;
}

.file-placeholder svg {
  width: 40px;
  height: 40px;
  color: #333;
}

.file-placeholder span {
  font-size: 14px;
  color: #777;
}

.file-placeholder small {
  font-size: 12px;
  color: #444;
}

.image-preview {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.remove-image-btn {
  align-self: flex-start;
  background: transparent;
  border: 1px solid #333;
  border-radius: 6px;
  color: #777;
  font-size: 12px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.remove-image-btn:hover {
  border-color: #f87171;
  color: #f87171;
}

/* ── Alerts ─────────────────────────────────────────────── */
.alert {
  padding: 14px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.alert-error {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #f87171;
}

.alert-success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
}

/* ── Actions ────────────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
}

.btn-primary {
  background: #DAA520;
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary:hover:not(:disabled) {
  background: #FFD700;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: transparent;
  color: #777;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #555;
  color: #ccc;
}

.btn-secondary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Responsive ─────────────────────────────────────────── */
@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
