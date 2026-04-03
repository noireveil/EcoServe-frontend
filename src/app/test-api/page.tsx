'use client';

import React, { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<{
    apiUrl: string;
    reachable: boolean | null;
    error: string | null;
    responseTime: number | null;
  }>({
    apiUrl: '',
    reachable: null,
    error: null,
    responseTime: null,
  });

  const testApiConnection = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecoserve-api.onrender.com';
    
    setTestResults(prev => ({ ...prev, apiUrl, reachable: null, error: null, responseTime: null }));

    const startTime = Date.now();
    
    try {
      // Test 1: Direct fetch to API
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
      });
      
      const responseTime = Date.now() - startTime;
      const data = await response.json();
      
      setTestResults({
        apiUrl,
        reachable: response.ok,
        error: null,
        responseTime,
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setTestResults({
        apiUrl,
        reachable: false,
        error: error instanceof Error ? error.message : String(error),
        responseTime,
      });
    }
  };

  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">API Connection Test</h1>

          <div className="space-y-4">
            {/* API URL */}
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">API URL:</p>
              <p className="font-mono text-sm text-gray-900">{testResults.apiUrl || 'Loading...'}</p>
            </div>

            {/* Connection Status */}
            {testResults.reachable === null && (
              <div className="p-4 bg-yellow-50 rounded-xl text-center">
                <p className="text-yellow-700">Testing connection...</p>
              </div>
            )}

            {testResults.reachable === true && (
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-green-900">API is reachable!</p>
                    <p className="text-sm text-green-700">Response time: {testResults.responseTime}ms</p>
                  </div>
                </div>
              </div>
            )}

            {testResults.reachable === false && (
              <div className="p-4 bg-red-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 mb-2">API is NOT reachable</p>
                    <p className="text-sm text-red-700 mb-3">Error: {testResults.error}</p>
                    
                    <div className="text-sm space-y-2">
                      <p className="font-semibold">Possible solutions:</p>
                      <ul className="list-disc list-inside space-y-1 text-red-600">
                        <li>Check your internet connection</li>
                        <li>Verify the API server is running</li>
                        <li>Check if the API URL is correct in .env.local</li>
                        <li>If using Render.com free tier, the server might be sleeping (wake it up)</li>
                        <li>Check CORS settings on the backend</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Retry Button */}
            <button
              onClick={testApiConnection}
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
            >
              Test Again
            </button>

            {/* Debug Info */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-2">Debug Checklist:</p>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>☐ Is .env.local file present?</li>
                <li>☐ Is NEXT_PUBLIC_API_URL set correctly?</li>
                <li>☐ Did you restart the dev server after creating .env.local?</li>
                <li>☐ Can you access the API URL directly in browser?</li>
                <li>☐ Is your internet connection working?</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
