'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: 'AI Triage',
    href: '/triage',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    label: 'Dashboard',
    href: '/dashboard/user',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export const Navbar: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard/user');
    } else {
      router.push('/auth/request');
    }
  };

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      router.push('/dashboard/user');
    } else {
      router.push('/auth/request');
    }
  };

  return (
    <>
      {/* Desktop Top Navigation - Completely hidden on mobile */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-3 items-center h-16">
            {/* Logo - Start (Left) */}
            <div>
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-lg font-bold text-gray-900">EcoServe</span>
              </Link>
            </div>

            {/* Navigation Links - Center */}
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setActiveItem(item.label)}
                    className={`
                      flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${activeItem === item.label
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Button - End (Right) */}
            <div className="flex justify-end">
              {isAuthenticated && user && user.full_name ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hi, {user.full_name.split(' ')[0]}</span>
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Fixed to bottom with safe area */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg safe-pb"
      >
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => {
                if (item.label === 'Dashboard' && !isAuthenticated) {
                  e.preventDefault();
                  router.push('/auth/request');
                }
                setActiveItem(item.label);
              }}
              className={`
                flex flex-col items-center justify-center p-2 rounded-xl
                transition-all duration-200
                ${activeItem === item.label
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
                }
              `}
            >
              <div className={`
                p-2 rounded-xl transition-all duration-200
                ${activeItem === item.label ? 'bg-emerald-50' : ''}
              `}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
          {/* User/Profile */}
          <button
            onClick={() => isAuthenticated ? logout() : router.push('/auth/request')}
            className={`
              flex flex-col items-center justify-center p-2 rounded-xl
              transition-all duration-200
              ${!isAuthenticated ? 'text-emerald-600' : 'text-gray-400'}
            `}
          >
            <div className={`
              p-2 rounded-xl transition-all duration-200
              ${!isAuthenticated ? 'bg-emerald-50' : ''}
            `}>
              {isAuthenticated ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">{isAuthenticated ? 'Logout' : 'Login'}</span>
          </button>
        </div>
      </nav>

      {/* Spacer for fixed navs - Only visible when nav is shown */}
      <div className="hidden md:block h-16 flex-shrink-0" />
      <div className="md:hidden h-[88px] flex-shrink-0" />
    </>
  );
};

export default Navbar;
