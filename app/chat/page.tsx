"use client"

import { useChatStore, selectCurrentConversation } from "@/lib/store"
import { ChatHeader } from "./components/chat-header"
import { ChatMessages } from "./components/chat-messages"
import { ChatInput } from "./components/chat-input"

export default function ChatPage() {
  const currentConversation = useChatStore(selectCurrentConversation)

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <ChatHeader conversation={currentConversation} />

      {currentConversation ? (
        <div className="relative flex flex-1 flex-col overflow-y-auto">
          <ChatMessages messages={currentConversation.messages} />
          <ChatInput />
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
