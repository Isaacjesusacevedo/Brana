# components/ui

Primitivos de interfaz reutilizables. No tienen lógica de negocio ni conocen el dominio del e-commerce — funcionan en cualquier contexto de la app.

---

## Estructura

```
components/ui/
├── BaseButton.vue      ← Botón polimórfico (button / a) con variantes y tamaños
├── BaseInput.vue       ← Input/textarea con label flotante, íconos y validación
├── BaseModal.vue       ← Modal con Teleport, tamaños y bloqueo de scroll
└── StarBackground.vue  ← Fondo de partículas fijo (decorativo, sin interacción)
```

---

## Quién usa cada componente

**`BaseButton`** — sin uso activo identificado. Disponible pero sin invocar en vistas actuales.

**`BaseInput`** — usado en `CheckoutView` y `ProductsDetailView`.

**`BaseModal`** — usado en `HomeView`, `CatalogoView` y `CartView`.

**`StarBackground`** — usado en `HomeView`, `CartView`, `CheckoutView` y `ProductsDetailView`.

---

## Componentes

---

### `BaseButton.vue`

Botón polimórfico que renderiza `<button>` o `<a>` dependiendo del prop `tag`. Incluye tres variantes visuales, tres tamaños, flecha opcional y efecto ripple en hover.

> ⚠️ **Sin uso activo:** `BaseButton` no está siendo invocado en ninguna vista. Las vistas tienen sus propios botones con estilos inline. Es candidato a adoptar para estandarizar los CTAs del proyecto y eliminar la duplicación actual.

#### Props

**`variant`** `'primary' | 'secondary' | 'outline'` — estilo visual. Default: `'primary'`.

**`size`** `'sm' | 'md' | 'lg'` — tamaño del botón. Default: `'md'`.

**`tag`** `'button' | 'a'` — elemento HTML renderizado mediante `<component :is>`. Default: `'button'`.

**`arrow`** `boolean` — muestra `→` animado a la derecha del slot. Default: `false`.

**`href`** `string` — solo aplica si `tag === 'a'`.

**`target`** `string` — solo aplica si `tag === 'a'`.

**`rel`** `string` — solo aplica si `tag === 'a'`.

#### Emits

**`click`** `[event: Event]` — al hacer clic sobre el botón o enlace.

#### Variantes visuales

**`primary`** — fondo gradient oro `#DAA520 → #FFD700`, texto `#000`, borde `#DAA520`. Hover: `translateY(-3px)` + `box-shadow` dorado amplificado.

**`secondary`** — fondo transparente, borde `2px solid #DAA520`, texto `#DAA520`. Hover: fondo `rgba(oro, 0.1)` + `translateY(-3px)`.

**`outline`** — fondo transparente, borde `1px solid rgba(255,255,255,0.3)`, texto `#fff`. Hover: borde y texto cambian a dorado.

#### Tamaños

```
sm:  padding 0.75rem 1.5rem  ·  font-size 0.875rem
md:  padding 1rem 2rem       ·  font-size 1rem
lg:  padding 1.25rem 2.5rem  ·  font-size 1.125rem
```

#### Efecto ripple

Pseudo-elemento `::before` posicionado en el centro que expande de `0 × 0` a `300 × 300px` en `0.6s` al hacer hover. El `overflow: hidden` del botón lo contiene. El contenido real del slot queda en `z-index: 1` para no ser cubierto.

#### Flecha animada

Cuando `arrow` es `true`, se renderiza `<span class="button-arrow">→</span>` dentro del `.button-content`. Al hover, recibe `transform: translateX(5px)` en `0.3s`.

#### Uso como enlace

```html
<!-- Enlace externo -->
<BaseButton tag="a" href="https://..." target="_blank" rel="noopener noreferrer">
  Ver Instagram
</BaseButton>

<!-- Botón con flecha -->
<BaseButton variant="primary" :arrow="true" @click="handleAction">
  Explorar colección
</BaseButton>
```

---

### `BaseInput.vue`

Input y textarea unificados en un mismo componente. Soporta label flotante, íconos prefix/suffix, limpieza con un clic, toggle de contraseña, validación con mensaje de error y hint contextual.

**`inheritAttrs: false`** — los atributos extra pasados al componente (`maxlength`, `pattern`, `aria-*`, etc.) van directamente al `<input>` o `<textarea>` mediante `v-bind="$attrs"`, no al `<div>` wrapper.

#### Props

**`modelValue`** `string | number` — valor del campo para `v-model`.

