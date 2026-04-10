import type { Metadata } from 'next'
import { BottomNav } from '@/components/technician/bottom-nav'

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
      <main className="pb-20 md:pb-0 md:pt-16">{children}</main>
      <BottomNav />
    </div>
  )
}
