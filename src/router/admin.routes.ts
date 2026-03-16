import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  // Ruta secreta — entrada oculta al panel (no figura en Navbar ni Footer)
  // Redirige al dashboard protegido; el guard se encargará del login si no hay token.
  {
    path: '/admin-dashboard-secret',
    redirect: { name: 'admin-dashboard' },
  },

  // Login sin layout — no necesita sidebar ni header de admin
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/views/admin/AdminLoginView.vue'),
  },

  // Rutas protegidas — todas renderizan dentro de AdminLayout
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAdminAuth: true },
    children: [
      {
        path: '',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/AdminDashboardView.vue'),
      },
      {
        path: 'pedidos',
        name: 'admin-pedidos',
        component: () => import('@/views/admin/AdminPedidosView.vue'),
      },
      {
        path: 'productos',
        name: 'admin-productos',
        component: () => import('@/views/admin/AdminProductosView.vue'),
      },
      {
        path: 'usuarios',
        name: 'admin-usuarios',
        component: () => import('@/views/admin/AdminUsuariosView.vue'),
      },
    ],
  },
]

export default adminRoutes
