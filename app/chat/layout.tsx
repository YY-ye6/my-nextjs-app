"use client"

import { useEffect } from "react"
import { useChatStore } from "@/lib/store"
import { ChatSidebar } from "./components/chat-sidebar"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hydrate = useChatStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* 侧边栏 */}
      <ChatSidebar />

      {/* 主区域 */}
      {children}
    </div>
  )
}
