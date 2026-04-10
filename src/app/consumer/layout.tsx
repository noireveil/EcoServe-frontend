import type { Metadata } from 'next'
import { BottomNav } from '@/components/consumer/bottom-nav'

export const metadata: Metadata = {
  title: 'Consumer Dashboard - EcoServe',
  description: 'Consumer dashboard for e-waste management',
}

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="pb-20 md:pb-0 md:pt-16">{children}</main>
      <BottomNav />
    </div>
  )
}
