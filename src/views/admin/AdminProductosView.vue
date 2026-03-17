<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

import { useAdminStore }          from '@/stores/useAdminStore'
import { useAdminProductosStore } from '@/stores/admin/adminProductosStore'
import { adminProductoService }   from '@/services/admin/adminProductoService'
import TablaProductos             from '@/components/admin/TablaProductos.vue'
import type { Product }           from '@/types/producto.types'

// ── Constantes ────────────────────────────────────────────────────────────────

const TIPOS  = ['Remera', 'Buzo', 'Pantalón'] as const
const TALLES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const

const TIPO_A_CATEGORIA_ID: Record<string, number> = {
  'Remera':   1,
  'Buzo':     2,
  'Pantalón': 3,
}

type Tipo  = typeof TIPOS[number]
type Talle = typeof TALLES[number]
type Mode  = 'list' | 'create' | 'edit'

// ── Stores ────────────────────────────────────────────────────────────────────

const adminStore    = useAdminStore()
const productosStore = useAdminProductosStore()

// ── Estado de la vista ────────────────────────────────────────────────────────

const mode           = ref<Mode>('list')
const editingProduct = ref<Product | null>(null)

// ── Estado del formulario ─────────────────────────────────────────────────────

interface ProductForm {
  nombre:      string
  precio:      number | ''
  descripcion: string
  tipo:        Tipo | ''
  talles:      Talle[]
  imagen:      File | null
}

const form = reactive<ProductForm>({
  nombre:      '',
  precio:      '',
  descripcion: '',
  tipo:        '',
  talles:      [],
  imagen:      null,
})

const imagePreview = ref<string | null>(null)
const loading      = ref(false)
const successMsg   = ref('')
const errorMsg     = ref('')

// ── Ciclo de vida ─────────────────────────────────────────────────────────────

onMounted(() => productosStore.fetchProducts())

// ── Navegación entre modos ────────────────────────────────────────────────────

function openCreate() {
  resetForm()
  editingProduct.value = null
  mode.value           = 'create'
}

function openEdit(product: Product) {
  resetForm()
  editingProduct.value = product

  form.nombre      = product.nombre ?? ''
  form.precio      = product.precio ?? ''
  form.descripcion = product.descripcion ?? ''
  form.talles      = (product.tallas ?? []) as Talle[]

  // Inferir "tipo" desde el nombre de la categoría del backend
  const cat = (product.categoria ?? '').toLowerCase()
  if      (cat.includes('remera'))                                form.tipo = 'Remera'
  else if (cat.includes('buzo'))                                  form.tipo = 'Buzo'
  else if (cat.includes('pantalon') || cat.includes('pantalón'))  form.tipo = 'Pantalón'
  else                                                            form.tipo = ''

  imagePreview.value = product.imagen ?? null
  mode.value         = 'edit'
}

function closeForm() {
  mode.value           = 'list'
  editingProduct.value = null
  resetForm()
}

// ── Helpers del formulario ────────────────────────────────────────────────────

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] ?? null
  form.imagen        = file
  imagePreview.value = file ? URL.createObjectURL(file) : null
}

function toggleTalle(talle: Talle) {
  const idx = form.talles.indexOf(talle)
  if (idx === -1) form.talles.push(talle)
  else            form.talles.splice(idx, 1)
}

function resetForm() {
  form.nombre      = ''
  form.precio      = ''
  form.descripcion = ''
  form.tipo        = ''
  form.talles      = []
  form.imagen      = null
  imagePreview.value = null
  successMsg.value   = ''
  errorMsg.value     = ''
  const fileInput = document.getElementById('imagen') as HTMLInputElement | null
  if (fileInput) fileInput.value = ''
}

// ── Validación compartida ─────────────────────────────────────────────────────

function validate(requireImagen: boolean): boolean {
  errorMsg.value = ''
  if (!form.tipo)                             { errorMsg.value = 'Seleccioná un tipo de producto.'; return false }
  if (!form.talles.length)                    { errorMsg.value = 'Seleccioná al menos un talle.';  return false }
  if (!form.precio || Number(form.precio) <= 0) { errorMsg.value = 'El precio debe ser mayor a 0.'; return false }
  if (requireImagen && !form.imagen)          { errorMsg.value = 'Seleccioná una imagen para el producto.'; return false }
  return true
}

// ── Crear producto ────────────────────────────────────────────────────────────

