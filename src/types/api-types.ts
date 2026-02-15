// Tipos adicionales para la API

// ==================== USUARIO ====================

export interface User {
  id: number | string;
  nombre: string;
  email: string;
  telefono?: string;
  avatar?: string;
  direcciones?: ShippingAddress[];
  fechaRegistro?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ==================== CARRITO ====================

export interface CartItem {
  id: number | string;
  productoId: number | string;
  producto?: Product;
  cantidad: number;
  talla?: string;
  color?: string;
  precio: number;
  subtotal?: number;
}

export interface Cart {
  id: number | string;
  items: CartItem[];
  subtotal: number;
  impuestos?: number;
  envio?: number;
  descuentos?: number;
  total: number;
  cantidadItems?: number;
}

export interface AddToCartData {
  productoId: number | string;
  cantidad: number;
  talla?: string;
  color?: string;
}

// ==================== PEDIDOS ====================

export interface ShippingAddress {
  id?: number | string;
  nombre?: string;
  calle: string;
  numero?: string;
  colonia?: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
  telefono?: string;
  referencias?: string;
  esPrincipal?: boolean;
}

export interface Order {
  id: number | string;
  numeroOrden?: string;
  items: CartItem[];
  subtotal: number;
  impuestos?: number;
  envio?: number;
  descuentos?: number;
  total: number;
  estado: OrderStatus;
  direccionEnvio: ShippingAddress;
  metodoPago: string;
  notas?: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
  fechaEntregaEstimada?: string;
  tracking?: string;
}

export type OrderStatus = 
  | 'pendiente'
  | 'confirmado'
  | 'procesando'
  | 'enviado'
  | 'entregado'
  | 'cancelado'
  | 'devuelto';

export interface CreateOrderData {
  items?: CartItem[];
  direccionEnvio: ShippingAddress;
  metodoPago: string;
  notas?: string;
  cuponDescuento?: string;
}

// ==================== PAGOS ====================

export interface PaymentMethod {
  id: string;
  tipo: 'tarjeta' | 'transferencia' | 'paypal' | 'efectivo';
  nombre: string;
  descripcion?: string;
  icono?: string;
  activo: boolean;
}

export interface PaymentInfo {
  metodo: string;
  estado: 'pendiente' | 'procesando' | 'completado' | 'fallido';
  monto: number;
  transaccionId?: string;
  fecha?: string;
}

// ==================== CUPONES ====================

export interface Coupon {
  id: number | string;
  codigo: string;
  tipo: 'porcentaje' | 'monto';
  valor: number;
  descripcion?: string;
  fechaInicio?: string;
  fechaExpiracion?: string;
  usos?: number;
  usosMaximos?: number;
  activo: boolean;
}

// ==================== REVIEWS ====================

export interface Review {
  id: number | string;
  productoId: number | string;
  usuarioId: number | string;
  usuario?: {
    nombre: string;
    avatar?: string;
  };
  calificacion: number; // 1-5
  titulo?: string;
  comentario: string;
  imagenes?: string[];
  verificado?: boolean;
  helpful?: number;
  fecha: string;
}

export interface CreateReviewData {
  productoId: number | string;
  calificacion: number;
  titulo?: string;
  comentario: string;
  imagenes?: File[];
}

// ==================== WISHLIST ====================

export interface WishlistItem {
  id: number | string;
  productoId: number | string;
  producto?: Product;
  fechaAgregado: string;
}

export interface Wishlist {
  id: number | string;
  items: WishlistItem[];
  cantidadItems?: number;
}

// Importar Product desde product.ts para evitar duplicados
import type { Product } from './product';