**`label`** `string` — label flotante sobre el campo.

**`placeholder`** `string` — placeholder del input.

**`type`** `'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' | 'search'` — tipo del campo. Default: `'text'`.

**`prefixIcon`** `string` — símbolo/ícono a la izquierda del campo.

**`suffixIcon`** `string` — símbolo/ícono a la derecha (solo aparece si no hay `clearable` activo ni `type === 'password'`).

**`clearable`** `boolean` — muestra botón `✕` para vaciar el campo cuando tiene valor. Default: `false`.

**`disabled`** `boolean` — deshabilita el campo. Default: `false`.

**`readonly`** `boolean` — campo de solo lectura. Default: `false`.

**`error`** `string` — mensaje de error visible siempre (sustituye al hint).

**`hint`** `string` — texto de ayuda visible solo mientras el campo está enfocado.

**`autocomplete`** `string` — atributo HTML `autocomplete`.

**`rows`** `number` — filas del textarea. Solo aplica para `type="textarea"`. Default: `4`.

**`variant`** `'default' | 'ghost' | 'filled'` — estilo visual del campo. Default: `'default'`.

**`size`** `'sm' | 'md' | 'lg'` — tamaño del padding y fuente. Default: `'md'`.

#### Emits

**`update:modelValue`** `[value: string]` — en cada cambio de valor. Habilita `v-model`.

**`blur`** `[event: FocusEvent]` — al perder el foco.

**`clear`** `[]` — al hacer clic en el botón `✕`.

**`enter`** `[event: KeyboardEvent]` — al presionar Enter. Solo disponible en `<input>`, no en textarea.

#### Variantes visuales

**`default`** — fondo `rgba(255,255,255,0.03)`, borde `rgba(255,255,255,0.1)`, border-radius `2px`.

**`filled`** — fondo `rgba(255,255,255,0.06)`, borde transparente.

**`ghost`** — fondo transparente, sin borde lateral, solo borde inferior `rgba(255,255,255,0.15)`, sin border-radius.

Al enfocar: fondo sube a `rgba(255,255,255,0.05)` y borde cambia a `rgba(218,165,32,0.5)` en todas las variantes.

#### Jerarquía del ícono derecho (suffix)

Solo aparece uno a la vez, en este orden de prioridad:

```
1. clearable && hasValue && !disabled  →  botón ✕ (clear-btn)
2. type === 'password'                 →  botón ◉/◎ (pass-toggle)
3. suffixIcon                          →  ícono genérico (no interactivo)
```

#### Label flotante

El label usa `position: absolute` con transición suave entre dos estados:

```
Normal (sin valor, sin foco):
  top: 50%  ·  transform: translateY(-50%)  ·  font-size: 0.85rem  ·  color: rgba(255,255,255,0.35)

Flotado (con valor O enfocado):
  top: 0.45rem  ·  transform: none  ·  font-size: 0.6rem  ·  color: #DAA520
```

Para `textarea`, el label parte de `top: 1.1rem` (sin `translateY(-50%)`) usando el selector `:has(textarea)`.

#### Línea de foco animada

Un `div` absolutamente posicionado en la base del campo (`bottom: 0`) que expande de `width: 0, left: 50%` a `width: 100%, left: 0` al enfocar, en `0.3s`. El color es dorado en foco normal. Cuando hay `error`, la línea es roja permanente e independiente del foco.

#### `inputId` estable

```typescript
const _uid    = getCurrentInstance()?.uid ?? Math.random().toString(36).slice(2, 7)
const inputId = `brana-input-${_uid}`
```

Usa el `uid` interno de la instancia Vue (número entero único por componente) para generar el id. El fallback con `Math.random()` solo se activa si `getCurrentInstance()` devuelve `null` (casos edge fuera del ciclo de vida de Vue). A diferencia de la implementación anterior basada en `computed()`, este id es verdaderamente estable y es seguro en SSR.

#### Tamaños

```
sm:  padding 0.6rem 0.9rem   ·  font-size 0.8rem
md:  padding 0.9rem 1rem     ·  font-size 0.85rem
lg:  padding 1.1rem 1.2rem   ·  font-size 0.95rem
```

Cuando hay `label`, se agrega `padding-top: 1.4rem` y `padding-bottom: 0.5rem` para que el texto no quede debajo del label flotante.

#### Uso básico

