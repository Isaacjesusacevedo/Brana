// src/types/api-types.ts
import type { Product } from './product';

// ==================== ORDER STATUS ====================

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

// ==================== PEDIDOS ====================
// Coincide exactamente con OrderDto del backend

export interface Order {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: OrderStatus;
  fechaPedido: string;
  talla: string;
  color: string;
  cantidad: number;
  notasAdicionales?: string;
  producto?: Product;
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

// ==================== USUARIO ====================
// Preparado para cuando implementes auth

export interface User {
  id: number | string;
  nombre: string;
  email: string;
  telefono?: string;
  avatar?: string;
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
// Preparado para implementación futura

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
  total: number;
  cantidadItems?: number;
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
  calificacion: number;
  titulo?: string;
  comentario: string;
  verificado?: boolean;
  fecha: string;
}