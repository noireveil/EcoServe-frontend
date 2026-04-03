// User & Authentication Types
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'user' | 'customer' | 'technician';
  created_at: string;
}

export interface AuthRequestPayload {
  full_name: string;
  email: string;
}

export interface AuthVerifyPayload {
  email: string;
  code: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// AI Triage Types
export interface TriageRequest {
  message: string;
}

export interface TriageResponse {
  message: string;
  data: {
    reply: string;
    diagnosis?: string;
    emergency_steps?: string;
    estimated_cost?: string;
    recommended_category?: string;
  };
}

// Technician Types
export interface Technician {
  id: string;
  user_id: string;
  user?: User;
  specialization: 'Pendingin & Komersial' | 'Home Appliances' | 'IT & Gadget';
  latitude: number;
  longitude: number;
  rating?: number;
  total_orders?: number;
  distance_km?: number;
  created_at: string;
}

export interface NearbyTechniciansParams {
  lat: number;
  lon: number;
  radius_km: number;
}

export interface NearbyTechniciansResponse {
  message: string;
  data: Technician[];
}

// Order Types
export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Order {
  id: string;
  user_id: string;
  technician_id?: string;
  device_category: 'Pendingin & Komersial' | 'Home Appliances' | 'IT & Gadget';
  problem_description: string;
  status: OrderStatus;
  diagnosis?: string;
  estimated_cost?: number;
  ewaste_prevented_kg?: number;
  rating?: number;
  review?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface CreateOrderPayload {
  device_category: string;
  problem_description: string;
}

export interface CompleteOrderPayload {
  device_category: string;
}

// E-Waste Calculator Constants
export const E_WASTE_WEIGHTS: Record<string, number> = {
  'Pendingin & Komersial': 45.50,
  'Home Appliances': 22.00,
  'IT & Gadget': 1.25,
};

// Impact Tracker Types
export interface ImpactMetrics {
  total_units_restored: number;
  total_ewaste_reduced_kg: number;
  total_ewaste_reduced_tons: number;
}

export interface UserImpact {
  user_id: string;
  total_orders: number;
  completed_orders: number;
  ewaste_prevented_kg: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned_at: string;
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// API Response Types
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  message: string;
  status: string;
}
