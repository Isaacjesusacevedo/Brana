<template>
  <div class="admin-dashboard">
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de administración de BRANA.</p>
    </div>

    <div class="quick-links">
      <RouterLink :to="{ name: 'admin-productos' }" class="quick-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span>Nuevo Producto</span>
        <small>Agregar al catálogo</small>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-pedidos' }" class="quick-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        <span>Pedidos</span>
        <small>Ver y gestionar pedidos</small>
      </RouterLink>

      <RouterLink :to="{ name: 'admin-usuarios' }" class="quick-card">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <span>Usuarios</span>
        <small>Administrar usuarios</small>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.admin-dashboard {
  max-width: 760px;
}

.page-header {
  margin-bottom: 36px;
}

.page-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.page-header p {
  color: #666;
  font-size: 14px;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 12px;
  text-decoration: none;
  color: #777;
  transition: all 0.2s;
  text-align: center;
}

.quick-card svg {
  width: 36px;
  height: 36px;
  color: #DAA520;
}

.quick-card span {
  font-size: 15px;
  font-weight: 600;
  color: #ccc;
}

.quick-card small {
  font-size: 12px;
  color: #555;
}

.quick-card:hover {
  border-color: #DAA520;
  background: rgba(218, 165, 32, 0.05);
}
</style>
