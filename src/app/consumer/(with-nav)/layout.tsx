import type { Metadata } from 'next'
import { ConsumerBottomNav, ConsumerTopNav } from '@/components/consumer/bottom-nav'

export const metadata: Metadata = {
  title: 'EcoServe',
  description: 'Customer dashboard for e-waste management',
}

export default function WithNavLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Desktop top nav */}
      <ConsumerTopNav />
      {/* Main content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {/* Mobile bottom nav */}
      <ConsumerBottomNav />
    </div>
  )
}
