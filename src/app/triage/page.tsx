'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { triageApi } from '@/services/api';
import { ChatMessage } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';

const SUGGESTIONS = [
  'Kulkas tidak dingin',
  'AC bocor',
  'Mesin cuci tidak berputar',
  'Laptop overheat',
  'HP mati total',
  'TV tidak ada gambar',
];

export default function TriagePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Halo! Saya AI Assistant EcoServe. Saya dapat membantu mendiagnosis masalah perangkat elektronik Anda. Ceritakan apa yang terjadi dengan perangkat Anda?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [diagnosis, setDiagnosis] = useState<{
    category?: string;
    emergencySteps?: string;
    estimatedCost?: string;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await triageApi.sendMessage(inputValue);
      
      if (response.data) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Extract diagnosis info for smart routing
        const reply = response.data.data.reply;
        const categoryMatch = reply.match(/kategori\s+["']?([^"']+)["']/i);
        const emergencyMatch = reply.match(/Langkah darurat:\s*(.+)/i);
        const costMatch = reply.match(/Estimasi biaya[\s\S]*?Rp\s*([\d.,\s-]+)/i);

        if (categoryMatch || emergencyMatch || costMatch) {
          setDiagnosis({
            category: categoryMatch?.[1],
            emergencySteps: emergencyMatch?.[1],
            estimatedCost: costMatch?.[1],
          });
        }
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Maaf, saya mengalami kesulitan untuk memproses permintaan Anda. Silakan coba lagi atau hubungi teknisi kami langsung.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFindTechnician = () => {
    if (isAuthenticated) {
      router.push('/dashboard/user');
    } else {
      // Store the diagnosis for later
      sessionStorage.setItem('ecoserve_triage_category', diagnosis?.category || '');
      router.push('/auth/request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6 md:py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AI Triage Diagnosis</h1>
              <p className="text-emerald-100 text-sm">Konsultasi gratis dengan AI kami</p>
            </div>
          </div>
          <Badge variant="success" size="sm" className="bg-white/20 text-white border-0">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Online • Ready to help
          </Badge>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="bg-white rounded-t-3xl shadow-xl overflow-hidden">
          {/* Messages */}
          <div className="h-[calc(100vh-350px)] md:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-emerald-200' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-md border border-gray-100">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Diagnosis Summary */}
          {diagnosis && (
            <div className="px-4 sm:px-6 py-4 bg-emerald-50 border-t border-emerald-100">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {diagnosis.category && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-emerald-900">
                        Kategori: {diagnosis.category}
                      </span>
                    </div>
                  )}
                  {diagnosis.estimatedCost && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-emerald-700">
                        Estimasi: Rp {diagnosis.estimatedCost}
                      </span>
                    </div>
                  )}
                </div>
                <Button onClick={handleFindTechnician} size="sm">
                  Cari Teknisi
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
            {/* Quick Suggestions */}
            {!diagnosis && messages.length < 3 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputValue(suggestion)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Jelaskan masalah perangkat Anda..."
                  disabled={isTyping}
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
