import type { Metadata } from 'next'
import { TechnicianBottomNav, TechnicianTopNav } from '@/components/technician/bottom-nav'

export const metadata: Metadata = {
  title: 'Technician Dashboard - EcoServe',
  description: 'Technician dashboard for e-waste management',
}

export default function TechnicianLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Desktop top nav */}
      <TechnicianTopNav />
      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {/* Mobile bottom nav */}
      <TechnicianBottomNav />
    </div>
  )
}
