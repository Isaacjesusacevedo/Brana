// Tipos para el componente BaseCarousel
export interface CarouselItem {
  id: number | string;
  imagen: string;
  titulo?: string;
  nombre?: string;
  categoria?: string;
  precio?: number;
  precioAnterior?: number;
  nuevo?: boolean;
  colores?: string[];
  [key: string]: any;
}

export type CarouselMode = 'circular' | 'sliding' | 'fade';
export type CarouselVariant = 'hero' | 'category' | 'default';

export interface CarouselProps {
  items: CarouselItem[];
  mode?: CarouselMode;
  variant?: CarouselVariant;
  autoRotate?: boolean;
  rotationInterval?: number;
  centerText?: string;
  showControls?: boolean;
  showIndicators?: boolean;
}