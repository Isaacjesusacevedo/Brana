import { Cloudinary } from '@cloudinary/url-gen'
import { format, quality } from '@cloudinary/url-gen/actions/delivery'
import { auto as autoFormat } from '@cloudinary/url-gen/qualifiers/format'
import { auto as autoQuality } from '@cloudinary/url-gen/qualifiers/quality'
import type { CloudinaryImage } from '@cloudinary/url-gen'

/**
 * Instancia global de Cloudinary.
 * Requiere la variable de entorno VITE_CLOUDINARY_CLOUD_NAME.
 */
const cld = new Cloudinary({
  cloud: { cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? '' },
  url: { secure: true },
})

export default cld

/**
 * Dado una URL de Cloudinary, extrae el public ID y retorna un CloudinaryImage
 * con optimización automática de formato (f_auto) y calidad (q_auto) aplicada.
 *
 * Retorna null si:
 * - La URL es undefined o vacía.
 * - VITE_CLOUDINARY_CLOUD_NAME no está configurada.
 * - La URL no coincide con el patrón de subida de Cloudinary (/upload/).
 *
 * Esto permite un fallback transparente a <img> estándar mientras las URLs
 * del seed aún no estén subidas a Cloudinary.
 *
 * @example
 * // URL: https://res.cloudinary.com/mi-cloud/image/upload/v1234/productos/remera-1.jpg
 * // Public ID extraído: productos/remera-1
 * const img = buildCldImage(url)
 * // → CloudinaryImage con f_auto,q_auto aplicados
 */
export function buildCldImage(url: string | undefined): CloudinaryImage | null {
  if (!url || !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) return null

  // Captura todo lo que está después de /upload/ (saltando la versión opcional v\d+/)
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/)
  if (!match) return null

  // Elimina la extensión del archivo para obtener el public ID limpio
  const publicId = match[1]!.replace(/\.[^/.]+$/, '')

  return cld
    .image(publicId)
    .delivery(format(autoFormat()))
    .delivery(quality(autoQuality()))
}
