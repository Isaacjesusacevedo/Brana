# BRANA — Documentación de Arquitectura Frontend

> Documentación integral de los componentes Vue 3 del proyecto BRANA, incluyendo su interacción con el router, store, composables, tipos y servicio de API.

---

## Índice

1. [Árbol del proyecto](#1-árbol-del-proyecto)
2. [Capas de la arquitectura](#2-capas-de-la-arquitectura)
3. [Sistema de tipos](#3-sistema-de-tipos)
4. [Router](#4-router)
5. [Store — useCartStore](#5-store--usecartstore)
6. [Composables](#6-composables)
7. [Servicio de API](#7-servicio-de-api)
8. [Componentes — ui/](#8-componentes--ui)
9. [Componentes — layout/](#9-componentes--layout)
10. [Componentes — product/](#10-componentes--product)
11. [Componentes — home/](#11-componentes--home)
12. [Mapa de dependencias entre capas](#12-mapa-de-dependencias-entre-capas)
13. [Estado general del proyecto](#13-estado-general-del-proyecto)
14. [Deudas técnicas pendientes](#14-deudas-técnicas-pendientes)

---

## 1. Árbol del proyecto

```
src/
├── main.ts                        ← Montaje de la app + Pinia
├── App.vue                        ← Shell raíz: Header + RouterView + Footer
│
├── router/
│   └── index.ts                   ← Vue Router (createWebHistory)
│
├── stores/
│   └── useCartStore.ts            ← Pinia store del carrito + watchCartStore()
│
├── composables/
│   ├── Usepricing.ts              ← fmt, discountPercent, hasDiscount, discountLabel
│   └── useNewsletter.ts           ← email, isSubmitting, message, hasError, subscribe()
│
├── services/
│   └── api.ts                     ← productosApi, categoriasApi, pedidosApi
│
├── types/
│   ├── product.ts                 ← Product, Category, FeaturedItem (fuente canónica)
│   ├── api-types.ts               ← Order, OrderStatus, User, Cart, Review
│   ├── carousel.ts                ← CarouselItem, CarouselMode, CarouselVariant
│   └── Index.ts                   ← Re-exporta todo (barrel)
│
├── components/
│   ├── ui/
│   │   ├── BaseButton.vue         ⚠️ Sin uso activo
│   │   ├── BaseInput.vue          ✅ CheckoutView, ProductsDetailView
│   │   ├── BaseModal.vue          ✅ HomeView, CatalogoView, CartView
│   │   └── StarBackground.vue     ✅ HomeView, CartView, CheckoutView, ProductsDetailView
│   │
│   ├── layout/
│   │   ├── Header.vue             ✅ App.vue (banner promo + NavBar)
│   │   ├── NavBar.vue             ✅ App.vue (via Header) — conectado a useCartStore
│   │   └── Footer.vue             ✅ App.vue — newsletter pendiente de useNewsletter
│   │
│   ├── product/
│   │   ├── CategorySection.vue    ✅ HomeView ×3
│   │   ├── ProductCard.vue        ⚠️ Sin uso activo (duplicado por ProductList)
│   │   ├── ProductList.vue        ✅ CatalogoView
│   │   ├── ProducQuickView.vue    ✅ HomeView, CatalogoView (dentro de BaseModal)
│   │   └── ProductFilter.vue      ❌ Archivo vacío
│   │
│   └── home/
│       ├── HomeHero.vue           ✅ HomeView
│       ├── HomePilares.vue        ✅ HomeView
│       ├── HomeFeatured.vue       ✅ HomeView
│       ├── HomeFusion.vue         ✅ HomeView
│       ├── HomePhilosophy.vue     ✅ HomeView
│       └── HomeNewletter.vue      ✅ HomeView  (typo: falta 's' en filename)
│
└── views/
    ├── home/HomeView.vue
    ├── cart/CatalogoView.vue
    ├── cart/CartView.vue
    ├── products/ProductsView.vue
    ├── products/ProductsDetailView.vue
    ├── checkout/CheckoutView.vue
    └── noticias/NoticiasView.vue
```

---

## 2. Capas de la arquitectura

El proyecto sigue una separación por capas donde cada nivel conoce solo a los niveles inferiores:

```
┌─────────────────────────────────────────────┐
│  Vistas (views/)                            │  ← Orquestan datos y eventos
├─────────────────────────────────────────────┤
│  Componentes (components/)                  │  ← Presentación + lógica local
├──────────────┬──────────────────────────────┤
│  Store       │  Composables                 │  ← Estado global / lógica reutilizable
│  (Pinia)     │  (composables/)              │
├──────────────┴──────────────────────────────┤
│  Servicio de API (services/api.ts)          │  ← Comunicación con backend .NET
├─────────────────────────────────────────────┤
│  Tipos (types/)                             │  ← Contratos de datos compartidos
└─────────────────────────────────────────────┘
```

**Regla de dependencia:** los componentes no llaman a `api.ts` directamente (excepto `HomeFeatured` que lo hace temporalmente como excepción pendiente de refactor). Las vistas son las responsables de obtener datos y pasarlos como props.

---

## 3. Sistema de tipos

### Fuente canónica: `src/types/product.ts`

Todos los componentes deben importar tipos desde aquí o desde el barrel `Index.ts`. Los imports desde `@/types/Index` son equivalentes — el barrel re-exporta todo.

```typescript
interface Product {
  id: number | string;
  nombre?: string;          // nombre del producto
  titulo?: string;          // alias — algunos endpoints devuelven titulo
  imagen: string;           // URL de imagen principal
  imagenes?: string[];      // galería completa
  precio?: number;
  precioAnterior?: number;  // si existe, hay descuento
  categoria?: string;
  nuevo?: boolean;
  colores?: string[];       // array de hex
  descripcion?: string;
  caracteristicas?: string[];
  stock?: number;           // undefined = sin dato del backend (componente asume disponible)
  tallas?: string[];        // undefined = usar fallback genérico ['XS','S','M','L','XL','XXL']
  ruta?: string;            // ruta Vue Router custom del producto
  badge?: string;           // texto custom del badge (undefined → usa 'NUEVO')
  size?: 'normal' | 'featured' | 'wide' | 'tall';
}

interface Category {
  id: number | string;
  slug: string;             // viene del backend, necesario para filtros de URL
  nombre: string;
  descripcion: string;
  icono: string;
  ruta?: string;
  productos: Product[];
}

interface FeaturedItem {    // subset de Product, usado en HomeFeatured
  id: number | string;
  imagen: string;
  titulo: string;
  categoria: string;
  nombre?: string;
  precio?: number;
  precioAnterior?: number;
  nuevo?: boolean;
  colores?: string[];
}
```

### Tipos de API: `src/types/api-types.ts`

```typescript
// Pedidos — coincide con OrderDto del backend .NET
type OrderStatus = 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'

interface Order {
  id: string;
  nombre: string; email: string; telefono: string;
  estado: OrderStatus;
  fechaPedido: string;
  talla: string; color: string; cantidad: number;
  notasAdicionales?: string;
  producto?: Product;
}

// Auth — preparado, no implementado
interface User { id, nombre, email, telefono?, avatar?, fechaRegistro? }
interface LoginCredentials { email: string; password: string }
interface LoginResponse { token: string; user: User }

// Carrito backend — preparado, no implementado (la app usa useCartStore local)
interface Cart { id, items: CartItem[], subtotal, total, cantidadItems? }

// Reviews — preparado, no implementado
interface Review { id, productoId, usuarioId, usuario?, calificacion, titulo?, comentario, verificado?, fecha }
```

### Tipos de carousel: `src/types/carousel.ts`

```typescript
interface CarouselItem {
  id: number | string;
  imagen: string;
  titulo?: string; nombre?: string; categoria?: string;
  precio?: number; precioAnterior?: number;
  nuevo?: boolean; colores?: string[];
  [key: string]: any;   // permite campos extra del backend
}

type CarouselMode    = 'circular' | 'sliding' | 'fade'
type CarouselVariant = 'hero' | 'category' | 'default'
```

> **Nota:** `CarouselItem` es funcionalmente casi idéntico a `Product`. Existe para que `HomeFeatured` no dependa de `Product` con todos sus campos opcionales, pero es candidato a unificación. Ver [Deudas técnicas](#14-deudas-técnicas-pendientes).

### Barrel: `src/types/Index.ts`

```typescript
export * from './carousel'
export * from './product'
export * from './api-types'
```

Permite importar cualquier tipo desde un único punto. Los imports nuevos deben apuntar a `@/types/product` (fuente canónica) o al barrel `@/types/Index`.

**Inconsistencia actual:** `CategorySection` y `ProductCard` importan desde `@/types/Index`, mientras que `ProductList` y `ProducQuickView` importan desde `@/types/product`. Ambas resuelven al mismo tipo — unificar en una próxima limpieza.

---

## 4. Router

**Archivo:** `src/router/index.ts`

**Estrategia:** `createWebHistory` con `import.meta.env.BASE_URL`. Todas las vistas excepto `HomeView` usan lazy loading (`() => import(...)`).

### Tabla de rutas

| Path | Name | Componente | Notas |
|---|---|---|---|
| `/` | `home` | `HomeView` | Carga estática (sin lazy) |
| `/catalogo` | `catalogo` | `CatalogoView` | Lazy |
| `/productos` | `productos` | `ProductsView` | Lazy |
| `/producto/:id` | `producto-detalle` | `ProductsDetailView` | Lazy · props: true |
| `/productos/:id` | — | → `producto-detalle` | Redirect de compatibilidad URL |
| `/categoria/:categoria` | — | → `catalogo?categoria=...` | Redirect dinámico con query |
| `/categoria/remeras` | — | → `catalogo?categoria=remeras` | Redirect específico |
| `/categoria/buzos` | — | → `catalogo?categoria=buzos` | Redirect específico |
| `/categoria/pantalones` | — | → `catalogo?categoria=pantalones` | Redirect específico |
| `/coleccion` | — | → `catalogo` | Vista no implementada |
| `/carrito` | `carrito` | `CartView` | Lazy |
| `/checkout` | `checkout` | `CheckoutView` | Lazy |
| `/noticias` | `noticias` | `NoticiasView` | Lazy |
| `/filosofia` | `filosofia` | → `home` | Ruta temporal |
| `/contacto` | `contacto` | → `home` | Ruta temporal |
| `/:pathMatch(.*)` | `not-found` | → `home` | Sin `NotFoundView` aún |

### scrollBehavior

```typescript
scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition           // volver atrás restaura posición
  if (to.hash)       return { el: to.hash, behavior: 'smooth' }  // anclas hash
  return             { top: 0, behavior: 'smooth' }              // default
}
```

### Impacto en componentes

**`Footer.vue`** — los links de SHOP a `/categoria/remeras`, `/categoria/buzos` y `/categoria/pantalones` funcionan por los redirects. El link a `/coleccion` redirige a `/catalogo`. Los links a `/about`, `/terminos`, `/privacidad`, `/envios`, `/faq` caen en el catchall y redirigen silenciosamente a home.

**`NavBar.vue`** — el link a `/contacto` activa el redirect temporal a home.

**`HomeFusion.vue`** — el CTA apunta a `/coleccion/fusion`, ruta que no existe. El router tiene `/coleccion` → `/catalogo`, pero no subpaths de `/coleccion`. Corregir pasando `ctaRoute="/catalogo"` desde HomeView o creando la ruta.

---

## 5. Store — useCartStore

**Archivo:** `src/stores/useCartStore.ts`

**Motor:** Pinia con persistencia manual vía `localStorage`. No requiere `pinia-plugin-persistedstate`.

### Tipo de ítem de línea

```typescript
interface CartLineItem {
  lineId:     string;       // `${productoId}__${talla ?? 'default'}__${color ?? 'default'}`
  productoId: number | string;
  nombre:     string;
  imagen:     string;
  precio:     number;
  categoria?: string;
  cantidad:   number;
  talla?:     string;
  color?:     string;
}
```

El `lineId` compuesto permite que el mismo producto con diferente talla o color sean líneas separadas.

### State

```typescript
items:          CartLineItem[]   // cargado desde localStorage al iniciar
promoCode:      string | null
discountAmount: number
```

### Getters

| Getter | Tipo | Descripción |
|---|---|---|
| `totalItems` | `number` | Suma de `cantidad` — usado por NavBar badge |
| `subtotal` | `number` | Suma de `precio × cantidad` |
| `shippingCost` | `number` | `0` si subtotal ≥ $100.000, sino $5.000 |
| `total` | `number` | `subtotal + shippingCost - discountAmount` (mínimo 0) |
| `isEmpty` | `boolean` | `items.length === 0` |

### Actions

**`addItem(product, cantidad, talla?, color?)`** — agrega o incrementa la línea existente (identificada por `lineId`).

**`removeItem(lineId)`** — elimina la línea.

**`updateQuantity(lineId, cantidad)`** — actualiza; si `cantidad ≤ 0` elimina la línea.

**`increment(lineId)` / `decrement(lineId)`** — ±1. `decrement` respeta mínimo de 1.

**`applyPromoCode(code)`** — valida contra mapa hardcodeado, devuelve `boolean`:

```typescript
const validCodes = { BRANA10: 10_000, ARCANA20: 20_000, TRIBU15: 15_000 }
```

**`removePromoCode()`** — resetea `promoCode` y `discountAmount`.

**`clear()`** — vacía el carrito completamente.

### Persistencia

`watchCartStore()` debe llamarse **una sola vez** desde `App.vue` o `main.ts`:

```typescript
// App.vue
import { watchCartStore } from '@/stores/useCartStore'
onMounted(() => watchCartStore())
```

Registra un `watch` profundo sobre el state completo y lo serializa en `localStorage('brana-cart')`. Falla silenciosamente si localStorage no está disponible (incógnito, storage lleno).

### Conexión con componentes

**`NavBar.vue`** — `computed(() => cartStore.totalItems)` para el badge rojo.

**`CartView.vue`** — consume todos los getters y llama a todas las actions de mutación.

**`ProducQuickView.vue`** — el padre (HomeView / CatalogoView) recibe el emit `@add-to-cart` y llama `cartStore.addItem()`.

---

## 6. Composables

### `usePricing` — `src/composables/Usepricing.ts`

Centraliza las utilidades de precios y descuentos. Reemplaza las copias duplicadas que existen en `CategorySection`, `ProductCard`, `ProductList` y `HomeFeatured`.

```typescript
const { fmt, discountPercent, hasDiscount, discountLabel } = usePricing()
```

| Función | Firma | Resultado ejemplo |
|---|---|---|
| `fmt` | `(value: number \| null \| undefined) → string` | `18500 → "$18.500"` · null → `"—"` |
| `discountPercent` | `(precio, precioAnterior) → number` | `(18500, 25000) → 26` |
| `hasDiscount` | `(precio, precioAnterior) → boolean` | `true` si `discountPercent > 0` |
| `discountLabel` | `(precio, precioAnterior) → string` | `"-26%"` o `""` |

**Diferencia con las copias inline:** el `fmt` del composable usa `style: 'currency', currency: 'ARS'` y devuelve `"$18.500"`. Las copias inline de los componentes solo usan `Intl.NumberFormat` sin prefijo y devuelven `"18.500"`. Al migrar, verificar el impacto visual del cambio de formato.

**Adopción actual:**
- ✅ `ProducQuickView.vue`
- ⏳ `CategorySection.vue`, `ProductList.vue`, `ProductCard.vue`, `HomeFeatured.vue` — copias inline pendientes

---

### `useNewsletter` — `src/composables/useNewsletter.ts`

Centraliza el estado y lógica de suscripción al newsletter para ser compartido entre `Footer.vue` y `HomeNewletter.vue`.

```typescript
const { email, isSubmitting, message, hasError, subscribe } = useNewsletter()
```

| Ref | Tipo | Descripción |
|---|---|---|
| `email` | `ref<string>` | Input del usuario, bindeable con `v-model` |
| `isSubmitting` | `ref<boolean>` | `true` durante el envío |
| `message` | `ref<string>` | Mensaje de resultado, se limpia automáticamente a los 4s |
| `hasError` | `ref<boolean>` | `true` si el último intento falló |

**`subscribe(emailInput?)`** — usa el argumento si se pasa, sino usa `email.value`. Tiene `try/catch` real: en caso de error de API establece `hasError = true` y muestra mensaje de error. Actualmente simula latencia con `setTimeout(600ms)` mientras el endpoint no está disponible.

**Adopción actual:**
- ✅ Composable creado
- ⏳ `HomeNewletter.vue` — estado local propio (no usa el composable)
- ⏳ `Footer.vue` — estado local propio (no usa el composable)

Mientras no se adopte, existen 3 implementaciones paralelas de newsletter en el proyecto.

---

## 7. Servicio de API

**Archivo:** `src/services/api.ts`

**Backend:** .NET API REST. URL base desde `import.meta.env.VITE_API_URL` (fallback: `http://localhost:5000/api`).

### Protocolo de respuesta

```typescript
interface ApiResponse<T> { success: boolean; data: T; message?: string; errors?: string[] }
```

El helper interno `apiFetch<T>()` desempaqueta `json.data` y lanza error si `!res.ok || !json.success`.

### `productosApi`

```typescript
// Lista paginada con filtros — para CatalogoView
getAll(params?: ProductQueryParams): Promise<PagedResponse<Product>>

// Destacados — para HomeFeatured (actualmente lo llama directamente)
getFeatured(limit?: number): Promise<Product[]>

// Detalle — para ProductsDetailView
getById(id: string | number): Promise<Product>
```

**`ProductQueryParams`:** `categoria`, `search`, `minPrecio`, `maxPrecio`, `soloNuevos`, `orderBy ('nombre'|'precio'|'nuevo')`, `desc`, `page`, `pageSize`.

**`PagedResponse<T>`:** `items`, `total`, `page`, `pageSize`, `totalPages`, `hasNext`, `hasPrev`.

### `categoriasApi`

```typescript
// Las 3 categorías con productos — reemplaza el reactive hardcodeado de HomeView
getAll(): Promise<Category[]>

// Una categoría paginada por slug — para filtros de CatalogoView
getBySlug(slug: string, params?: ProductQueryParams): Promise<Category>
```

### `pedidosApi`

```typescript
// Crear pedido — reemplaza el alert() en HomeView.handleAddToCart
create(payload: OrderCreatePayload): Promise<{ id: string; message: string }>

// Consultar estado
getById(id: string): Promise<Order>
```

**`OrderCreatePayload`:** `nombre`, `email`, `telefono`, `productoId`, `talla`, `color`, `cantidad`, `notasAdicionales?`.

### Migración pendiente de HomeView

`HomeView.vue` actualmente usa ~200 líneas de datos hardcodeados. El patrón de migración está documentado en `api.ts`:

```typescript
// onMounted en HomeView
const [featured, allCats] = await Promise.all([
  productosApi.getFeatured(6),
  categoriasApi.getAll(),
])
piezasDestacadas.value = featured
categorias.value       = allCats

// En el template:
// ANTES: :category="categorias.remeras"
// DESPUÉS: :category="categorias.find(c => c.slug === 'remeras')"
```

---

## 8. Componentes — ui/

### `BaseButton.vue`

Botón polimórfico (`<button>` / `<a>`). **Props:** `variant ('primary'|'secondary'|'outline')`, `size ('sm'|'md'|'lg')`, `tag ('button'|'a')`, `arrow (boolean)`, `href`, `target`, `rel`. **Emits:** `click(Event)`.

Variante `primary`: gradient oro, texto negro. `secondary`: borde dorado, texto dorado. `outline`: borde blanco opaco, texto blanco. Todas con `translateY(-3px)` en hover. Efecto ripple mediante pseudo-elemento `::before` que expande de 0 a 300px en hover.

**Estado:** ⚠️ Sin uso activo. Las vistas tienen botones inline con estilos propios. Adoptar `BaseButton` eliminaría al menos 3 variantes visuales duplicadas.

---

### `BaseInput.vue`

Input y textarea unificados. **Props:** `modelValue`, `label`, `placeholder`, `type`, `prefixIcon`, `suffixIcon`, `clearable`, `disabled`, `readonly`, `error`, `hint`, `autocomplete`, `rows`, `variant ('default'|'ghost'|'filled')`, `size`. **Emits:** `update:modelValue`, `blur`, `clear`, `enter`.

**`inheritAttrs: false`** — atributos extra van al `<input>` / `<textarea>` via `v-bind="$attrs"`.

**`inputId`** — generado con `getCurrentInstance()?.uid` (id interno único de Vue por instancia). Estable en re-renders y seguro en SSR.

**Jerarquía del ícono derecho:** `clearable` activo > `type === 'password'` (toggle ◉/◎) > `suffixIcon` genérico.

**Label flotante:** `position: absolute` con transición `top + font-size`. Para textarea, usa `:has(textarea)` para ajustar el `top` inicial.

**Línea de foco animada:** `width: 0 → 100%` en 300ms al enfocar. Roja permanente cuando hay `error`.

**Usado en:** `CheckoutView`, `ProductsDetailView`.

---

### `BaseModal.vue`

Modal accesible con `Teleport to="body"`. **Props:** `modelValue`, `title`, `size ('small'|'medium'|'large'|'fullscreen')`, `hideHeader`, `closeOnOverlayClick`. **Emits:** `update:modelValue(false)`, `close`. **Slots:** `default`, `footer` (condicional).

**Tamaños:** `small: 400px`, `medium: 800px`, `large: 1200px` (90vw en tablet), `fullscreen: 95vw × 95vh`.

**Bloqueo de scroll:**

```typescript
watch(() => props.modelValue, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})
onUnmounted(() => {
  document.body.style.overflow = ''  // cleanup si el modal se desmonta abierto
})
```

**Transición:** overlay `opacity 0→1` + container `scale(0.9) translateY(-20px) → natural`.

**Mobile (≤768px):** bottom sheet — `align-items: flex-end`, `width: 100%`, `border-radius: 20px 20px 0 0`.

**Usado en:** `HomeView` (QuickView), `CatalogoView` (QuickView), `CartView` (confirmación de eliminación).

---

### `StarBackground.vue`

Fondo decorativo de partículas. `position: fixed`, `z-index: 0`, `pointer-events: none`, `aria-hidden="true"`. **Props:** `particleCount (80)`, `opacity (0.6)`, `animated (true)`.

**Fix de posiciones estables:** estilos pre-computados en `computed()` sin deps reactivas — se evalúa una sola vez al montar. Previene el bug de versiones anteriores donde `Math.random()` se recalculaba en cada re-render.

**Animación `twinkle`:** `opacity 0.3→0.8` + `scale 1→1.3` con delays aleatorios por estrella (`0–3s`), duración aleatoria (`2–5s`).

> ⚠️ El prop `opacity` aplica como estilo inline pero el keyframe usa valores absolutos (`0.3–0.8`). El prop no escala los valores del keyframe.

**Usado en:** `HomeView`, `CartView`, `CheckoutView`, `ProductsDetailView` — siempre como primer hijo del contenedor de vista.

---

## 9. Componentes — layout/

El shell se monta en `App.vue` de forma persistente:

```
App.vue
├── <Header />       position: fixed · z-index: 1000
│     └── <NavBar />
├── <RouterView />
└── <Footer />
```

---

### `Header.vue`

Banner promocional rotativo + contenedor de `NavBar`. Sin props ni emits externos.

**Estado:** `showBanner`, `currentPromo`. Las promos rotan cada 5000ms vía `setInterval`. El cierre persiste en `localStorage('promo_banner_closed')`.

> ⚠️ El CSS de `.header-overlay`, el ref `mobileMenuOpen` y la transición `fade` son código muerto — ningún elemento del template los activa. Pueden eliminarse.

---

### `NavBar.vue`

Barra de navegación fija. **Dependencia activa:** `useCartStore` (Pinia).

```typescript
const cartStore      = useCartStore()
const cartItemsCount = computed(() => cartStore.totalItems)
```

**Estado:** `currentMessage`, `isScrolled` (cuando `scrollY > 50`), `mobileMenuOpen`.

**Mensajes rotativos:** `["HYPERSTITION CLUB", "THE ETERNAL GENERATION", "WE ARE HYPERSTITION MADE REAL"]` cada 3000ms.

**Íconos:** `@element-plus/icons-vue` — único componente de layout con esta dependencia.

**Rutas:** `/noticias`, `/catalogo`, `/carrito`, `/contacto` (redirige a home temporalmente).

**Ciclo de vida:** `onMounted` inicia interval + scroll listener. `onUnmounted` limpia ambos.

**Responsive:** `>768px` desktop · `≤768px` mobile toggle · `≤480px` logo-text oculto.

---

### `Footer.vue`

5 columnas (Marca + SHOP + INFO + LEGAL + Newsletter). Sin props ni emits externos.

**Estado:** `email`, `isSubmitting`, `submitMessage` (se limpia a los 4s), `currentYear`.

**Grid:** `2fr repeat(4, 1fr)`. Responsive: 5 cols → 2 cols + brand full-width → 1 col.

**Redes:** Instagram con link real. Twitter/X y Facebook con `href="#"`.

**Links operativos por router:** `/categoria/*` redirigen correctamente. `/coleccion` redirige a `/catalogo`.

**Links sin vista (caen en catchall):** `/about`, `/terminos`, `/privacidad`, `/envios`, `/faq`.

> ⚠️ No usa `useNewsletter`. Implementación de newsletter propia y duplicada.

> ⚠️ `<span>→</span>` huérfano en el template del form, fuera del `<button>`.

---

## 10. Componentes — product/

### `CategorySection.vue`

Slider horizontal de una categoría. **Tipos:** `@/types/Index`.

**Props:** `category: Category` (requerida), `autoRotate?: boolean (true)`, `interval?: number (5000)`.

**Emits:** `productClick(Product)`, `quickView(Product)`.

**No navega internamente.** `handleProductClick` solo emite. La navegación es responsabilidad del padre (HomeView).

**Algoritmo:** `position: absolute` + `translateX(offset × (ITEM_W + GAP))`. `ITEM_W = 280px`, `GAP = 24px`, `VISIBLE = 3`. Scale: `1.0` activo → mín `0.88`. Opacity: `0` cuando `dist > VISIBLE + 1`.

**Auto-rotación:** loop al llegar al último ítem. Pausa en hover. `isPaused` controla que `startTimer()` no arranque si el usuario sigue sobre el slider.

**Responsive:** item 280px → 240px → 200px → 172px. Wrapper 460px → 420px → 380px → 340px.

---

### `ProductCard.vue`

Tarjeta standalone. Sin emits — navega internamente. **Tipos:** `@/types/Index`.

**Props:** `product: Product`.

**Clic:** `router.push(product.ruta ?? /producto/${product.id})`.

**Badge:** `product.badge ?? 'NUEVO'` (solo si `product.badge || product.nuevo`). Colores: máx 3 + `+N`.

**Estado:** ⚠️ Sin uso activo. `ProductList` implementa su propia tarjeta con diferencias en aspect ratio, límite de colores, badge y hover overlay.

---

### `ProductList.vue`

Grid / list con skeleton, empty state y `TransitionGroup`. **Tipos:** `@/types/product`.

**Props:** `products: Product[]`, `loading: boolean`, `mode: 'grid'|'list'`, `skeletonCount: number (8)`, `emptyMessage: string`.

**Emits:** `productClick(Product)`, `quickView(Product)`, `addToCart(Product)`.

**Grid:** `auto-fill minmax(260px, 1fr)`. Quick actions en overlay hover (ojo + carrito). Badges: `NUEVO` (verde) + `−N%` (rojo).

**List:** `220px 1fr`. Muestra `product.descripcion`. Botones "Vista rápida" / "Agregar" con `margin-top: auto`.

**Helpers inline pendientes de migrar a `usePricing`:** `fmt()`, `discountPercent()`.

**Responsive:** `minmax(260px)` → `minmax(220px)` → 2 cols fijas (≤640px) → 1 col (≤360px).

---

### `ProducQuickView.vue`

Panel de compra rápida dentro de `BaseModal`. **Tipos:** `@/types/product`. **Composable activo:** `usePricing`.

> ⚠️ Typo en filename: falta `t`. Consistente en todos los imports. No renombrar sin actualizar HomeView y CatalogoView.

**Props:** `product: Product`.

**Emits:** `add-to-cart(product, quantity, color?, size?)`, `close()`.

**Tallas:** `computed` — usa `product.tallas` si existe, sino fallback `['XS','S','M','L','XL','XXL']`.

**Stock reactivo:**

```typescript
const stockStatus = computed(() => {
  const s = props.product.stock
  if (s === undefined || s === null) return { cls: 'in-stock',     txt: '✓ En stock' }
  if (s <= 0)                        return { cls: 'out-of-stock', txt: '✗ Sin stock' }
  if (s <= 3)                        return { cls: 'low-stock',    txt: `⚠ Últimas ${s} unidades` }
  return                                    { cls: 'in-stock',     txt: '✓ En stock' }
})
```

**Color → imagen:** `color[i]` activa `product.imagenes[i]` (convención de índice).

**`goToProduct()`:** emite `close` → navega a `product.ruta ?? /producto/:id`.

**Responsive (≤768px):** 1 columna + `.action-buttons` sticky con gradiente de fondo.

---

### `ProductFilter.vue`

**Archivo vacío.** Sin template, script ni estilos. La lógica de filtros vive directamente en `CatalogoView`.

---

## 11. Componentes — home/

Todos los componentes de `home/` son montados exclusivamente por `HomeView.vue`. Reciben datos como props y emiten eventos hacia la vista.

---

### `HomeHero.vue`

Hero fullscreen con animación de agujero negro y dos CTAs.

**Props:** `title`, `subtitle (HTML)`, `primaryCta: CtaButton`, `secondaryCta: CtaButton`.

```typescript
interface CtaButton { text: string; href?: string; to?: string }
```

`primaryCta` usa `<a :href>` (externo). `secondaryCta` usa `<RouterLink :to>` (interno). Sin validación de tipo — pasar una ruta Vue Router a `primaryCta.href` navegará fuera de la SPA.

**Decoración:** 12 símbolos flotantes con posiciones y animaciones hardcodeadas en el template.

---

### `HomePilares.vue`

Grid de 4 pilares de marca. **Props:** `title`, `subtitle`, `closingQuote`, `pilares: Pilar[]`.

```typescript
interface Pilar { id: string; simbolo: string; nombre: string; descripcion: string; color: string }
```

**Default de `pilares`:** Autenticidad, Simbolismo, Comunidad, Transformación — idénticos a los defaults de `HomePhilosophy`. Candidatos a `src/data/brandPilares.ts`.

> ⚠️ `activeIndex` — ref declarado y actualizado en `@mouseenter/@mouseleave` pero nunca consumido en el template. El hover funciona por CSS. Es código muerto.

**Responsive:** 4 → 2 → 1 columnas.

---

### `HomeFeatured.vue`

Carrusel orbital de productos destacados. **Excepción arquitectónica:** único componente que llama a `productosApi.getFeatured()` directamente.

**Props:** `limit: number (8)`, `rotationInterval: number (4500)`. **Emits:** `productClick(Product)`, `quickView(Product)`.

**Flujo de datos:**

```
onMounted → productosApi.getFeatured(limit)
  éxito → featuredItems = respuesta API
  error → featuredItems = FALLBACK (6 items con paths /images/featured/)
```

**Tipo interno `CarouselItem`** (de `@/types/carousel`): convierte a `Product` al emitir vía `itemToProduct()`. La conversión puede perder campos si el backend devuelve datos extra no mapeados.

**Posicionamiento orbital:** trigonométrico. Radios adaptativos:

```typescript
rx = windowW >= 1024 ? 480 : windowW >= 768 ? 380 : 300
ry = windowW >= 1024 ? 200 : windowW >= 768 ? 160 : 120
```

**`handleItemClick`:** si el ítem no está activo → solo lo activa. Si ya está activo → emite `productClick` + navega a `/producto/:id`.

**Auto-rotación:** pausa en hover. Respeta `loading` — no inicia hasta que los datos lleguen.

> ⚠️ Listener de resize sin debounce — recalcula radios en cada evento. Pendiente de throttle/debounce de 150ms.

> ⚠️ FALLBACK con paths `/images/featured/` que pueden no existir en el servidor.

---

### `HomeFusion.vue`

Sección editorial JP-ARG. Layout 3 columnas (hemisferio ARG | núcleo | hemisferio JP) + bloque editorial.

**Props:** `title (HTML)`, `body`, `ctaText`, `ctaRoute (default: '/coleccion/fusion')`, `ctaNote`, `piezasConceptuales: PiezaConceptual[]`.

```typescript
interface PiezaConceptual { id: string | number; simbolo: string; nombre: string; descripcion: string }
```

**`bgKanjis`:** 6 kanjis decorativos hardcodeados como constante del módulo con posiciones y opacidades. No configurables sin editar el código fuente.

> ⚠️ `ctaRoute` default `/coleccion/fusion` no existe en el router. El router tiene `/coleccion` → `/catalogo` pero no subpaths. Pasar `ctaRoute="/catalogo"` desde HomeView o crear la ruta.

**Usa `:deep()`** para aplicar estilos al HTML renderizado del prop `title` (que contiene `<em>`).

---

### `HomePhilosophy.vue`

Manifiesto de marca con imagen de fondo decorativa.

**Props:** `title`, `quoteText`, `text`, `icon (default: '☿')`, `backgroundImage`, `ctaText`, `ctaRoute (default: '/filosofia')`, `pilares: Pilar[]`.

**CTA:** apunta a `/filosofia` que el router redirige temporalmente a home.

**`pilares`:** mismos datos default que `HomePilares`. Ver nota sobre `src/data/brandPilares.ts`.

**Imagen de fondo:** oculta en mobile.

---

### `HomeNewletter.vue`

Formulario de suscripción. **Props:** `eyebrow`, `title`, `description`, `placeholder`, `buttonText`, `note`, `benefits: string[]`. **Emits:** `submit(email: string)`.

**Patrón:** el componente solo emite. `HomeView.handleNewsletter()` es responsable de llamar a la API (actualmente es un TODO).

**Estado local:** `email`, `isSubmitting`, `message`, `messageType ('success'|'error')`.

**Filename:** `HomeNewletter.vue` — typo (falta `s`). Consistente en todos los imports. No renombrar sin actualizar HomeView.

> ⚠️ No usa `useNewsletter`. Implementación local y duplicada.

---

## 12. Mapa de dependencias entre capas

```
STORE (Pinia)
useCartStore
     │
     ├── NavBar.vue           (totalItems → badge)
     ├── CartView.vue         (todos los getters + actions)
     └── HomeView / CatalogoView → ProducQuickView  (addItem via emit @add-to-cart)


COMPOSABLES
usePricing ──────────────────────────── ProducQuickView.vue  ✅
           ──── pendiente ───────────── CategorySection / ProductList / ProductCard / HomeFeatured

useNewsletter ── pendiente ───────────── HomeNewletter.vue / Footer.vue
                                         (ambos tienen estado local propio)


API SERVICE
api.ts
  productosApi.getFeatured() ─────────── HomeFeatured.vue  ⚠️ (directo, excepción)
  productosApi.getAll()  ─────────────── CatalogoView.vue  (via vista)
  categoriasApi.getAll() ─────────────── HomeView.vue      (pendiente migración)
  pedidosApi.create()    ─────────────── HomeView.vue      (pendiente, hoy es alert())


ROUTER
index.ts
  /categoria/:slug → /catalogo?categoria=   ─── Footer.vue (links SHOP)
  /coleccion → /catalogo                    ─── Footer.vue (link Colecciones)
  /filosofia → home (temporal)              ─── NavBar, Footer, HomePhilosophy
  /contacto → home (temporal)               ─── NavBar, Footer
  /coleccion/fusion → ❌ sin ruta            ─── HomeFusion.vue CTA


TYPES
@/types/product.ts (canónico)
     │
     ├── ProductList.vue, ProducQuickView.vue  (importan directamente)
     └── @/types/Index.ts (barrel)
               │
               └── CategorySection.vue, ProductCard.vue, HomeFeatured.vue, api.ts
```

---

## 13. Estado general del proyecto

| Módulo | Archivos | Estado | Issues activos |
|---|---|---|---|
| `types/` | 4 | ✅ Completo | Unificar `CarouselItem` con `Product` |
| `router/` | 1 | ✅ Funcional | 5 rutas sin vista · `/coleccion/fusion` faltante |
| `stores/` | 1 | ✅ Funcional | Códigos promo hardcodeados |
| `composables/` | 2 | ✅ Creados | Sin adopción completa en componentes |
| `services/` | 1 | ✅ Preparado | HomeView aún usa datos hardcodeados |
| `ui/` | 4 | ✅ Sólido | BaseButton sin uso · opacity en StarBg |
| `layout/` | 3 | ✅ Funcional | Footer: 5 links muertos · useNewsletter pendiente |
| `product/` | 5 | ⚠️ Parcial | ProductFilter vacío · ProductCard sin uso |
| `home/` | 6 | ✅ Funcional | Datos hardcodeados · deuda técnica media |

### Bugs activos por severidad

🟠 **Altos (6)**
- `ProductFilter.vue` — archivo vacío en repositorio
- `ProductCard.vue` — sin uso activo, funcionalidad duplicada en `ProductList`
- `HomeFeatured.vue` — resize listener sin debounce
- `HomeFeatured.vue` — `CarouselItem` diverge de `Product`, conversión `itemToProduct()` frágil
- `HomeFusion.vue` — CTA a `/coleccion/fusion` sin ruta en el router
- `Footer.vue` — 5 links sin vista real (caen en catchall hacia home)

🟡 **Medios (7)**
- `fmt()` duplicado en `CategorySection`, `ProductList`, `ProductCard`, `HomeFeatured` (4 copias fuera del composable)
- `useNewsletter` sin adoptar — 3 implementaciones paralelas de newsletter
- Pilares duplicados en defaults de `HomePilares` y `HomePhilosophy`
- `HomePilares.activeIndex` — ref declarado pero nunca consumido
- `HomeHero.primaryCta` — sin distinción entre URL externa y ruta Vue Router
- `StarBackground.opacity` — ignorado por valores absolutos del keyframe
- `HomeFeatured.FALLBACK` — paths `/images/featured/` pueden no existir

🟢 **Bajos (4)**
- `HomeNewletter` — typo en filename (falta `s`)
- `ProducQuickView` — typo en filename (falta `t`)
- `Header.vue` — CSS de overlay zombie (never activo)
- `HomeFusion.bgKanjis` — constante decorativa hardcodeada, no configurable

---

## 14. Deudas técnicas pendientes

### Prioridad alta

**Adoptar `usePricing` en los 4 componentes pendientes.** Reemplazar `fmt()` y `discountPercent()` inline en `CategorySection`, `ProductList`, `ProductCard` y `HomeFeatured`. Verificar el cambio de formato: el composable devuelve `"$18.500"`, las copias devuelven `"18.500"` (sin prefijo de moneda).

**Adoptar `useNewsletter` en `Footer.vue` y `HomeNewletter.vue`.** Actualmente hay 3 implementaciones paralelas del mismo flujo de suscripción. El composable tiene `try/catch` real, a diferencia de las implementaciones locales.

**Conectar `HomeView.handleNewsletter()` al endpoint real.** El composable ya tiene el llamado preparado como TODO. Solo descomentar cuando el endpoint esté disponible.

**Migrar `HomeView` de datos hardcodeados a `api.ts`.** La guía de migración completa con snippets de código está documentada en `src/services/api.ts`.

### Prioridad media

**Extraer pilares a `src/data/brandPilares.ts`.** `HomePilares` y `HomePhilosophy` tienen los mismos 4 pilares como defaults separados. Un archivo de constantes compartido elimina la duplicación y es el único source of truth.

**Eliminar `HomePilares.activeIndex`.** El ref existe y se actualiza pero nunca se lee. El hover funciona enteramente por CSS (`:hover`). Eliminar el ref y los handlers `@mouseenter/@mouseleave` simplifica el componente sin cambio visual.

**Debounce en resize listener de `HomeFeatured`.** Cada evento de resize recalcula los radios orbitales y el tamaño del stage. Un debounce de 150ms es suficiente para eliminar el thrashing sin impacto perceptible en UX.

**Corregir CTA de `HomeFusion`.** Cambiar el default de `ctaRoute` a `/catalogo` en `HomeView`, o crear la ruta `/coleccion/fusion` en el router cuando exista la vista correspondiente.

**Limpiar `Header.vue`.** El CSS de `.header-overlay`, el ref `mobileMenuOpen` y la transición `fade` son código muerto. Eliminarlos reduce el tamaño del bundle y el ruido en el código.

### Prioridad baja

**Unificar `CarouselItem` con `Product`.** Son tipos casi idénticos. `HomeFeatured` podría trabajar directamente con `Product[]` eliminando `itemToProduct()` y la pérdida potencial de datos en la conversión.

**Renombrar `HomeNewletter.vue` → `HomeNewsletter.vue`.** Requiere actualizar el import en `HomeView`.

**Renombrar `ProducQuickView.vue` → `ProductQuickView.vue`.** Requiere actualizar los imports en `HomeView` y `CatalogoView`.

**Eliminar o implementar `ProductFilter.vue`.** Mientras exista vacío genera ruido en búsquedas y análisis estático. Si no hay plan de implementación inmediato, eliminar el archivo.

**Adoptar `BaseButton`.** Hay al menos 3 estilos distintos de botón primary distribuidos entre `HomeHero`, `HomeFeatured`, `CategorySection` y `CheckoutView`. Unificar eliminaría inconsistencias visuales actuales y futuras.

**Crear `NotFoundView.vue` y `ContactoView.vue`.** El catchall redirige silenciosamente a home. Un 404 real mejora UX y SEO. `/contacto` tiene relevancia especial como punto de contacto de la marca.

**Distinguir tipo de CTA en `HomeHero`.** Implementar tipo discriminado para que `primaryCta` y `secondaryCta` validen en compilación si se debe usar `<a>` o `<RouterLink>`:

```typescript
type CtaButton =
  | { type: 'external'; text: string; href: string }
  | { type: 'internal'; text: string; route: string }
```

---

*Documentación actualizada — Marzo 2026 · Arquitectura completa: 17 componentes + router + store + 2 composables + API service + sistema de tipos.*