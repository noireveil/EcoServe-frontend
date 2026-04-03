'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ordersApi, techniciansApi, impactApi } from '@/services/api';
import { Order, Technician, UserImpact, Badge as BadgeType } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

// E-Waste weights by category (kg)
const E_WASTE_WEIGHTS: Record<string, number> = {
  'Pendingin & Komersial': 45.50,
  'Home Appliances': 22.00,
  'IT & Gadget': 1.25,
};

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [nearbyTechnicians, setNearbyTechnicians] = useState<Technician[]>([]);
  const [userImpact, setUserImpact] = useState<UserImpact | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    // Don't redirect immediately - give time for auth to initialize
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/request');
      return;
    }
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user, authLoading]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load orders
      try {
        const ordersResponse = await ordersApi.getUserOrders();
        if (ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
      } catch (error) {
        // Orders endpoint might not exist yet - that's okay
        console.log('📋 Orders: Using mock data (endpoint not available)');
      }

      // Load user impact
      try {
        const impactResponse = await impactApi.getUserImpact(user.id);
        if (impactResponse.data) {
          setUserImpact(impactResponse.data);
        }
      } catch (error) {
        // Impact endpoint might not exist yet - that's okay
        console.log('📊 Impact: Using mock data (endpoint not available)');
      }

      // Try to get location for nearby technicians
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setLocation({ lat, lon });

            // Load nearby technicians
            try {
              const techResponse = await techniciansApi.getNearby({
                lat,
                lon,
                radius_km: 10,
              });
              if (techResponse.data) {
                setNearbyTechnicians(techResponse.data);
              }
            } catch (error) {
              console.log('📍 Technicians: Endpoint not available');
            }
          },
          (error) => {
            // Geolocation permission denied or not available - expected
            console.log('📍 Location: Permission not granted, using default');
            setShowLocationModal(true);
          }
        );
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualLocation = () => {
    // Default to Jakarta coordinates
    const jakartaLocation = { lat: -6.2088, lon: 106.8456 };
    setLocation(jakartaLocation);
    setShowLocationModal(false);
    
    // Load technicians for Jakarta
    techniciansApi.getNearby({
      ...jakartaLocation,
      radius_km: 10,
    }).then((response) => {
      if (response.data) {
        setNearbyTechnicians(response.data);
      }
    });
  };

  const handleCreateOrder = (specialization: string) => {
    // Store selected category for order creation
    sessionStorage.setItem('ecoserve_order_category', specialization);
    router.push('/orders/new');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
      case 'ACCEPTED':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Menunggu',
      ACCEPTED: 'Diterima',
      IN_PROGRESS: 'Diproses',
      COMPLETED: 'Selesai',
      CANCELLED: 'Dibatalkan',
    };
    return labels[status] || status;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Halo, {user?.full_name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-emerald-100 text-sm">Dashboard Pengguna</p>
            </div>
            <button
              onClick={() => router.push('/triage')}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </div>

          {/* Quick Impact Summary */}
          {userImpact && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-emerald-100 text-xs mb-1">Total Order</p>
                <p className="text-2xl font-bold text-white">{userImpact.total_orders}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <p className="text-emerald-100 text-xs mb-1">Limbah Dicegah</p>
                <p className="text-2xl font-bold text-white">{(userImpact.ewaste_prevented_kg / 1000).toFixed(2)} Ton</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 space-y-6">
        {/* Service Categories */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Layanan Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Pendingin & Komersial', icon: '❄️', desc: 'AC, Kulkas, Freezer' },
              { name: 'Home Appliances', icon: '🏠', desc: 'Mesin Cuci, TV, Pompa' },
              { name: 'IT & Gadget', icon: '📱', desc: 'Laptop, HP, PC' },
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => handleCreateOrder(category.name)}
                className="p-4 border-2 border-gray-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
              >
                <span className="text-3xl mb-2 block">{category.icon}</span>
                <p className="font-semibold text-gray-900">{category.name}</p>
                <p className="text-sm text-gray-500">{category.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* My Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Order Saya</h2>
            <Badge variant="default">{orders.length} order</Badge>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">Belum ada order</p>
              <Button onClick={() => handleCreateOrder('IT & Gadget')}>
                Buat Order Pertama
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{order.device_category}</p>
                      <p className="text-sm text-gray-500">{order.problem_description}</p>
                    </div>
                    <Badge variant={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(order.created_at).toLocaleDateString('id-ID')}</span>
                    {order.ewaste_prevented_kg && (
                      <span className="text-emerald-600 font-medium">
                        +{order.ewaste_prevented_kg.toFixed(2)} kg CO₂
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        {userImpact && userImpact.badges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pencapaian</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {userImpact.badges.map((badge) => (
                <div key={badge.id} className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <p className="font-semibold text-gray-900 text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Technicians */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Teknisi Terdekat</h2>
            <button
              onClick={() => setShowLocationModal(true)}
              className="text-emerald-600 text-sm font-medium hover:text-emerald-700"
            >
              Refresh Lokasi
            </button>
          </div>

          {!location ? (
            <div className="text-center py-8">
              <button
                onClick={handleManualLocation}
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Aktifkan Lokasi untuk Mencari Teknisi
              </button>
            </div>
          ) : nearbyTechnicians.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Tidak ada teknisi dalam radius 10km</p>
            </div>
          ) : (
            <div className="space-y-3">
              {nearbyTechnicians.slice(0, 5).map((tech) => (
                <div
                  key={tech.id}
                  className="border border-gray-100 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{tech.user?.full_name || 'Teknisi'}</p>
                    <p className="text-sm text-gray-500">{tech.specialization}</p>
                    <div className="flex items-center mt-1">
                      <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-600 ml-1">
                        {tech.rating?.toFixed(1) || 'N/A'} ({tech.total_orders || 0} order)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600">
                      {tech.distance_km?.toFixed(1)} km
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Hubungi
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Akses Lokasi Diperlukan</h3>
            <p className="text-gray-600 text-sm mb-4">
              Kami membutuhkan akses lokasi untuk menemukan teknisi terdekat di area Anda.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowLocationModal(false)} className="flex-1">
                Nanti
              </Button>
              <Button onClick={handleManualLocation} className="flex-1">
                Gunakan Lokasi Default
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
