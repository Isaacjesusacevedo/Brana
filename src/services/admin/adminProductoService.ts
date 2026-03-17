/**
 * adminProductoService.ts — CRUD de productos para el panel de administración.
 *
 * Endpoints del backend mapeados:
 *   GET    /api/products              → getAll(token, params)
 *   GET    /api/products/{id}         → getById(token, id)
 *   POST   /api/products  [form-data] → create(token, payload)
 *   PUT    /api/products/{id} [json]  → update(token, id, payload)
 *   DELETE /api/products/{id}         → remove(token, id)
 *
 * Notas importantes:
 *   - create() usa multipart/form-data (el backend recibe IFormFile? imagen)
 *   - update() usa JSON body (el backend no soporta file upload en PUT)
 *   - Las listas en FormData se envían con la misma clave repetida (model binding de ASP.NET Core)
 */

import { adminFetch, buildQuery } from './adminApi'
import type { Product } from '@/types/producto.types'
import type { PagedResponse } from '@/services/tienda/api'

// ─── Tipos de parámetros y payloads ──────────────────────────────────────────

export interface ProductListParams {
  categoria?: string
  search?: string
  page?: number
  pageSize?: number
  orderBy?: string
  desc?: boolean
}

/** Payload para POST /api/products — envía imagen como File (multipart) */
export interface ProductCreatePayload {
  nombre?: string
  descripcion: string
  precio?: number
  precioAnterior?: number
  categoriaId: number
  nuevo?: boolean
  stock?: number
  tallas?: string[]
  colores?: string[]
  caracteristicas?: string[]
  imagen: File
}

/** Payload para PUT /api/products/{id} — envía JSON (sin archivo) */
export interface ProductUpdatePayload {
  nombre?: string
  descripcion?: string
  precio?: number
  precioAnterior?: number
  categoriaId?: number
  nuevo?: boolean
  stock?: number
  tallas?: string[]
  colores?: string[]
  caracteristicas?: string[]
  /** URLs de imágenes existentes a conservar */
  imagenUrls?: string[]
}

// ─── Servicio ─────────────────────────────────────────────────────────────────

export const adminProductoService = {
  /**
   * Lista paginada de productos con filtros opcionales.
   * Usa los mismos query params que el endpoint público (/api/products).
   */
  async getAll(token: string, params: ProductListParams = {}): Promise<PagedResponse<Product>> {
    const qs = buildQuery({
      Categoria: params.categoria,
      Search:    params.search,
      Page:      params.page    ?? 1,
      PageSize:  params.pageSize ?? 20,
      OrderBy:   params.orderBy  ?? 'nombre',
      Desc:      params.desc,
    })
    return adminFetch<PagedResponse<Product>>(`/products${qs}`, token)
  },

  /** Detalle completo de un producto por ID */
  async getById(token: string, id: string): Promise<Product> {
    return adminFetch<Product>(`/products/${id}`, token)
  },

  /**
   * Crear un nuevo producto con imagen.
   *
   * El backend acepta multipart/form-data:
   *   - Campos de texto → [FromForm] ProductCreateDto
   *   - Archivo       → IFormFile? imagen (nombre del parámetro en el controlador)
   *
   * Las listas (tallas, colores, etc.) se envían con la misma clave repetida:
   *   fd.append('tallas', 'S'), fd.append('tallas', 'M') → List<string> = ['S','M']
   */
  async create(token: string, payload: ProductCreatePayload): Promise<Product> {
    const fd = new FormData()

    if (payload.nombre)                  fd.append('nombre',       payload.nombre)
    fd.append('descripcion', payload.descripcion)
    if (payload.precio      !== undefined) fd.append('precio',        String(payload.precio))
    if (payload.precioAnterior !== undefined) fd.append('precioAnterior', String(payload.precioAnterior))
    fd.append('categoriaId', String(payload.categoriaId))
    fd.append('nuevo',       String(payload.nuevo ?? false))
    if (payload.stock !== undefined)     fd.append('stock',         String(payload.stock))

    payload.tallas?.forEach(t         => fd.append('tallas',         t))
    payload.colores?.forEach(c        => fd.append('colores',        c))
    payload.caracteristicas?.forEach(c => fd.append('caracteristicas', c))

    // 'imagen' debe coincidir con el nombre del parámetro IFormFile en el controlador
    fd.append('imagen', payload.imagen)

    return adminFetch<Product>('/products', token, { method: 'POST', body: fd })
  },

  /**
   * Actualizar metadatos de un producto existente.
   *
   * El backend usa [FromBody] ProductUpdateDto (JSON).
   * No soporta cambio de imagen en esta operación.
   * Para conservar las imágenes actuales, incluir imagenUrls con las URLs existentes.
   */
  async update(token: string, id: string, payload: ProductUpdatePayload): Promise<Product> {
    return adminFetch<Product>(`/products/${id}`, token, {
      method: 'PUT',
      body:   JSON.stringify({ id, ...payload }),
    })
  },

  /**
   * Eliminar un producto por ID.
   * El backend devuelve 204 No Content en caso de éxito.
   */
  async remove(token: string, id: string): Promise<void> {
    return adminFetch<void>(`/products/${id}`, token, { method: 'DELETE' })
  },
}
