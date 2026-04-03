'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ordersApi } from '@/services/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const CATEGORIES = [
  { id: 'Pendingin & Komersial', name: 'Pendingin & Komersial', desc: 'AC, Kulkas, Freezer', icon: '❄️' },
  { id: 'Home Appliances', name: 'Home Appliances', desc: 'Mesin Cuci, TV, Pompa Air', icon: '🏠' },
  { id: 'IT & Gadget', name: 'IT & Gadget', desc: 'Laptop, HP, PC', icon: '📱' },
];

export default function NewOrderPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      setError('Pilih kategori perangkat');
      return;
    }

    if (!problemDescription.trim()) {
      setError('Jelaskan masalah perangkat Anda');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await ordersApi.create({
        device_category: selectedCategory,
        problem_description: problemDescription,
      });

      if (response.data) {
        // Success - redirect to dashboard
        router.push('/dashboard/user');
      }
    } catch (error) {
      setError('Gagal membuat order. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-emerald-100 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </button>
          <h1 className="text-2xl font-bold text-white">Buat Order Baru</h1>
          <p className="text-emerald-100 text-sm">Ceritakan masalah perangkat Anda</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Pilih Kategori</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    selectedCategory === category.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-100 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-3xl mb-2 block">{category.icon}</span>
                  <p className="font-semibold text-gray-900 text-sm">{category.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{category.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Problem Description */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Deskripsi Masalah</h2>
            <textarea
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Jelaskan secara detail masalah perangkat Anda (contoh: Kulkas tidak dingin, ada bunyi aneh, dll)"
              className="w-full border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              rows={5}
            />
            <p className="text-sm text-gray-500 mt-2">
              Semakin detail deskripsi Anda, semakin akurat diagnosis teknisi
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses Order...
                </>
              ) : (
                <>
                  Buat Order Sekarang
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center mt-4">
              Teknisi akan segera menghubungi Anda setelah order dibuat
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
