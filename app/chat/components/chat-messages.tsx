"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "./chat-message"
import { useAutoScroll } from "@/hooks/use-auto-scroll"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatMessagesProps {
  messages: ChatMessageType[]
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const { containerRef } = useAutoScroll(messages)

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
    <ScrollArea className="flex-1" ref={containerRef}>
      <div className="mx-auto max-w-3xl space-y-4 p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  )
}
