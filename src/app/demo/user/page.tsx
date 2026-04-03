'use client';

import React from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';

export default function DemoUserDashboard() {
  const mockOrders = [
    {
      id: '1',
      device_category: 'IT & Gadget',
      problem_description: 'Laptop tidak bisa charging',
      status: 'IN_PROGRESS',
      ewaste_prevented_kg: 1.25,
      created_at: '2026-04-01T10:00:00Z',
    },
    {
      id: '2',
      device_category: 'Home Appliances',
      problem_description: 'Mesin cuci tidak berputar',
      status: 'COMPLETED',
      ewaste_prevented_kg: 22.0,
      created_at: '2026-03-28T14:30:00Z',
    },
  ];

  const mockUserImpact = {
    total_orders: 5,
    completed_orders: 3,
    ewaste_prevented_kg: 45.5,
    badges: [
      { id: '1', name: 'Eco Warrior', description: '5 order selesai', icon: '🌟', earned_at: '2026-03-30' },
      { id: '2', name: 'Green Hero', description: '10kg e-waste dicegah', icon: '♻️', earned_at: '2026-03-25' },
    ],
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Demo Banner */}
      <div className="bg-amber-500 px-6 py-3 text-center">
        <p className="text-white font-semibold">
          🔍 Demo Mode - Data Contoh
          <Link href="/demo" className="underline ml-2">
            ← Kembali ke Demo Menu
          </Link>
        </p>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Halo, John Doe!
              </h1>
              <p className="text-emerald-100 text-sm">Dashboard Pengguna</p>
            </div>
            <button className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </div>

          {/* Quick Impact Summary */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">Total Order</p>
              <p className="text-2xl font-bold text-white">{mockUserImpact.total_orders}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <p className="text-emerald-100 text-xs mb-1">Limbah Dicegah</p>
              <p className="text-2xl font-bold text-white">{(mockUserImpact.ewaste_prevented_kg / 1000).toFixed(2)} Ton</p>
            </div>
          </div>
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
            <Badge variant="default">{mockOrders.length} order</Badge>
          </div>

          <div className="space-y-3">
            {mockOrders.map((order) => (
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
        </div>

        {/* Badges */}
        {mockUserImpact.badges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pencapaian</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockUserImpact.badges.map((badge) => (
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
            <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700">
              Refresh Lokasi
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Ahmad Rizki', specialization: 'IT & Gadget', rating: 4.8, orders: 45, distance: 2.3 },
              { name: 'Budi Santoso', specialization: 'Home Appliances', rating: 4.9, orders: 67, distance: 3.7 },
              { name: 'Siti Nurhaliza', specialization: 'Pendingin & Komersial', rating: 4.7, orders: 38, distance: 5.1 },
            ].map((tech) => (
              <div
                key={tech.name}
                className="border border-gray-100 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-gray-900">{tech.name}</p>
                  <p className="text-sm text-gray-500">{tech.specialization}</p>
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600 ml-1">
                      {tech.rating} ({tech.orders} order)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-600">
                    {tech.distance} km
                  </p>
                  <button className="mt-2 px-4 py-2 text-sm border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50">
                    Hubungi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
