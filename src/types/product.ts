// Tipos para productos y categorías
export interface Product {
  id: number | string;
  nombre?: string;  // Opcional para compatibilidad con CarouselItem
  titulo?: string;  // Opcional para compatibilidad con CarouselItem
  imagen: string;
  imagenes?: string[];  // ✅ NUEVO - Array de imágenes para galería
  precio?: number;  // Opcional para items que no tienen precio (featured items)
  precioAnterior?: number;
  categoria?: string;
  nuevo?: boolean;
  colores?: string[];
  descripcion?: string;
  caracteristicas?: string[];  // ✅ NUEVO - Array de características del producto
  stock?: number;
  tallas?: string[];
  ruta?: string;
  badge?: string;  // ✅ NUEVO - Badge destacado (ej: "EXCLUSIVO", "NUEVO")
  size?: 'normal' | 'featured' | 'wide' | 'tall';  // ✅ NUEVO - Tamaño en grid
}

export interface Category {
  id: number | string;
  nombre: string;
  descripcion: string;
  icono: string;
  ruta?: string;
  productos: Product[];
}

export interface FeaturedItem {
  id: number | string;
  imagen: string;
  titulo: string;
  categoria: string;
  // Campos opcionales para compatibilidad con CarouselItem
  nombre?: string;
  precio?: number;
  precioAnterior?: number;
  nuevo?: boolean;
  colores?: string[];
}