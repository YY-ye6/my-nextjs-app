"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "./chat-message"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatMessagesProps {
  messages: ChatMessageType[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // 消息变化时自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
    <div className="flex-1">
      <div className="mx-auto max-w-3xl space-y-4 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
