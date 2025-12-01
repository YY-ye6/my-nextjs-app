"use client"

import { useEffect } from "react"
import { useChatStore, selectCurrentConversation } from "@/lib/store"
import { ChatSidebar } from "./components/chat-sidebar"
import { ChatHeader } from "./components/chat-header"
import { ChatMessages } from "./components/chat-messages"
import { ChatInput } from "./components/chat-input"

export default function ChatPage() {
  const hydrate = useChatStore((s) => s.hydrate)
  const currentConversation = useChatStore(selectCurrentConversation)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <ChatSidebar />

      {/* 主区域 */}
      <main className="flex flex-1 flex-col">
        <ChatHeader conversation={currentConversation} />

        {currentConversation ? (
          <>
            <ChatMessages messages={currentConversation.messages} />
            <ChatInput />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">欢迎使用 Mini Chat</p>
              <p className="mt-2 text-sm">点击左侧「新会话」开始聊天</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
