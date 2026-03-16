import { createRouter, createWebHistory } from 'vue-router'
import adminRoutes from './admin.routes'

// Vistas existentes
import HomeView from '@/views/tienda/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // ==================== HOME ====================
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // ==================== CATÁLOGO ====================
    {
      path: '/catalogo',
      name: 'catalogo',
      component: () => import('@/views/tienda/CatalogoView.vue'),
    },

    // ==================== PRODUCTOS ====================
    {
      path: '/productos',
      name: 'productos',
      component: () => import('@/views/tienda/ProductsView.vue'),
    },
    {
      path: '/producto/:id',
      name: 'producto-detalle',
      component: () => import('@/views/tienda/ProductoView.vue'),
      props: true,
    },
    // Redirect para mantener compatibilidad con URLs en plural
    {
      path: '/productos/:id',
      redirect: to => ({
        name: 'producto-detalle',
        params: to.params
      })
    },

    // ==================== CATEGORÍAS ====================
    // Redirect de categorías al catálogo con filtro
    {
      path: '/categoria/:categoria',
      redirect: to => ({
        name: 'catalogo',
        query: { categoria: to.params.categoria }
      })
    },
    // Rutas específicas que usa HomeView
    {
      path: '/categoria/remeras',
      redirect: { name: 'catalogo', query: { categoria: 'remeras' } }
    },
    {
      path: '/categoria/buzos',
      redirect: { name: 'catalogo', query: { categoria: 'buzos' } }
    },
    {
      path: '/categoria/pantalones',
      redirect: { name: 'catalogo', query: { categoria: 'pantalones' } }
    },

    // ==================== COLECCIÓN ====================
    // Redirect de colección a catálogo
    {
      path: '/coleccion',
      redirect: { name: 'catalogo' }
    },
    // /coleccion/fusion — próximo lanzamiento JP·ARG
    // Redirige al catálogo mientras la vista de la colección no exista.
    // Reemplazar por component: () => import('@/views/coleccion/FusionView.vue') cuando esté lista.
    {
      path: '/coleccion/fusion',
      redirect: { name: 'catalogo' }
    },

    // ==================== CARRITO ====================
    {
      path: '/carrito',
      name: 'carrito',
      component: () => import('@/views/tienda/CarritoView.vue'),
    },

    // ==================== CHECKOUT ====================
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/tienda/CheckoutView.vue'),
    },

    // ==================== NOTICIAS ====================
    {
      path: '/noticias',
      name: 'noticias',
      component: () => import('@/views/noticias/NoticiasView.vue'),
    },

    // ==================== RUTAS TEMPORALES ====================
    // Estas rutas redirigen hasta que crees las vistas
    
    {
      path: '/filosofia',
      name: 'filosofia',
      // Temporalmente redirige a home
      redirect: { name: 'home' }
    },
    {
      path: '/contacto',
      name: 'contacto',
      // Temporalmente redirige a home
      redirect: { name: 'home' }
    },

    // ==================== RUTAS FOOTER SIN VISTA ====================
    // Pendientes de creación. Redirigen al destino más cercano existente
    // hasta que se implemente cada vista.
    {
      path: '/about',
      redirect: { name: 'home' }           // → AboutView cuando exista
    },
    {
      path: '/terminos',
      redirect: { name: 'home' }           // → TerminosView cuando exista
    },
    {
      path: '/privacidad',
      redirect: { name: 'home' }           // → PrivacidadView cuando exista
    },
    {
      path: '/envios',
      redirect: { name: 'home' }           // → EnviosView cuando exista
    },
    {
      path: '/faq',
      redirect: { name: 'home' }           // → FaqView cuando exista
    },

    // ==================== ADMIN ====================
    ...adminRoutes,

    // ==================== 404 - NOT FOUND ====================
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
      // Cuando crees NotFoundView.vue, cámbialo por:
      // component: () => import('@/views/NotFoundView.vue')
    },
  ],

  // Scroll automático al top en cada navegación
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  },
})

// ==================== NAVIGATION GUARD ====================
// Protege todas las rutas que tienen meta.requiresAdminAuth
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAdminAuth) {
    const token = localStorage.getItem('brana_admin_token')
    if (!token) {
      next({ name: 'admin-login' })
      return
    }
  }
  next()
})

export default router