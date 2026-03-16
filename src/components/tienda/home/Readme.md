# components/home

Componentes exclusivos del Home de BRANA. Cada uno representa una sección de la página principal y es orquestado por `HomeView.vue`.

> **v2.1 · Marzo 2026** — Todos los bugs del sprint Home resueltos. Ver sección [Cambios aplicados](#cambios-aplicados) al final del documento.

---

## Estructura

```
components/home/
├── HomeHero.vue          ← Sección 1 · Fullscreen de entrada
├── HomePilares.vue       ← Sección 2 · Los 4 valores de la marca
├── HomeFeatured.vue      ← Sección 3 · Carrusel orbital de best-sellers
├── HomeFusion.vue        ← Sección 5 · Editorial JP-ARG
├── HomePhilosophy.vue    ← Sección 6 · Manifiesto de marca
└── HomeNewletter.vue     ← Sección 7 · Suscripción a la tribu
```

> La **Sección 4 (Categorías)** no vive aquí. `HomeView` invoca directamente `@/components/product/CategorySection.vue` ×3 dentro de un wrapper `<section>` inline.

### Archivo de datos compartidos (nuevo)

```
src/data/
└── brandPilares.ts       ← Única fuente de verdad para los 4 pilares de marca
```

Exporta `BrandPilar` (tipo completo), `PilarHint` (`Pick<BrandPilar, 'simbolo' | 'nombre'>`), y `BRAND_PILARES` (array con los 4 pilares). Consumido por `HomePilares` y `HomePhilosophy`. Editar aquí para que el cambio se propague a ambos componentes automáticamente.

---

## Relación con HomeView

`HomeView.vue` actúa como orquestador puro: monta las secciones en orden, gestiona el estado compartido (Quick View modal, categorías desde API) y expone handlers a los hijos vía `@evento`.

```
HomeView.vue
│
├── <HomeHero />                          sin props — todo en defaults del componente
├── <HomePilares />                       sin props — todo en defaults del componente
├── <HomeFeatured :limit="8"             ← prop opcional
│     @product-click="handleProductClick"
│     @quick-view="handleQuickView" />
│
├── <section.categories-section>
│     <CategorySection v-for="cat"       ← datos de categoriasApi o FALLBACK
│       @product-click="handleProductClick"
│       @quick-view="handleQuickView" />
│   </section>
│
├── <HomeFusion />                        sin props — todo en defaults del componente
├── <HomePhilosophy />                    sin props — todo en defaults del componente
└── <HomeNewsletter @submit="handleNewsletter" />
```

### Estado que HomeView gestiona

| ref / computed | Qué contiene | Lo usan |
|---|---|---|
| `showQuickView` | booleano del modal | `BaseModal v-model` |
| `selectedProduct` | producto seleccionado | `ProductQuickView :product` |
| `categoriasFromApi` | respuesta de `categoriasApi.getAll()` | computed abajo |
| `categoriasConProductos` | API data o `FALLBACK_CATEGORIAS` | `CategorySection ×3` |

### Handlers que HomeView expone

| Handler | Quién lo llama | Qué hace |
|---|---|---|
| `handleProductClick(product)` | `HomeFeatured`, `CategorySection` | `router.push('/producto/:id')` |
| `handleQuickView(product)` | `HomeFeatured`, `CategorySection` | Abre modal con `ProductQuickView` |
| `handleAddToCart(product, cantidad, color?, talla?)` | `ProductQuickView` (dentro del modal) | `cart.addItem(...)` + cierra modal |
| `handleNewsletter(email)` | `HomeNewsletter` | Solo se dispara si la suscripción fue exitosa en el composable. _TODO: conectar endpoint real._ |

---

## Componentes

### `HomeHero.vue`

Primera impresión de la marca. Fullscreen con agujero negro animado, título BRANA y dos CTAs.

- **Datos:** 100% estático, todo en props con defaults.
- **Interacción con HomeView:** ninguna. No emite eventos.
- **Props clave:** `title`, `subtitle`, `primaryCta`, `secondaryCta`.

**Tipo `CtaButton`:**

```ts
interface CtaButton {
  text: string;
  type?: 'external' | 'internal';
  href?: string;    // URL externa (https://...)
  route?: string;   // ruta Vue Router (/catalogo)
}
```

El componente detecta automáticamente el tipo de CTA con el helper `isExternal()`:

```
type === 'external'  →  <a :href target="_blank">
href presente        →  <a :href target="_blank">
route empieza https  →  <a :href target="_blank">   ← compatibilidad legado
cualquier otro caso  →  <RouterLink :to>
```

Esto garantiza que rutas internas naveguen con Vue Router y URLs externas abran en pestaña nueva, sin necesidad de que el padre declare `type` explícitamente.

- **Default `primaryCta`:** `{ type: 'external', href: 'https://www.instagram.com/brana_eg/' }` → abre Instagram en pestaña nueva ✅
- **Default `secondaryCta`:** `{ type: 'internal', route: '/filosofia' }` → navega con `RouterLink` (ruta actualmente redirigida a home).

---

### `HomePilares.vue`

Grid con los 4 valores fundacionales: Autenticidad · Simbolismo · Comunidad · Transformación.

- **Datos:** 100% estático. Los defaults se importan de `@/data/brandPilares.ts`.
- **Interacción con HomeView:** ninguna. No emite eventos.
- **Props clave:** `pilares: BrandPilar[]`, `title`, `subtitle`, `closingQuote`.
- **Efectos hover:** íntegramente por CSS (`:hover`). No hay lógica JavaScript para el hover.
- **Responsive:** 4 cols → 2 cols (tablet) → 1 col (mobile).

```ts
// BrandPilar viene de @/data/brandPilares.ts
interface BrandPilar {
  id: string;
  simbolo: string;
  nombre: string;
  descripcion: string;
  color: string;  // hex — se aplica como CSS custom property --accent y --glow-color
}
```

---

### `HomeFeatured.vue`

Carrusel orbital con **eje vertical** (`ry > rx`). Gestiona su propio fetch de best-sellers y tiene fallback estático.

- **Datos:** Llama internamente a `productosApi.getFeatured(limit)` en `onMounted`. No depende de HomeView para los datos.
- **Interacción con HomeView:**

  | Evento emitido | Cuándo | Handler en HomeView |
  |---|---|---|
  | `productClick` | Clic en el ítem activo (la cima) | `handleProductClick` → navega al detalle |
  | `quickView` | Clic en "Vista rápida" (hover del ítem activo) | `handleQuickView` → abre modal |

- **Props:** `limit` (default `8`), `rotationInterval` (default `4500ms`).
- **Fallback:** Si la API falla, carga 6 items hardcodeados desde `/images/featured/`.
- **Loading:** Muestra spinner `◈` girando mientras espera la API. El resto del Home no se bloquea.

---

### `HomeFusion.vue`

Sección editorial sobre la identidad JP-ARG de la marca. Split layout con hemisferios Argentina / Japón y un núcleo animado central.

- **Datos:** 100% estático, todo en props con defaults.
- **Interacción con HomeView:** ninguna. No emite eventos.
- **Props clave:** `title` (acepta HTML con `v-html`), `body`, `ctaText`, `ctaRoute`, `piezasConceptuales[]`.

```ts
interface PiezaConceptual { id: string; simbolo: string; nombre: string }
```

- **CTA default:** apunta a `/catalogo`. Cuando exista la vista `/coleccion/fusion` y se registre en el router, pasar `ctaRoute="/coleccion/fusion"` desde `HomeView`.
- **Kanjis de fondo:** 6 caracteres decorativos (`永 魂 南 夢 鬼 道`) hardcodeados en el módulo como constante interna. No configurables desde el padre por diseño; si se necesita personalización futura, exponer como prop `bgKanjis?`.

---

### `HomePhilosophy.vue`

Manifiesto de marca. Imagen decorativa de fondo + blockquote + 4 pilares hint + CTA al manifiesto completo.

- **Datos:** 100% estático. Los defaults de `pilares` se importan de `@/data/brandPilares.ts`.
- **Interacción con HomeView:** ninguna. No emite eventos.
- **Props clave:** `title`, `quoteText`, `text`, `backgroundImage`, `ctaRoute`, `pilares: PilarHint[]`.

```ts
// PilarHint = Pick<BrandPilar, 'simbolo' | 'nombre'>
// Viene de @/data/brandPilares.ts — BRAND_PILARES es directamente compatible
type PilarHint = Pick<BrandPilar, 'simbolo' | 'nombre'>
```

- **CTA default:** apunta a `/filosofia`, ruta actualmente redirigida a home (pendiente de vista propia).
- **Imagen de fondo:** oculta en mobile (`display: none` en `@media max-width: 640px`).

---

### `HomeNewletter.vue`

Formulario de suscripción. Delega toda la lógica de estado y llamada a la API en el composable `useNewsletter`.

- **Datos:** Estado gestionado por `useNewsletter` — `email`, `isSubmitting`, `message`, `hasError`, `subscribe()`.
- **Interacción con HomeView:**

  | Evento emitido | Cuándo | Handler en HomeView |
  |---|---|---|
  | `submit(email)` | Solo si `subscribe()` tuvo éxito (`!hasError`) | `handleNewsletter(email)` — _TODO: conectar endpoint_ |

- **Props clave:** `eyebrow`, `title`, `description`, `benefits[]`, `buttonText`, `note`.

```ts
interface Benefit { id: string; simbolo: string; texto: string }
```

- **Nota filename:** El archivo se llama `HomeNewletter.vue` (typo, falta una `s`). Consistente en todas las importaciones. No renombrar sin actualizar el import en `HomeView`.
- **Nota funcional:** El endpoint real está pendiente. `useNewsletter.subscribe()` tiene el `try/catch` real sobre la llamada a la API. Descomentar la llamada cuando el endpoint esté disponible.

---

## Componentes que NO pertenecen a esta carpeta pero aparecen en el Home

| Componente | Carpeta real | Rol en el Home |
|---|---|---|
| `CategorySection.vue` | `components/product/` | Sección 4 — slider horizontal por línea de producto |
| `ProductQuickView.vue` | `components/product/` | Dentro del modal de Quick View |
| `StarBackground.vue` | `components/ui/` | Fondo de partículas fijo (z-index 0) |
| `BaseModal.vue` | `components/ui/` | Wrapper del modal Quick View (Teleport → body) |

---

## Cambios aplicados (v2.1)

| Componente | Bug / Deuda | Cambio |
|---|---|---|
| `HomeHero.vue` | BUG-013: `primaryCta` siempre como `<a target="_blank">` | Tipo `CtaButton` flexible + helpers `isExternal()`, `getHref()`, `getRoute()`. El template elige `<a>` o `<RouterLink>` según el destino. |
| `HomeNewsletter.vue` | BUG-007: `try/catch` alrededor de `emit()` nunca capturaba errores reales | Reemplazado por `useNewsletter` composable. `emit('submit')` solo se dispara si la suscripción fue exitosa. |
| `HomePilares.vue` | BUG-010: `activeIndex` declarado, actualizado, pero nunca leído | Eliminados `ref`, `@mouseenter` y `@mouseleave`. El hover funciona íntegramente por CSS. |
| `HomePilares.vue` | Pilares hardcodeados inline (duplicación) | Defaults migrados a `@/data/brandPilares.ts`. |
| `HomePhilosophy.vue` | Pilares duplicados respecto a `HomePilares` | Interfaz `PilarHint` local eliminada. Defaults migrados a `@/data/brandPilares.ts`. |
| `HomeFusion.vue` | `ctaRoute: '/coleccion/fusion'` sin ruta en el router → catchall silencioso | Default cambiado a `/catalogo`. |
| `HomeFusion.vue` | `<router-link>` en minúsculas — inconsistente | Cambiado a `<RouterLink>` (PascalCase). |
| `brandPilares.ts` | No existía — datos duplicados en dos componentes | Archivo nuevo en `src/data/`. Exporta `BrandPilar`, `PilarHint`, `BRAND_PILARES`. |

---

*BRANA · Documentación components/home · v2.1 · Marzo 2026*