```html
<!-- Input simple -->
<BaseInput v-model="email" type="email" label="Email" />

<!-- Con error -->
<BaseInput v-model="nombre" label="Nombre" :error="errors.nombre" />

<!-- Clearable con hint y evento enter -->
<BaseInput v-model="search" placeholder="BUSCAR" clearable
           hint="Presioná Enter para buscar" @enter="handleSearch" />

<!-- Contraseña con toggle -->
<BaseInput v-model="password" type="password" label="Contraseña" />

<!-- Textarea -->
<BaseInput v-model="notas" type="textarea" label="Notas" :rows="6" />
```

---

### `BaseModal.vue`

Modal accesible con `Teleport to="body"`. Bloquea el scroll del documento mientras está abierto y lo restaura al cerrar o al desmontar. Soporta cuatro tamaños, header/footer opcionales y cierre por overlay o por botón `✕`.

#### Props

**`modelValue`** `boolean` — controla la visibilidad del modal. Requerido para `v-model`.

**`title`** `string` — título renderizado en el header. Si no se pasa, el header solo muestra el botón `✕`.

**`size`** `'small' | 'medium' | 'large' | 'fullscreen'` — ancho del contenedor. Default: `'medium'`.

**`hideHeader`** `boolean` — oculta el header completo, incluyendo el botón `✕`. Default: `false`.

**`closeOnOverlayClick`** `boolean` — si `true`, hacer clic en el overlay oscuro cierra el modal. Default: `true`.

#### Emits

**`update:modelValue`** `[value: false]` — al cerrar. Habilita `v-model`.

**`close`** `[]` — al cerrar por cualquier mecanismo (botón ✕, overlay, o desde hijo vía `emit('close')`).

#### Tamaños del contenedor

```
small:      400px
medium:     800px
large:      1200px  (90vw en tablet ≤ 1024px)
fullscreen: 95vw × 95vh
```

#### Slots

**`default`** — contenido principal scrolleable dentro de `.modal-content`. Siempre renderiza.

**`footer`** — renderiza `.modal-footer` solo si `$slots.footer` existe. Tiene borde superior dorado y alineación `flex-end`.

#### Bloqueo y restauración de scroll

```typescript
// Al abrir/cerrar
watch(() => props.modelValue, (isOpen) => {
  document.body.style.overflow = isOpen ? 'hidden' : ''
})

// Al desmontar (navegar, cierre abrupto, etc.)
onUnmounted(() => {
  document.body.style.overflow = ''
})
```

El `onUnmounted` garantiza que el scroll siempre se restaura aunque el componente sea destruido mientras `modelValue` es `true`.

#### Scrollbar personalizada (webkit)

El `.modal-content` tiene scrollbar de 8px con thumb `rgba(218,165,32,0.3)` que sube a `0.5` en hover. Solo visible en navegadores webkit.

#### Transición de entrada/salida

```
Overlay:    opacity  0 → 1  (300ms ease)
Container:  scale(0.9) translateY(-20px) → natural  al entrar
            scale(0.9) translateY(+20px)            al salir
```

#### Comportamiento mobile (≤ 768px)

El overlay cambia a `align-items: flex-end` para que el modal aparezca desde abajo como un bottom sheet. El contenedor fuerza `width: 100% !important` ignorando el tamaño configurado, y adopta `border-radius: 20px 20px 0 0` (solo esquinas superiores).

#### Ejemplos de uso

```html
<!-- Quick View en HomeView -->
<BaseModal v-model="showQuickView" size="large">
  <ProducQuickView
    v-if="selectedProduct"
    :product="selectedProduct"
    @add-to-cart="handleAddToCart"
    @close="showQuickView = false"
  />
</BaseModal>

<!-- Confirmación en CartView -->
<BaseModal v-model="showRemoveModal" size="small" title="Eliminar pieza">
  <template #footer>
    <button @click="showRemoveModal = false">Cancelar</button>
    <button @click="confirmRemove">Confirmar</button>
  </template>
</BaseModal>
```

---

### `StarBackground.vue`

Fondo decorativo de partículas blancas con animación de parpadeo (`twinkle`). `position: fixed`, cubre toda la pantalla, `pointer-events: none`, `z-index: 0`. No interfiere con ningún elemento interactivo ni con lectores de pantalla (`aria-hidden="true"`).

#### Props

**`particleCount`** `number` — cantidad de estrellas generadas. Default: `80`.

**`opacity`** `number` — opacidad base de cada estrella (0-1). Default: `0.6`. Se aplica como estilo inline; el `@keyframes twinkle` modula la opacidad real entre `0.3` y `0.8`.

