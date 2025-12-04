"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowDown } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { Button } from "@/components/ui/button"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatMessagesProps {
  messages: ChatMessageType[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // 使用 IntersectionObserver 检测是否在底部
  useEffect(() => {
    const bottomEl = bottomRef.current
    if (!bottomEl) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 如果底部元素不可见，说明用户向上滚动了
        setShowScrollButton(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    observer.observe(bottomEl)
    return () => observer.disconnect()
  }, [])

  // 消息变化时自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>还没有消息</p>
          <p className="mt-1 text-sm">在下方输入消息开始对话</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex-1">
      <div className="mx-auto max-w-3xl space-y-4 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 返回底部按钮 */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          variant="outline"
          className="fixed bottom-24 left-1/2 z-10 h-10 w-10 -translate-x-1/2 rounded-full shadow-lg"
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
