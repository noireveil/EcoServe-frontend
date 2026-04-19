import type { Metadata } from 'next'
import { BottomNav } from '@/components/consumer/bottom-nav'

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
      <main className="flex-1">{children}</main>
      <BottomNav />
    </div>
  )
}