**`animated`** `boolean` — si `false`, pone `animationPlayState: 'paused'` en todas las estrellas. Default: `true`.

#### Uso en las vistas

```html
<!-- Siempre primer hijo del contenedor de la vista -->
<StarBackground :particleCount="80" />
```

#### Estilos pre-computados (fix de posiciones estables)

```typescript
const starStyles = computed<Record<string, string>[]>(() => {
  return Array.from({ length: props.particleCount }, () => ({
    left:              `${Math.random() * 100}%`,
    top:               `${Math.random() * 100}%`,
    animationDelay:    `${(Math.random() * 3).toFixed(2)}s`,
    animationDuration: `${(2 + Math.random() * 3).toFixed(2)}s`,
    width:             `${(1 + Math.random() * 2).toFixed(1)}px`,
    height:            `${(1 + Math.random() * 2).toFixed(1)}px`,
    opacity:           props.opacity.toString(),
    animationPlayState: props.animated ? 'running' : 'paused',
  }))
})
```

El `computed` no tiene dependencias reactivas, por lo que se evalúa **una sola vez** al montar el componente. Esto corrige el bug de versiones anteriores donde las posiciones se recalculaban en cada re-render (y las estrellas "saltaban") porque `Math.random()` se invocaba dentro del template directamente.

#### Animación `twinkle`

```css
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1);   }
  50%       { opacity: 0.8; transform: scale(1.3); }
}
```

Cada estrella tiene `animationDelay` (`0s–3s`) y `animationDuration` (`2s–5s`) aleatorios para que no parpadeen de forma sincronizada. La opacidad que controla el keyframe (`0.3–0.8`) es independiente del prop `opacity`, que se aplica como estilo inline y modula la base del render pero no los valores absolutos del keyframe.

---

## Patrones de uso combinado

### Input + Modal (formulario en modal)

```html
<BaseModal v-model="showForm" title="NUEVA DIRECCIÓN" size="small">
  <BaseInput v-model="form.calle"  label="Calle"          :error="errors.calle" />
  <BaseInput v-model="form.ciudad" label="Ciudad" />
  <BaseInput v-model="form.cp"     label="Código postal"  type="number" />
  <template #footer>
    <BaseButton variant="outline" @click="showForm = false">Cancelar</BaseButton>
    <BaseButton variant="primary" :arrow="true" @click="saveAddress">Guardar</BaseButton>
  </template>
</BaseModal>
```

### StarBackground como base de vista

```html
<div class="view-container">
  <StarBackground :particleCount="80" />
  <!-- resto de la vista encima, con z-index > 0 -->
</div>
```

---

## Dependencias

Ninguno de los cuatro componentes usa librerías externas. Solo Vue 3 core: `computed`, `watch`, `ref`, `onUnmounted`, `getCurrentInstance`, `Teleport` y `Transition`.

---

## Observaciones y deudas técnicas

**`BaseButton` — sin adopción:** las vistas del proyecto tienen al menos 3 variaciones distintas de botón primary (`HomeHero`, `HomeFeatured`, `CategorySection`, `CheckoutView`) con estilos hardcodeados. Adoptar `BaseButton` como estándar eliminaría esa inconsistencia.

**`BaseInput` — `inputId` resuelto:** la versión anterior generaba el id con `Math.random()` dentro de un `computed`, lo que funcionaba pero era incorrecto semánticamente. La versión actual usa `getCurrentInstance()?.uid`, que es el identificador interno único de Vue para cada instancia de componente. Es estable, no necesita deps reactivas y es seguro en SSR.

**`BaseModal` — `onUnmounted` resuelto:** la versión anterior no restauraba el scroll si el componente era destruido mientras el modal estaba abierto (ej: navegación rápida). La versión actual agrega `onUnmounted(() => document.body.style.overflow = '')` para cubrir este caso.

**`BaseModal` — modales anidados pendiente:** el mecanismo de `document.body.style.overflow = 'hidden'` directo puede romperse si se abren dos modales simultáneos y uno de ellos se cierra primero. Para ese escenario, se recomienda un contador global o `useScrollLock()` de VueUse.

**`StarBackground` — prop `opacity` vs keyframe:** el prop `opacity` se aplica como estilo inline de cada estrella pero el `@keyframes twinkle` reescribe la opacidad en el keyframe (va de `0.3` a `0.8` fijo, independiente del prop). El prop afecta la opacidad en el estado calculado CSS pero no los valores absolutos de la animación, lo que puede generar resultados inesperados con valores de `opacity` muy bajos.