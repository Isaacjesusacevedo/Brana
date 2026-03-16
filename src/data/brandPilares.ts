/**
 * brandPilares.ts
 * Única fuente de verdad para los 4 pilares de marca BRANA.
 *
 * Consumidores:
 *   - HomePilares.vue   → usa la forma completa (BrandPilar)
 *   - HomePhilosophy.vue → usa solo { simbolo, nombre } (PilarHint)
 */

export interface BrandPilar {
    id: string;
    simbolo: string;
    nombre: string;
    descripcion: string;
    color: string;
  }
  
  /** Tipo reducido que usa HomePhilosophy para el hint visual */
  export type PilarHint = Pick<BrandPilar, 'simbolo' | 'nombre'>;
  
  export const BRAND_PILARES: BrandPilar[] = [
    {
      id: 'autenticidad',
      simbolo: '◈',
      nombre: 'AUTENTICIDAD',
      descripcion:
        'Cada diseño nace de una visión genuina. La coherencia entre lo que la marca dice y lo que hace es su activo más valioso.',
      color: '#DAA520',
    },
    {
      id: 'simbolismo',
      simbolo: '◆',
      nombre: 'SIMBOLISMO',
      descripcion:
        'Los estampados no son decorativos: son semióticos. Cada símbolo tiene intención y resonancia con el universo esotérico.',
      color: '#C0C0C0',
    },
    {
      id: 'comunidad',
      simbolo: '☿',
      nombre: 'COMUNIDAD',
      descripcion:
        'Brana no vende a un público: construye una tribu. La ropa es el código de reconocimiento entre personas que comparten el mismo universo interior.',
      color: '#8B5CF6',
    },
    {
      id: 'transformacion',
      simbolo: '✦',
      nombre: 'TRANSFORMACIÓN',
      descripcion:
        'La prenda activa algo en quien la usa. El símbolo portado en el cuerpo modifica la percepción propia y la de quienes lo rodean.',
      color: '#DC2626',
    },
  ];