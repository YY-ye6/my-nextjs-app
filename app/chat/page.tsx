"use client"

import { useRef, useState, useEffect } from "react"
import { ArrowDown } from "lucide-react"
import { useChatStore, selectCurrentConversation } from "@/lib/store"
import { ChatHeader } from "./components/chat-header"
import { ChatMessages, type ChatMessagesRef } from "./components/chat-messages"
import { ChatInput } from "./components/chat-input"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const currentConversation = useChatStore(selectCurrentConversation)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<ChatMessagesRef>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // 监听滚动，判断是否显示返回底部按钮
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScrollButton = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      // 距离底部超过 100px 时显示按钮
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }

    // 会话切换时重置状态并检查
    setShowScrollButton(false)
    // 延迟检查，等待内容渲染完成
    const timer = setTimeout(checkScrollButton, 100)

    container.addEventListener("scroll", checkScrollButton)
    return () => {
      container.removeEventListener("scroll", checkScrollButton)
      clearTimeout(timer)
    }
  }, [currentConversation?.id])

  const scrollToBottom = () => {
    chatMessagesRef.current?.scrollToBottom()
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <ChatHeader conversation={currentConversation} />

      {currentConversation ? (
        <div className="relative flex flex-1 flex-col overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <ChatMessages
              ref={chatMessagesRef}
              messages={currentConversation.messages}
            />
          </div>
          <ChatInput />

          {/* 返回底部按钮 */}
          {showScrollButton && (
            <Button
              onClick={scrollToBottom}
              size="icon"
              variant="outline"
              className="absolute bottom-20 left-1/2 z-10 h-10 w-10 -translate-x-1/2 rounded-full shadow-lg"
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">欢迎使用 Mini Chat</p>
            <p className="mt-2 text-sm">点击左侧「新会话」开始聊天</p>
          </div>
        </div>
      )}
    </main>
  )
}
