# components/layout

Componentes estructurales que conforman el shell persistente de la app. Se montan **una sola vez** en `App.vue` y rodean a todas las vistas mediante `<RouterView />`.

---

## Estructura

```
components/layout/
├── Header.vue    ← Wrapper fijo superior: banner promo + NavBar
├── NavBar.vue    ← Barra de navegación principal con mensajes rotativos y carrito
└── Footer.vue    ← Pie de página con columnas de links, sociales y mini-newsletter
```

---

## Relación con App.vue

```
App.vue
│
├── <Header />          position: fixed · z-index: 1000 · toda la parte superior
│     └── <NavBar />    montado internamente por Header
│
├── <RouterView />      vistas dinámicas (Home, Catálogo, Carrito, etc.)
│
└── <Footer />          al final del flujo de documento
```

`Header` y `Footer` no reciben props desde `App.vue`. Cada uno gestiona su propio estado interno de forma autónoma.

---

## Componentes

---

### `Header.vue`

Wrapper que actúa como contenedor del área fija superior. Sus responsabilidades son: el banner promocional rotativo y alojar a `NavBar`.

**No emite eventos hacia App.vue.** Toda su lógica es interna.

#### Estado interno

**`showBanner`** `boolean` — controla la visibilidad del banner promo. Valor inicial: `true`.

**`currentPromo`** `Promo` — promo visible en el banner en cada momento. Se inicializa con el primer item que tenga `active: true`.

#### Promos hardcodeadas

```typescript
const promos = [
  { id: 1, text: '🎯 ENVÍO GRATIS EN COMPRAS SUPERIORES A $50.000', active: true },
  { id: 2, text: '✨ NUEVA COLECCIÓN: COSMIC GOLD DISPONIBLE AHORA',  active: false },
  { id: 3, text: '🔥 20% OFF EN SEGUNDA UNIDAD - SOLO HOY',           active: false },
]
```

Solo la que tiene `active: true` se muestra inicialmente. Las tres rotan cada `5000ms` si el banner sigue visible.

#### Ciclo de vida

```
onMounted:
  → lee localStorage('promo_banner_closed')
       si 'true'  →  showBanner = false  (respeta decisión previa del usuario)
  → si hay múltiples promos y banner visible
       → setInterval(rotarPromo, 5000ms)
       → registra onUnmounted interno para limpiar el interval

closeBanner():
  → showBanner = false
  → localStorage.setItem('promo_banner_closed', 'true')
```

#### Relación con NavBar

`Header` importa y monta `NavBar` directamente, sin pasarle props ni escuchar emits.

```html
<NavBar />
```

#### Transiciones

**`slide-down`** — aplicada al banner promo. Efecto: `translateY(-100%) + opacity 0` al entrar y salir.

**`fade`** — definida en CSS pero sin elemento que la consuma actualmente.

#### Responsive

- **Móvil (≤ 768px):** el banner reduce padding y tamaño de fuente. El botón de cierre cambia de `position: absolute` a `position: relative`.
- **Móvil pequeño (≤ 480px):** el ícono `✦` del banner se oculta y el texto ajusta `padding-right` para no solaparse con el botón de cierre.

---

### `NavBar.vue`

Barra de navegación principal. `position: fixed`, cubre toda la parte superior. Contiene logo con animación, mensajes rotativos de marca, menú desktop con iconos, badge de carrito conectado al store y menú móvil desplegable.

**No emite eventos hacia Header ni App.vue.** Toda su lógica es interna.

#### Estado interno

**`currentMessage`** `ref<number>` — índice del mensaje rotativo activo.

**`isScrolled`** `ref<boolean>` — `true` cuando `window.scrollY > 50px`.

**`mobileMenuOpen`** `ref<boolean>` — controla la visibilidad del drawer mobile.

**`cartItemsCount`** `computed<number>` — cantidad de ítems en el carrito, conectada a `useCartStore().totalItems`.

#### Mensajes rotativos

