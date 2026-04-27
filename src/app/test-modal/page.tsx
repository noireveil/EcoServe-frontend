"use client"

import { useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestModalPage() {
  const [infoOpen, setInfoOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [formValues, setFormValues] = useState({ name: "", email: "" })

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold mb-4">Modal Component Test</h1>

      <Button onClick={() => setInfoOpen(true)} className="w-48">
        Open Info Modal
      </Button>
      <Button onClick={() => setConfirmOpen(true)} variant="outline" className="w-48">
        Open Confirmation Modal
      </Button>
      <Button onClick={() => setFormOpen(true)} variant="outline" className="w-48">
        Open Form Modal
      </Button>

      {/* 1. Info Modal */}
      <Modal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title="About"
        size="md"
        footer={
          <Button className="flex-1" onClick={() => setInfoOpen(false)}>
            Got it
          </Button>
        }
      >
        <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
          <p>
            EcoServe is Indonesia's first AI-powered e-waste circular platform,
            built to connect consumers with verified repair technicians and track
            the real carbon impact of every repair.
          </p>
          <p>
            Our platform uses the EPA WARM (Waste Reduction Model) methodology to
            calculate CO₂ emissions avoided per repair. Every device you fix instead
            of replace contributes to reducing global e-waste, which currently stands
            at 62 million tons per year.
          </p>
          <p>
            We believe the most sustainable device is the one you already own.
            By extending the lifecycle of electronics through quality repairs, we
            help reduce the demand for new manufacturing — the largest source of
            carbon emissions in the electronics industry.
          </p>
          <p>
            EcoServe is built for I/O Festival 2026, a web development competition
            organized by BEM FTI Universitas Tarumanagara. The platform is open
            to consumers and technicians across Indonesia.
          </p>
          <p>
            This is extra text to demonstrate scrollable body content. When the
            modal body exceeds the available height, it scrolls independently
            while the footer remains pinned to the bottom — so the action button
            is always visible without scrolling.
          </p>
        </div>
      </Modal>

      {/* 2. Confirmation Modal (destructive) */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete Account?"
        variant="destructive"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive hover:bg-destructive/90 text-white"
              onClick={() => {
                alert("Account deleted (demo)")
                setConfirmOpen(false)
              }}
            >
              Yes, Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action cannot be undone. Your account and all associated data will
          be permanently removed from our servers.
        </p>
      </Modal>

      {/* 3. Form Modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Edit Profile"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                alert(`Saved: ${formValues.name} / ${formValues.email}`)
                setFormOpen(false)
              }}
            >
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modal-name">Full Name</Label>
            <Input
              id="modal-name"
              placeholder="John Doe"
              value={formValues.name}
              onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="modal-email">Email</Label>
            <Input
              id="modal-email"
              type="email"
              placeholder="you@example.com"
              value={formValues.email}
              onChange={(e) => setFormValues((v) => ({ ...v, email: e.target.value }))}
              className="bg-secondary/50"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
