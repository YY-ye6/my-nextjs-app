"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react"
import { ChatMessage } from "./chat-message"
import type { ChatMessage as ChatMessageType } from "@/lib/types"

interface ChatMessagesProps {
  messages: ChatMessageType[]
}

export interface ChatMessagesRef {
  scrollToBottom: () => void
}

export const ChatMessages = forwardRef<ChatMessagesRef, ChatMessagesProps>(
  function ChatMessages({ messages }, ref) {
    const bottomRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
      scrollToBottom: () => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      },
    }))

    // 消息变化时自动滚动到底部
    useEffect(() => {
      if (messages.length === 0) return

      // 使用 setTimeout 确保 DOM 完全渲染后再滚动
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 500)

      return () => clearTimeout(timer)
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
)