```typescript
const hyperstitionMessages = [
  "HYPERSTITION CLUB",
  "THE ETERNAL GENERATION",
  "WE ARE HYPERSTITION MADE REAL"
]
// Rotan cada 3000ms vía setInterval
```

#### Comportamiento scroll

Cuando `isScrolled` es `true`, la clase `.scrolled` se aplica al `<header>`:
- `background` sube a `rgba(0,0,0,0.98)`
- `box-shadow` aparece
- `border-bottom-color` sube a `rgba(218,165,32,0.4)`

#### Logo

Imagen `logobrana.png` con animación `logoRotate` (rotación completa 360° en 8s lineal infinita). Al hacer hover, la duración se acorta a 4s y el `drop-shadow` se intensifica.

#### Badge del carrito

```typescript
import { useCartStore } from '@/stores/useCartStore'
const cartStore      = useCartStore()
const cartItemsCount = computed(() => cartStore.totalItems)
```

El badge rojo aparece en desktop y mobile cuando `cartItemsCount > 0`. Tiene animación `badgePulse` (escala pulsante cada 2s).

#### Íconos (Element Plus)

```typescript
import { ShoppingBag, Message, Expand, Fold, ShoppingTrolley, Document }
  from '@element-plus/icons-vue'
```

`NavBar` es el único componente de layout que usa **Element Plus**. Los íconos se renderizan con `<el-icon>`.

#### Rutas del menú desktop

**NOTICIAS** → `/noticias` (texto, sin ícono)

**Catálogo** → `/catalogo` (ícono `ShoppingBag`)

**Carrito** → `/carrito` (ícono `ShoppingTrolley` + badge)

**Contacto** → `/contacto` (ícono `Message`) — ruta actualmente redirigida a home en `index.ts`

#### Menú móvil

Desplegable bajo la navbar, activado con el botón hamburguesa (ícono `Expand` cuando cerrado, `Fold` cuando abierto). Cada `<RouterLink>` ejecuta `@click="mobileMenuOpen = false"` para cerrar el drawer al navegar. Contiene las mismas 4 rutas que el desktop, mostrando ícono + texto.

#### Ciclo de vida

```
onMounted:
  → setInterval(rotarMensaje, 3000ms)  →  guardado en messageInterval
  → window.addEventListener('scroll', scrollHandler)

onUnmounted:
  → clearInterval(messageInterval)
  → window.removeEventListener('scroll', scrollHandler)
```

#### Breakpoints

```
> 768px:  .desktop-menu visible · .mobile-menu-toggle oculto
≤ 768px:  .desktop-menu oculto  · .mobile-menu-toggle visible · padding navbar reducido
≤ 480px:  .logo-text oculto (solo queda la imagen del logo, 45px)
```

---

### `Footer.vue`

Pie de página con **5 columnas** en grid, links de navegación agrupados por categoría, redes sociales y un mini-formulario de newsletter independiente del de `HomeNewsletter`.

**No emite eventos hacia App.vue.** Gestiona su propio estado.

#### Estado interno

**`email`** `ref<string>` — bindeado con `v-model` al input del newsletter.

**`isSubmitting`** `ref<boolean>` — deshabilita el botón durante el envío y muestra `'...'` como texto.

**`submitMessage`** `ref<string>` — muestra el mensaje de confirmación inline tras el envío. Se limpia automáticamente a los 4 segundos.

**`currentYear`** `computed` — `new Date().getFullYear()`. Año dinámico para el copyright.

#### Columnas del grid

```
grid-template-columns: 2fr repeat(4, 1fr)
```

**Col 1 (2fr) — Marca:** logo + nombre BRANA + tagline + redes sociales.

**Col 2 — SHOP:** links a productos y categorías.

**Col 3 — INFO:** links institucionales.

**Col 4 — LEGAL:** links de políticas.

**Col 5 — ÚNETE AL ARCANO:** mini-newsletter.

#### Redes sociales

**Instagram** → `https://www.instagram.com/brana_eg/` — link real, `target="_blank"`.

**Twitter/X** → `#` — placeholder sin URL real.

**Facebook** → `#` — placeholder sin URL real.

#### Links con rutas inexistentes o temporales

