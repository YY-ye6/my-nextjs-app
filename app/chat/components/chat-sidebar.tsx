"use client"

import { Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore } from "@/lib/store"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

export function ChatSidebar() {
  const conversations = useChatStore((s) => s.conversations)
  const currentConversationId = useChatStore((s) => s.currentConversationId)
  const createConversation = useChatStore((s) => s.createConversation)
  const switchConversation = useChatStore((s) => s.switchConversation)

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-border bg-sidebar">
      {/* 新建会话按钮 */}
      <div className="p-4">
        <Button
          onClick={() => createConversation()}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          新会话
        </Button>
      </div>

      {/* 会话列表 */}
      <ScrollArea className="flex-1 min-h-0 px-2">
        <div className="space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => switchConversation(conv.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
                conv.id === currentConversationId &&
                  "bg-sidebar-accent font-medium"
              )}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{conv.title}</span>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* 底部主题切换 */}
      <div className="flex items-center border-t border-border p-4 min-h-[76px]">
        <ThemeToggle />
      </div>
    </aside>
  )
}
