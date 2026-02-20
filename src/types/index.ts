// User Types
export type UserRole = 'super_admin' | 'restaurant_owner' | 'property_owner' | 'customer';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email?: string;
  logoUrl?: string;
  isVerified: boolean;
  isActive: boolean;
  deliveryRadiusKm: number;
  commissionRate: number;
  rating?: number;
  deliveryTime?: string;
}

// Property (Hotel) Types
export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone: string;
  email?: string;
  totalRooms: number;
  commissionRate: number;
  isActive: boolean;
}

export interface PropertyRoom {
  id: string;
  propertyId: string;
  roomNumber: string;
  qrCodeUrl?: string;
  qrCodeData?: string;
  isActive: boolean;
}

// Menu Types
export interface MenuCategory {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isVegetarian: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
}

// Order Types
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type DeliveryType = 'restaurant_self' | 'third_party';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  propertyId: string;
  propertyName?: string;
  roomId: string;
  roomNumber?: string;
  restaurantId: string;
  restaurantName?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  deliveryCharge: number;
  platformFee: number;
  totalAmount: number;
  propertyCommission: number;
  platformCommission: number;
  restaurantPayout: number;
  deliveryType: DeliveryType;
  deliveryPartner?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
  confirmedAt?: string;
  preparedAt?: string;
  outForDeliveryAt?: string;
  deliveredAt?: string;
}

// Cart Types
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

// Earnings Types
export interface PropertyEarning {
  id: string;
  propertyId: string;
  orderId: string;
  orderAmount: number;
  commissionAmount: number;
  commissionRate: number;
  status: 'pending' | 'paid' | 'withdrawn';
  createdAt: string;
  paidAt?: string;
}

// Dashboard Stats
export interface RestaurantStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  averageOrderValue: number;
}

export interface PropertyStats {
  totalOrders: number;
  todayOrders: number;
  totalCommission: number;
  pendingCommission: number;
  activeRooms: number;
}