SHOP — Todos los Productos → `/productos` (existe, placeholder)

SHOP — Remeras → `/categoria/remeras` (redirige a `/catalogo?categoria=remeras`)

SHOP — Buzos → `/categoria/buzos` (redirige a `/catalogo?categoria=buzos`)

SHOP — Pantalones → `/categoria/pantalones` (redirige a `/catalogo?categoria=pantalones`)

SHOP — Colecciones → `/coleccion` (no existe en router)

INFO — Sobre Nosotros → `/about` (no existe en router)

INFO — Nuestra Filosofía → `/filosofia` (redirige a home)

INFO — Contacto → `/contacto` (redirige a home)

LEGAL — Términos y Condiciones → `/terminos` (no existe en router)

LEGAL — Política de Privacidad → `/privacidad` (no existe en router)

LEGAL — Envíos y Devoluciones → `/envios` (no existe en router)

LEGAL — FAQ → `/faq` (no existe en router)

#### Mini-newsletter

```typescript
const handleNewsletter = async () => {
  if (!email.value) return
  isSubmitting.value = true
  // TODO: await newsletterApi.subscribe(email.value)
  await new Promise(r => setTimeout(r, 600))   // simula latencia
  submitMessage.value = '✓ ¡Bienvenida a la tribu!'
  email.value = ''
  isSubmitting.value = false
  setTimeout(() => { submitMessage.value = '' }, 4000)
}
```

El mensaje de confirmación se muestra inline en `.footer-submit-msg`. No usa `alert()` nativo.

> ⚠️ **Nota de template:** hay un `<span>→</span>` ubicado fuera del `<button>` como nodo huérfano dentro del `<form>`. No afecta la funcionalidad pero es un error estructural que debe corregirse.

#### Animaciones activas

**`symbolRotate`** — rotación completa 360° en 8s lineal infinita. Aplicada a los símbolos `◈ ✦` de los dividers superior e inferior.

**`logoFloat`** — flotado vertical de −10px + rotación de 180° en 6s ease-in-out infinita. Aplicada al logo en la columna de marca.

#### Responsive

```
> 1024px:  grid 5 columnas (2fr + 4×1fr)
≤ 1024px:  grid 2 columnas · .footer-brand ocupa ancho completo (col 1 / -1)
≤ 768px:   grid 1 columna · .footer-bottom-content en columna · sociales centradas
≤ 480px:   padding reducido · logo 40px · brand-name 1.5rem
```

---

## Dependencias externas

**`NavBar`** usa `@element-plus/icons-vue` para 6 íconos del menú: `ShoppingBag`, `Message`, `Expand`, `Fold`, `ShoppingTrolley`, `Document`.

**`NavBar`** usa `@/stores/useCartStore` para leer `totalItems` en tiempo real.

**`Header`** usa `localStorage` para persistir el cierre del banner entre recargas.

**`Header`** importa y monta `NavBar` directamente.

**`Footer`** no tiene dependencias externas.

---

## Observaciones y deudas técnicas

**`Header` — overlay sin uso:** el CSS de `.header-overlay` y la transición `fade` están definidos pero no hay ningún elemento en el template que los consuma. Pueden eliminarse sin consecuencias.

**`Footer` — Twitter y Facebook sin URL:** ambos links tienen `href="#"`. Requieren URLs reales cuando estén disponibles.

**`Footer` — 8 rutas sin vista:** `/coleccion`, `/about`, `/terminos`, `/privacidad`, `/envios` y `/faq` no existen en el router. `/filosofia` y `/contacto` redirigen a home temporalmente.

**`Footer` — `<span>→</span>` huérfano:** nodo suelto dentro del `<form>` del mini-newsletter, ubicado fuera del `<button>`. Debe moverse adentro del botón o eliminarse.

**`Footer` + `HomeNewsletter` — dos formularios sin endpoint compartido:** ambos simulan el envío con `setTimeout` y no llaman a ninguna API real. Cuando se implemente el endpoint, conviene centralizar la lógica en un composable o servicio compartido para evitar duplicación.