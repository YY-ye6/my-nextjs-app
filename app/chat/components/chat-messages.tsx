"use client"

import { useEffect, useRef } from "react"
import { Bot, Loader2 } from "lucide-react"
import { ChatMessage } from "./chat-message"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useChatStore } from "@/lib/store"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatMessagesProps {
  messages: ChatMessageType[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const isLoading = useChatStore((s) => s.isLoading)

  // 新消息或加载状态变化时自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

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

        {/* 思考中状态 */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-muted">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-muted px-4 py-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
