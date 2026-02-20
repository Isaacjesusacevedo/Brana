/**
 * api.ts — Servicio central de comunicación con el backend .NET
 *
 * Los tipos de retorno coinciden EXACTAMENTE con las interfaces de:
 *   - src/types/product.ts  (Product, Category, FeaturedItem)
 *   - src/types/api-types.ts (Order, OrderStatus, Cart, etc.)
 */

import type { Product, Category } from '@/types/product';
import type { Order, OrderStatus } from '@/types/api-types';

// ─── Configuración ────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// ─── Wrapper de respuesta del backend ────────────────────────────────────────
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PagedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ─── Parámetros de consulta ───────────────────────────────────────────────────
export interface ProductQueryParams {
  /** "remeras" | "buzos" | "pantalones" */
  categoria?: string;
  search?: string;
  minPrecio?: number;
  maxPrecio?: number;
  soloNuevos?: boolean;
  orderBy?: 'nombre' | 'precio' | 'nuevo';
  desc?: boolean;
  page?: number;
  pageSize?: number;
}

export interface OrderCreatePayload {
  nombre: string;
  email: string;
  telefono: string;
  productoId: string | number;
  talla: string;
  color: string;
  cantidad: number;
  notasAdicionales?: string;
}

// ─── Fetch helper con manejo de errores ──────────────────────────────────────
async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.errors?.[0] ?? `HTTP ${res.status}`);
  }

  return json.data;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      q.set(key, String(val));
    }
  }
  const str = q.toString();
  return str ? `?${str}` : '';
}

// ─── Productos ────────────────────────────────────────────────────────────────
export const productosApi = {
  /**
   * Lista paginada con filtros.
   *
   * Ejemplo para reemplazar los datos hardcodeados de HomeView.vue:
   *
   *   const { items } = await productosApi.getAll({ categoria: 'remeras', pageSize: 4 });
   */
  async getAll(params: ProductQueryParams = {}): Promise<PagedResponse<Product>> {
    const qs = buildQuery({
      Categoria:  params.categoria,
      Search:     params.search,
      MinPrecio:  params.minPrecio,
      MaxPrecio:  params.maxPrecio,
      SoloNuevos: params.soloNuevos,
      OrderBy:    params.orderBy,
      Desc:       params.desc,
      Page:       params.page ?? 1,
      PageSize:   params.pageSize ?? 12,
    });
    return apiFetch<PagedResponse<Product>>(`/products${qs}`);
  },

  /**
   * Piezas destacadas para HomePiezasDestacadas y HomeFeatured.
   * Reemplaza los arrays piezasDestacadas y featuredItems en HomeView.vue.
   */
  async getFeatured(limit = 6): Promise<Product[]> {
    return apiFetch<Product[]>(`/products/featured?limit=${limit}`);
  },

  /** Detalle completo de un producto — para ProductsDetailView.vue */
  async getById(id: string | number): Promise<Product> {
    return apiFetch<Product>(`/products/${id}`);
  },
};

// ─── Categorías ───────────────────────────────────────────────────────────────
export const categoriasApi = {
  /**
   * Devuelve las 3 categorías (remeras, buzos, pantalones) con sus productos.
   * Reemplaza el objeto reactivo 'categorias' en HomeView.vue.
   *
   * Retorna Category[] — compatible con la interfaz Category de product.ts:
   *   { id, nombre, descripcion, icono, ruta?, productos }
   */
  async getAll(): Promise<Category[]> {
    return apiFetch<Category[]>('/categories');
  },

  /** Una categoría con sus productos (soporta filtros y paginación) */
  async getBySlug(slug: string, params: ProductQueryParams = {}): Promise<Category> {
    const qs = buildQuery({
      Page:     params.page ?? 1,
      PageSize: params.pageSize ?? 12,
      OrderBy:  params.orderBy,
    });
    return apiFetch<Category>(`/categories/${slug}${qs}`);
  },
};

// ─── Pedidos ──────────────────────────────────────────────────────────────────
export const pedidosApi = {
  /**
   * Crear un pedido personalizado.
   *
   * Reemplaza el alert() en handleAddToCart de HomeView.vue:
   *
   *   const handleAddToCart = async (product, qty, color, size) => {
   *     await pedidosApi.create({
   *       nombre: contacto.nombre, email: contacto.email,
   *       telefono: contacto.telefono, productoId: product.id,
   *       talla: size ?? 'M', color: color ?? '', cantidad: qty
   *     });
   *   };
   */
  async create(payload: OrderCreatePayload): Promise<{ id: string; message: string }> {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getById(id: string): Promise<Order> {
    return apiFetch<Order>(`/orders/${id}`);
  },
};

// ─── Guía de migración de HomeView.vue ───────────────────────────────────────
/**
 * ANTES (hardcodeado):
 *   const piezasDestacadas = ref<Product[]>([ ... 200 líneas ... ]);
 *   const categorias = reactive({ remeras: {...}, buzos: {...}, pantalones: {...} });
 *
 * DESPUÉS (con API):
 *
 *   import { productosApi, categoriasApi } from '@/services/api';
 *   import { onMounted } from 'vue';
 *
 *   const piezasDestacadas = ref<Product[]>([]);
 *   const featuredItems     = ref<Product[]>([]);
 *   const categorias        = ref<Category[]>([]);
 *   const loading           = ref(true);
 *
 *   onMounted(async () => {
 *     try {
 *       const [featured, allCats] = await Promise.all([
 *         productosApi.getFeatured(6),
 *         categoriasApi.getAll(),
 *       ]);
 *       piezasDestacadas.value = featured;
 *       featuredItems.value    = featured;
 *       categorias.value       = allCats;
 *     } finally {
 *       loading.value = false;
 *     }
 *   });
 *
 * NOTA: En el template reemplazá:
 *   :category="categorias.remeras"  →  :category="categorias.find(c => c.slug === 'remeras')"
 */