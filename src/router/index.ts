import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    // nuevas páginas
    { path: '/catalogo', name: 'comunidad', component: () => import('../views/CatalogoView.vue') },
    { path: '/noticias',  name: 'noticias',  component: () => import('../views/NoticiasView.vue') },
    { path: '/contacto',  name: 'contacto',  component: () => import('../views/ContactoView.vue') },

    // opcional: 404
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFound.vue') },
  ],
})

export default router
