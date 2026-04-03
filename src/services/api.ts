import {
  AuthRequestPayload,
  AuthVerifyPayload,
  AuthResponse,
  TriageRequest,
  TriageResponse,
  Technician,
  NearbyTechniciansParams,
  Order,
  CreateOrderPayload,
  CompleteOrderPayload,
  ImpactMetrics,
  UserImpact,
  ApiResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ecoserve-api.onrender.com';

// Helper function for API requests
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  silent: boolean = false
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Include cookies in requests
    credentials: 'include',
  };

  try {
    if (!silent) {
      console.log('API Request:', { url, method: config.method });
    }
    
    const response = await fetch(url, config);
    
    // Parse response
    let data: any;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    
    if (!silent) {
      console.log('API Response:', { 
        status: response.status, 
        ok: response.ok,
        data 
      });
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (!silent) {
      // Detailed error logging
      const errorDetails = {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : typeof error,
        url,
        method: config.method,
        stack: error instanceof Error ? error.stack : undefined,
      };
      console.error('API Error:', errorDetails);
      console.error('Full error object:', error);
    }
    
    // Provide more specific error messages
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error(`Unable to connect to API server at ${url}. Please check: 1) Internet connection 2) API server is running 3) NEXT_PUBLIC_API_URL is correct`);
    }
    
    throw error;
  }
}

// ==================== Authentication API ====================

export const authApi = {
  // Request OTP
  requestOTP: async (payload: AuthRequestPayload): Promise<ApiResponse<AuthResponse>> => {
    return fetchApi<AuthResponse>('/api/users/auth/request', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Verify OTP
  verifyOTP: async (payload: AuthVerifyPayload): Promise<ApiResponse<AuthResponse>> => {
    return fetchApi<AuthResponse>('/api/users/auth/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Get current user (using cookie auth)
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    // This endpoint might not exist yet, so we handle errors gracefully
    try {
      console.log('API: Fetching /api/users/me with cookies...');
      const result = await fetchApi<User>('/api/users/me', {}, false); // NOT silent - we want to see the response
      console.log('API: User response received:', result);
      return result;
    } catch (error) {
      console.error('API: getCurrentUser failed:', error);
      // Silently fail - endpoint might not be available
      return {
        message: error instanceof Error ? error.message : 'Failed to fetch user',
      };
    }
  },

  // Logout (clear cookie on backend)
  logout: async (): Promise<void> => {
    try {
      await fetchApi('/api/users/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage anyway
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ecoserve_token');
        localStorage.removeItem('ecoserve_user');
      }
    }
  },
};

// ==================== AI Triage API ====================

export const triageApi = {
  sendMessage: async (message: string): Promise<ApiResponse<TriageResponse>> => {
    return fetchApi<TriageResponse>('/api/chatbot/triage', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// ==================== Technicians API ====================

export const techniciansApi = {
  // Get nearby technicians
  getNearby: async (params: NearbyTechniciansParams): Promise<ApiResponse<Technician[]>> => {
    const queryString = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
      radius_km: params.radius_km.toString(),
    }).toString();
    
    return fetchApi<Technician[]>(`/api/technicians/nearby?${queryString}`);
  },

  // Register as technician
  register: async (payload: {
    user_id: string;
    specialization: string;
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse<Technician>> => {
    return fetchApi<Technician>('/api/technicians/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

// ==================== Orders API ====================

export const ordersApi = {
  // Create new order
  create: async (payload: CreateOrderPayload): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>('/api/orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Get user orders
  getUserOrders: async (): Promise<ApiResponse<Order[]>> => {
    return fetchApi<Order[]>('/api/orders/user');
  },

  // Get technician orders
  getTechnicianOrders: async (): Promise<ApiResponse<Order[]>> => {
    return fetchApi<Order[]>('/api/orders/technician');
  },

  // Complete order (with e-waste calculation)
  complete: async (orderId: string, payload: CompleteOrderPayload): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>(`/api/orders/${orderId}/complete`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  // Update order status
  updateStatus: async (orderId: string, status: string): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Add rating/review
  addReview: async (orderId: string, rating: number, review?: string): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>(`/api/orders/${orderId}/review`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    });
  },
};

// ==================== Impact API ====================

export const impactApi = {
  // Get global impact metrics
  getGlobalMetrics: async (): Promise<ApiResponse<ImpactMetrics>> => {
    return fetchApi<ImpactMetrics>('/api/impact/global');
  },

  // Get user impact metrics
  getUserImpact: async (userId: string): Promise<ApiResponse<UserImpact>> => {
    return fetchApi<UserImpact>(`/api/impact/user/${userId}`);
  },
};

// ==================== Health Check ====================

export const healthApi = {
  check: async (): Promise<ApiResponse<{ status: string }>> => {
    return fetchApi<{ status: string }>('/health');
  },
};

export default {
  auth: authApi,
  triage: triageApi,
  technicians: techniciansApi,
  orders: ordersApi,
  impact: impactApi,
  health: healthApi,
};
