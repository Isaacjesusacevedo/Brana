// API Services para ARCANA Fashion Hub

import type { CarouselItem, Category, Product } from '@/types/Index';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Helper para hacer requests
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// ==================== CARRUSEL ====================

export const carouselService = {
  // Obtener items del carrusel
  getItems: async (): Promise<CarouselItem[]> => {
    return request<CarouselItem[]>('/carrusel');
  },

  // Obtener items destacados
  getFeatured: async (): Promise<CarouselItem[]> => {
    return request<CarouselItem[]>('/carrusel/featured');
  },
};

// ==================== CATEGORÍAS ====================

export const categoryService = {
  // Obtener todas las categorías
  getAll: async (): Promise<Category[]> => {
    return request<Category[]>('/categorias');
  },

  // Obtener categoría por ID
  getById: async (id: number | string): Promise<Category> => {
    return request<Category>(`/categorias/${id}`);
  },

  // Obtener categoría por slug
  getBySlug: async (slug: string): Promise<Category> => {
    return request<Category>(`/categorias/slug/${slug}`);
  },
};

// ==================== PRODUCTOS ====================

export interface ProductQueryParams {
  categoria?: string;
  limit?: number;
  offset?: number;
}

export interface ProductFilters {
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
  tallas?: string[];
  colores?: string[];
}

export const productService = {
  // Obtener todos los productos
  getAll: async (params?: ProductQueryParams): Promise<Product[]> => {
    const queryParams = new URLSearchParams();
    
    if (params?.categoria) queryParams.append('categoria', params.categoria);
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/productos?${queryString}` : '/productos';
    
    return request<Product[]>(endpoint);
  },

  // Obtener producto por ID
  getById: async (id: number | string): Promise<Product> => {
    return request<Product>(`/productos/${id}`);
  },

  // Obtener productos destacados
  getFeatured: async (): Promise<Product[]> => {
    return request<Product[]>('/productos/featured');
  },

  // Buscar productos
  search: async (query: string): Promise<Product[]> => {
    return request<Product[]>(`/productos/search?q=${encodeURIComponent(query)}`);
  },

  // Filtrar productos
  filter: async (filters: ProductFilters): Promise<Product[]> => {
    return request<Product[]>('/productos/filter', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  },
};

// ==================== USUARIO ====================

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: number | string;
  nombre: string;
  email: string;
  [key: string]: any;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

export const userService = {
  // Login
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Guardar token
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }
    
    return response;
  },

  // Registro
  register: async (data: RegisterData): Promise<LoginResponse> => {
    return request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener perfil
  getProfile: async (): Promise<User> => {
    return request<User>('/usuario/perfil');
  },

  // Actualizar perfil
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return request<User>('/usuario/perfil', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('auth_token');
  },
};

// ==================== CARRITO ====================

export interface CartItem {
  id: number | string;
  productoId: number | string;
  producto: Product;
  cantidad: number;
  talla?: string;
  color?: string;
  precio: number;
}

export interface Cart {
  id: number | string;
  items: CartItem[];
  total: number;
  subtotal: number;
  impuestos?: number;
  envio?: number;
}

export interface AddToCartData {
  productoId: number | string;
  cantidad: number;
  talla?: string;
  color?: string;
}

export const cartService = {
  // Obtener carrito
  get: async (): Promise<Cart> => {
    return request<Cart>('/carrito');
  },

  // Agregar item al carrito
  addItem: async (data: AddToCartData): Promise<Cart> => {
    return request<Cart>('/carrito/items', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Actualizar cantidad de item
  updateItem: async (itemId: number | string, cantidad: number): Promise<Cart> => {
    return request<Cart>(`/carrito/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ cantidad }),
    });
  },

  // Eliminar item del carrito
  removeItem: async (itemId: number | string): Promise<Cart> => {
    return request<Cart>(`/carrito/items/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Limpiar carrito
  clear: async (): Promise<Cart> => {
    return request<Cart>('/carrito', {
      method: 'DELETE',
    });
  },
};

// ==================== PEDIDOS ====================

export interface ShippingAddress {
  calle: string;
  ciudad: string;
  estado: string;
  codigoPostal: string;
  pais: string;
  telefono?: string;
}

export interface CreateOrderData {
  items: CartItem[];
  direccionEnvio: ShippingAddress;
  metodoPago: string;
  notas?: string;
}

export interface Order {
  id: number | string;
  items: CartItem[];
  total: number;
  estado: string;
  direccionEnvio: ShippingAddress;
  metodoPago: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
}

export const orderService = {
  // Crear pedido
  create: async (data: CreateOrderData): Promise<Order> => {
    return request<Order>('/pedidos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Obtener pedidos del usuario
  getAll: async (): Promise<Order[]> => {
    return request<Order[]>('/pedidos');
  },

  // Obtener pedido por ID
  getById: async (id: number | string): Promise<Order> => {
    return request<Order>(`/pedidos/${id}`);
  },

  // Cancelar pedido
  cancel: async (id: number | string): Promise<Order> => {
    return request<Order>(`/pedidos/${id}/cancel`, {
      method: 'POST',
    });
  },
};

// ==================== HELPERS ====================

// Manejar errores de forma centralizada
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Error de respuesta del servidor
    console.error('Error del servidor:', error.response.data);
    return error.response.data.message || 'Error del servidor';
  } else if (error.request) {
    // Error de red
    console.error('Error de red:', error.request);
    return 'Error de conexión. Por favor, verifica tu conexión a internet.';
  } else {
    // Otro tipo de error
    console.error('Error:', error.message);
    return error.message || 'Ocurrió un error inesperado';
  }
};

// ==================== EXPORTACIONES ====================

// Exportar servicios con nombres en español (compatibilidad)
export const carruselService = carouselService;
export const categoriaService = categoryService;
export const productoService = productService;
export const usuarioService = userService;
export const carritoService = cartService;
export const pedidoService = orderService;

// Exportar todos los servicios (default export)
export default {
  // Nombres en inglés (recomendado)
  carousel: carouselService,
  category: categoryService,
  product: productService,
  user: userService,
  cart: cartService,
  order: orderService,
  
  // Nombres en español (compatibilidad con código existente)
  carrusel: carouselService,
  categoria: categoryService,
  producto: productService,
  usuario: userService,
  carrito: cartService,
  pedido: orderService,
};