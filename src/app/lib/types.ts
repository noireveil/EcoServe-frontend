// User profile type
export interface User {
  id: string
  full_name: string
  email: string
  role_type: 'consumer' | 'technician' | 'admin'
  last_location?: {
    lat: number
    lng: number
  }
  created_at: string
  updated_at: string
}

// Digital Product Passport
export interface DigitalProductPassport {
  id: string
  product_name: string
  brand: string
  model: string
  serial_number: string
  category: string
  purchase_date: string
  warranty_expiry?: string
  owner_id: string
  qr_code_url?: string
  status: 'active' | 'recycled' | 'disposed'
  created_at: string
  updated_at: string
}

// Repair Order
export interface RepairOrder {
  id: string
  consumer_id: string
  technician_id?: string
  device_id: string
  issue_description: string
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  scheduled_date?: string
  completed_date?: string
  cost_estimate?: number
  cost_final?: number
  notes?: string
  created_at: string
  updated_at: string
}

// Impact Tracker
export interface ImpactTracker {
  id: string
  user_id: string
  devices_recycled: number
  co2_saved: number // in kg
  e_waste_reduced: number // in kg
  energy_saved: number // in kWh
  trees_equivalent: number
  last_updated: string
}

// Location type for maps
export interface Location {
  lat: number
  lng: number
  address?: string
}

// Service Request (extended)
export interface ServiceRequest {
  id: string
  repair_order: RepairOrder
  consumer: User
  technician?: User
  device: DigitalProductPassport
  location: Location
}
