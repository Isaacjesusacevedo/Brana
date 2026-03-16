// src/types/product.ts

export interface Product {
  id: number | string;
  nombre?: string;
  titulo?: string;
  imagen: string;
  imagenes?: string[];
  precio?: number;
  precioAnterior?: number;
  categoria?: string;
  nuevo?: boolean;
  colores?: string[];
  descripcion?: string;
  caracteristicas?: string[];
  stock?: number;
  tallas?: string[];
  ruta?: string;
  badge?: string;
  size?: 'normal' | 'featured' | 'wide' | 'tall';
}

export interface Category {
  id: number | string;
  slug: string;           // ← AGREGADO: viene del backend, necesario para filtros
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
  nombre?: string;
  precio?: number;
  precioAnterior?: number;
  nuevo?: boolean;
  colores?: string[];
}