async function handleSubmit() {
  if (!validate(true)) return

  loading.value = true
  try {
    const token = adminStore.token!
    await adminProductoService.create(token, {
      nombre:      form.nombre,
      descripcion: form.descripcion,
      precio:      Number(form.precio),
      categoriaId: TIPO_A_CATEGORIA_ID[form.tipo] ?? 1,
      nuevo:       false,
      tallas:      [...form.talles],
      imagen:      form.imagen!,
    })

    successMsg.value = `Producto "${form.nombre}" creado con éxito.`
    resetForm()
    await productosStore.fetchProducts()

    // Volver a la lista tras un breve instante para que el usuario vea el mensaje
    setTimeout(() => { mode.value = 'list' }, 1500)
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

// ── Editar producto ───────────────────────────────────────────────────────────

async function handleUpdate() {
  if (!validate(false)) return

  loading.value = true
  try {
    const token = adminStore.token!
    const id    = String(editingProduct.value!.id)

    // Conservar las imágenes actuales del producto (el PUT no acepta archivo)
    const currentImages =
      editingProduct.value!.imagenes?.length
        ? editingProduct.value!.imagenes
        : editingProduct.value!.imagen
          ? [editingProduct.value!.imagen]
          : []

    await adminProductoService.update(token, id, {
      nombre:      form.nombre,
      descripcion: form.descripcion,
      precio:      Number(form.precio),
      categoriaId: TIPO_A_CATEGORIA_ID[form.tipo] ?? 1,
      nuevo:       editingProduct.value!.nuevo ?? false,
      tallas:      [...form.talles],
      imagenUrls:  currentImages,
    })

    successMsg.value = 'Producto actualizado correctamente.'
    await productosStore.fetchProducts()
    setTimeout(() => { mode.value = 'list' }, 1200)
  } catch (e) {
    errorMsg.value = e instanceof Error ? e.message : 'No se pudo conectar con el servidor.'
  } finally {
    loading.value = false
  }
}

// ── Eliminar producto ─────────────────────────────────────────────────────────

async function handleDelete(id: string) {
  try {
    await productosStore.removeProduct(id)
  } catch {
    // Si falla, restaurar el estado correcto volviendo a hacer fetch
    await productosStore.fetchProducts()
  }
}
</script>

<template>
  <div :class="['admin-productos', { 'admin-productos--wide': mode === 'list' }]">

    <!-- ══ MODO: LISTA ════════════════════════════════════════════════════════ -->
    <template v-if="mode === 'list'">
      <div class="page-header page-header--row">
        <div>
          <h1>Productos</h1>
          <p>{{ productosStore.total }} producto{{ productosStore.total !== 1 ? 's' : '' }} en el catálogo</p>
        </div>
        <button class="btn-primary" @click="openCreate">+ Nuevo Producto</button>
      </div>

      <div v-if="productosStore.error" class="alert alert-error" role="alert">
        {{ productosStore.error }}
      </div>

      <TablaProductos
        :products="productosStore.products"
        :loading="productosStore.loading"
        @edit="openEdit"
        @delete="handleDelete"
      />
    </template>

    <!-- ══ MODO: FORMULARIO (CREAR / EDITAR) ══════════════════════════════════ -->
    <template v-else>
      <!-- Cabecera del formulario -->
      <div class="page-header">
        <button class="btn-back" @click="closeForm">← Volver</button>
        <h1>{{ mode === 'edit' ? 'Editar Producto' : 'Nuevo Producto' }}</h1>
        <p>
          {{
            mode === 'edit'
              ? 'Modificá los datos del producto seleccionado.'
              : 'Completá el formulario para agregar un producto al catálogo.'
          }}
        </p>
      </div>

      <form
        class="product-form"
        @submit.prevent="mode === 'edit' ? handleUpdate() : handleSubmit()"
      >
        <!-- ── Nombre + Precio ──────────────────────────────────────── -->
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

        <!-- ── Descripción ─────────────────────────────────────────── -->
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

        <!-- ── Tipo / Categoría ────────────────────────────────────── -->
        <div class="form-group">
          <label for="tipo">Tipo <span class="required">*</span></label>
          <select id="tipo" v-model="form.tipo" required>
            <option value="" disabled>Seleccioná un tipo...</option>
            <option v-for="t in TIPOS" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>

        <!-- ── Talles ──────────────────────────────────────────────── -->
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

        <!-- ── Imagen (solo en create) ─────────────────────────────── -->
        <div v-if="mode === 'create'" class="form-group">
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
              <small>JPG, PNG, WEBP — máx 10 MB</small>
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

        <!-- ── Imagen actual (edit — solo lectura) ─────────────────── -->
        <div v-else class="form-group">
          <label>Imagen actual</label>
          <div class="file-upload-area has-image" style="cursor: default;">
            <img :src="imagePreview ?? ''" alt="Imagen actual" class="image-preview" />
          </div>
          <small class="form-hint">Para reemplazar la imagen, eliminá el producto y volvé a crearlo.</small>
        </div>

        <!-- ── Feedback ────────────────────────────────────────────── -->
        <div v-if="errorMsg"   class="alert alert-error"   role="alert">{{ errorMsg }}</div>
        <div v-if="successMsg" class="alert alert-success" role="status">{{ successMsg }}</div>

        <!-- ── Acciones ────────────────────────────────────────────── -->
        <div class="form-actions">
          <button
            type="button"
            class="btn-secondary"
            :disabled="loading"
            @click="closeForm"
          >
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="loading" class="spinner" />
            {{ loading ? 'Guardando...' : (mode === 'edit' ? 'Guardar cambios' : 'Crear Producto') }}
          </button>
        </div>
      </form>
    </template>

  </div>
</template>

<style scoped>
@import '@/assets/css/views/admin-productos.css';

/* ── Ancho extendido en modo lista (tabla ocupa más espacio) ────────────── */
.admin-productos--wide {
  max-width: 1100px;
}

/* ── Cabecera con botón a la derecha (modo lista) ───────────────────────── */
.page-header--row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

/* ── Botón "← Volver" (modo formulario) ────────────────────────────────── */
.btn-back {
  background: transparent;
  border: none;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 12px;
  display: block;
  transition: color 0.15s;
}

.btn-back:hover {
  color: #DAA520;
}

/* ── Nota informativa debajo del campo imagen en edición ────────────────── */
.form-hint {
  font-size: 12px;
  color: #444;
  margin-top: 6px;
  display: block;
}
</style>
