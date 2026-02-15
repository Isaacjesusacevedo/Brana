import { createRouter, createWebHistory } from 'vue-router'

// Vistas existentes
import HomeView from '@/views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // ==================== HOME ====================
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // ==================== PRODUCTOS ====================
    {
      path: '/productos',
      name: 'productos',
      component: () => import('@/views/products/ProductsView.vue'),
    },
    {
      path: '/producto/:id',
      name: 'producto-detalle',
      component: () => import('@/views/products/ProductsDetailView.vue'),
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
    // Temporalmente redirigir a productos con filtro
    {
      path: '/categoria/:categoria',
      redirect: to => ({
        name: 'productos',
        query: { categoria: to.params.categoria }
      })
    },
    // Rutas específicas que usa HomeView
    {
      path: '/categoria/remeras',
      redirect: { name: 'productos', query: { categoria: 'remeras' } }
    },
    {
      path: '/categoria/buzos',
      redirect: { name: 'productos', query: { categoria: 'buzos' } }
    },
    {
      path: '/categoria/pantalones',
      redirect: { name: 'productos', query: { categoria: 'pantalones' } }
    },

    // ==================== CATÁLOGO/COLECCIÓN ====================
    // Redirect de colección a productos
    {
      path: '/coleccion',
      redirect: { name: 'productos' }
    },
    {
      path: '/catalogo',
      redirect: { name: 'productos' }
    },

    // ==================== CARRITO ====================
    {
      path: '/carrito',
      name: 'carrito',
      component: () => import('@/views/cart/CartView.vue'),
    },

    // ==================== CHECKOUT ====================
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/checkout/CheckoutView.vue'),
    },

    // ==================== RUTAS TEMPORALES ====================
    // Estas rutas redirigen a home hasta que crees las vistas
    
    {
      path: '/filosofia',
      name: 'filosofia',
      // Temporalmente redirige a about
      redirect: { name: 'about' }
    },
    {
      path: '/contacto',
      name: 'contacto',
      // Temporalmente redirige a about
      redirect: { name: 'about' }
    },
    {
      path: '/noticias',
      name: 'noticias',
      // Temporalmente redirige a home
      redirect: { name: 'home' }
    },

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

export default router