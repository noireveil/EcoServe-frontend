'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const E_WASTE_WEIGHTS: Record<string, number> = {
  'Pendingin & Komersial': 45.50,
  'Home Appliances': 22.00,
  'IT & Gadget': 1.25,
};

type OrderFilter = 'all' | 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED';

export default function DemoTechnicianDashboard() {
  const [filter, setFilter] = useState<OrderFilter>('all');

  const mockOrders = [
    {
      id: '1',
      device_category: 'IT & Gadget',
      problem_description: 'Laptop tidak bisa charging',
      status: 'PENDING' as const,
      diagnosis: 'Kemungkinan masalah di charger port atau battery',
      created_at: '2026-04-02T09:00:00Z',
    },
    {
      id: '2',
      device_category: 'Home Appliances',
      problem_description: 'Mesin cuci tidak berputar',
      status: 'ACCEPTED' as const,
      created_at: '2026-04-01T14:30:00Z',
    },
    {
      id: '3',
      device_category: 'Pendingin & Komersial',
      problem_description: 'Kulkas tidak dingin',
      status: 'IN_PROGRESS' as const,
      created_at: '2026-03-31T10:00:00Z',
    },
    {
      id: '4',
      device_category: 'IT & Gadget',
      problem_description: 'HP layar pecah',
      status: 'COMPLETED' as const,
      ewaste_prevented_kg: 0.25,
      rating: 5,
      created_at: '2026-03-30T16:00:00Z',
    },
  ];

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

  const calculateEwaste = (category: string): number => {
    return E_WASTE_WEIGHTS[category] || 0;
  };

  const filteredOrders = filter === 'all'
    ? mockOrders
    : mockOrders.filter(order => order.status === filter);

  const stats = {
    total: mockOrders.length,
    pending: mockOrders.filter(o => o.status === 'PENDING').length,
    inProgress: mockOrders.filter(o => o.status === 'IN_PROGRESS').length,
    completed: mockOrders.filter(o => o.status === 'COMPLETED').length,
  };

  const totalEwastePrevented = mockOrders
    .filter(o => o.status === 'COMPLETED')
    .reduce((sum, order) => sum + (order.ewaste_prevented_kg || calculateEwaste(order.device_category)), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Demo Banner */}
      <div className="bg-blue-500 px-6 py-3 text-center">
        <p className="text-white font-semibold">
          🔍 Demo Mode - Data Contoh (Technician)
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
                Dashboard Teknisi
              </h1>
              <p className="text-emerald-100 text-sm">Ahmad Rizki - IT & Gadget Specialist</p>
            </div>
            <button className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-emerald-100 text-xs mb-1">Total Order</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-emerald-100 text-xs mb-1">Menunggu</p>
              <p className="text-xl font-bold text-white">{stats.pending}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-emerald-100 text-xs mb-1">Diproses</p>
              <p className="text-xl font-bold text-white">{stats.inProgress}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-emerald-100 text-xs mb-1">E-Waste</p>
              <p className="text-xl font-bold text-white">{(totalEwastePrevented / 1000).toFixed(2)}T</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 space-y-6">
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <div className="flex overflow-x-auto gap-2 scrollbar-hide">
            {[
              { id: 'all', label: 'Semua', count: stats.total },
              { id: 'PENDING', label: 'Menunggu', count: stats.pending },
              { id: 'ACCEPTED', label: 'Diterima', count: stats.pending },
              { id: 'IN_PROGRESS', label: 'Diproses', count: stats.inProgress },
              { id: 'COMPLETED', label: 'Selesai', count: stats.completed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as OrderFilter)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === tab.id
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Daftar Order
          </h2>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-600">Tidak ada order dalam kategori ini</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{order.device_category}</h3>
                      <p className="text-sm text-gray-600 mt-1">{order.problem_description}</p>
                      {order.diagnosis && (
                        <p className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">
                          <strong>Diagnosis:</strong> {order.diagnosis}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* E-Waste Info */}
                  {order.status === 'COMPLETED' && (
                    <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Mencegah {(order.ewaste_prevented_kg || calculateEwaste(order.device_category)).toFixed(2)} kg limbah
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <Button size="sm" className="flex-1">
                        Terima Order
                      </Button>
                    )}
                    {order.status === 'ACCEPTED' && (
                      <Button size="sm" variant="secondary" className="flex-1">
                        Mulai Pengerjaan
                      </Button>
                    )}
                    {order.status === 'IN_PROGRESS' && (
                      <Button size="sm" className="flex-1">
                        Selesaikan
                      </Button>
                    )}
                    {order.status === 'COMPLETED' && order.rating && (
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4"
                            fill={i < order.rating! ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                        <span className="text-sm ml-1">({order.rating}/5)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
