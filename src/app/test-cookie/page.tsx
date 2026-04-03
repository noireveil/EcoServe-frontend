'use client';

import React, { useState, useEffect } from 'react';

export default function CookieTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);

  const runTests = async () => {
    const results: any[] = [];

    // Test 1: Check if cookies are being sent
    results.push({ test: 'Starting cookie test...', status: 'info' });

    // Test 2: Try to access /api/users/me
    try {
      results.push({ test: 'Fetching /api/users/me...', status: 'info' });
      
      const response = await fetch('https://ecoserve-api.onrender.com/api/users/me', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      results.push({ 
        test: 'Response received', 
        status: 'info',
        details: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        }
      });

      const data = await response.json();
      results.push({ 
        test: 'Response body', 
        status: response.ok ? 'success' : 'error',
        details: data
      });

      if (response.ok) {
        results.push({ test: '✅ SUCCESS! User data received', status: 'success' });
      } else {
        results.push({ 
          test: '❌ FAILED - Backend returned error', 
          status: 'error',
          details: data.error || data.message
        });
      }
    } catch (error) {
      results.push({ 
        test: '❌ FAILED - Network error', 
        status: 'error',
        details: error instanceof Error ? error.message : String(error)
      });
    }

    // Test 3: Check document.cookie (won't show httpOnly cookies, but good to check)
    results.push({ 
      test: 'document.cookie (non-httpOnly only)', 
      status: 'info',
      details: document.cookie || '(empty - cookies might be httpOnly)'
    });

    setTestResults(results);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie & Auth Test</h1>

        <button
          onClick={runTests}
          className="mb-6 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
        >
          Run Tests Again
        </button>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border-2 ${
                result.status === 'success'
                  ? 'bg-green-50 border-green-500'
                  : result.status === 'error'
                  ? 'bg-red-50 border-red-500'
                  : 'bg-blue-50 border-blue-300'
              }`}
            >
              <p className="font-semibold mb-2">{result.test}</p>
              {result.details && (
                <pre className="text-sm bg-white p-3 rounded-lg overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-300 rounded-xl p-4">
          <h3 className="font-bold text-yellow-900 mb-2">Troubleshooting Checklist:</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>☐ Backend CORS: Access-Control-Allow-Origin = http://localhost:3000</li>
            <li>☐ Backend CORS: Access-Control-Allow-Credentials = true</li>
            <li>☐ Cookie flags: httpOnly=true, sameSite='none', secure=true</li>
            <li>☐ Cookie domain matches backend domain (ecoserve-api.onrender.com)</li>
            <li>☐ Verify OTP berhasil dan Set-Cookie header ada di response</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
