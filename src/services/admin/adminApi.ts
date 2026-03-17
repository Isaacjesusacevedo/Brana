/**
 * adminApi.ts — Fetch wrapper autenticado para el panel de administración.
 *
 * Todos los servicios del panel admin usan adminFetch() en lugar de fetch() directamente.
 * Maneja automáticamente:
 *   - Cabecera Authorization: Bearer <token>
 *   - Content-Type: application/json (omitida para FormData — el browser agrega el boundary)
 *   - Respuestas 204 No Content (DELETE exitoso)
 *   - Deserialización de ApiResponse<T> y propagación de errores descriptivos
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080/api'

interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

/**
 * Wrapper de fetch con autenticación JWT.
 *
 * @param endpoint  Ruta relativa, ej: '/products' o '/products/abc-123'
 * @param token     JWT del admin (de useAdminStore)
 * @param options   RequestInit estándar (method, body, headers adicionales)
 */
export async function adminFetch<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string> ?? {}),
  }

  // No setear Content-Type para FormData: el browser lo hace con el boundary correcto
  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  // DELETE devuelve 204 sin body
  if (res.status === 204) return undefined as T

  const json: ApiResponse<T> = await res.json()

  if (!res.ok || !json.success) {
    throw new Error(json.errors?.[0] ?? json.message ?? `HTTP ${res.status}`)
  }

  return json.data
}

/**
 * Construye un query string a partir de un objeto, omitiendo valores undefined/null/''.
 * Ejemplo: buildQuery({ Page: 1, Categoria: 'remeras' }) → '?Page=1&Categoria=remeras'
 */
export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const q = new URLSearchParams()
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== '') {
      q.set(key, String(val))
    }
  }
  const str = q.toString()
  return str ? `?${str}` : ''
}
