"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, MessageCircle } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  order_id: string
  sender_id: string
  sender_role: "customer" | "technician"
  content: string
  created_at: string
}

interface ChatDrawerProps {
  orderId: string
  currentUserId: string
  currentUserRole: "customer" | "technician"
  open: boolean
  onClose: () => void
}

export function ChatDrawer({
  orderId,
  currentUserId,
  currentUserRole,
  open,
  onClose,
}: ChatDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Load message history
  useEffect(() => {
    if (!open || !orderId) return

    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const response = await apiFetch(`/api/orders/${orderId}/messages`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.data || [])
        }
      } catch (err) {
        console.error("Failed to load messages:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [open, orderId])

  // Supabase Realtime subscription
  useEffect(() => {
    if (!open || !orderId) return

    const channel = supabase
      .channel(`messages:order_id=eq.${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `order_id=eq.${orderId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages(prev => {
            const filtered = prev.filter(m =>
              !(m.id.startsWith("temp-") &&
                m.content === newMessage.content &&
                m.sender_role === newMessage.sender_role)
            )
            if (filtered.find(m => m.id === newMessage.id)) return filtered
            return [...filtered, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [open, orderId])

  // Auto scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isSending) return

    const content = input.trim()
    setInput("")
    setIsSending(true)

    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      order_id: orderId,
      sender_id: currentUserId,
      sender_role: currentUserRole,
      content,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimisticMsg])

    try {
      const response = await apiFetch(`/api/orders/${orderId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content }),
      })
      console.log("Send response status:", response.status)
      if (!response.ok) {
        const errorData = await response.json()
        console.error("Send error:", JSON.stringify(errorData))
      }
    } catch (err) {
      console.error("Send failed:", err)
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id))
      setInput(content)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Suppress unused var warning — currentUserId is available for future per-user styling
  void currentUserId

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop (mobile only) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50
                       bg-background border-t border-border/50
                       rounded-t-2xl flex flex-col
                       h-[85vh] md:h-auto md:max-h-[600px]
                       md:right-4 md:bottom-4 md:left-auto
                       md:w-[380px] md:rounded-2xl md:border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Order Chat</p>
                  <p className="text-xs text-muted-foreground">
                    #{orderId.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-sm">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                  <MessageCircle className="w-8 h-8 text-muted-foreground/50" />
                  <p className="text-muted-foreground text-sm text-center">
                    Belum ada pesan.{"\n"}
                    Mulai percakapan!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_role === currentUserRole
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        {!isMe && (
                          <span className="text-xs text-muted-foreground px-1">
                            {msg.sender_role === "technician" ? "Teknisi" : "Customer"}
                          </span>
                        )}
                        <div className={`px-3 py-2 rounded-2xl text-sm ${
                          isMe
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-secondary text-foreground rounded-bl-sm"
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground px-1">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border/50 flex-shrink-0 mb-16 md:mb-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-secondary/50 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary
                           placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isSending}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground
                           disabled:opacity-50 hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
