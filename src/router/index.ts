import { createRouter, createWebHistory } from 'vue-router'

// Layout principal
import HomeView from '@/views/home/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    // HOME
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // PRODUCTOS
    {
      path: '/productos',
      name: 'productos',
      component: () => import('@/views/products/ProductsView.vue'),
    },
    {
      path: '/productos/:id',
      name: 'producto-detalle',
      component: () => import('@/views/products/ProductsDetailView.vue'),
      props: true,
    },

    // CARRITO
    {
      path: '/carrito',
      name: 'carrito',
      component: () => import('@/views/cart/CartView.vue'),
    },

    // CHECKOUT
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/checkout/CheckoutView.vue'),
    },

    // OTRAS PÁGINAS
    {
      path: '/catalogo',
      name: 'catalogo',
      component: () => import('@/views/CatalogoView.vue'),
    },
    {
      path: '/noticias',
      name: 'noticias',
      component: () => import('@/views/NoticiasView.vue'),
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: () => import('@/views/ContactoView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
    },

    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

export default router
