"use client"

import { Plus, MessageSquare, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChatStore } from "@/lib/store"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

export function ChatSidebar() {
  const conversations = useChatStore((s) => s.conversations)
  const currentConversationId = useChatStore((s) => s.currentConversationId)
  const createConversation = useChatStore((s) => s.createConversation)
  const switchConversation = useChatStore((s) => s.switchConversation)
  const deleteConversation = useChatStore((s) => s.deleteConversation)

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
            <div
              key={conv.id}
              className={cn(
                "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent",
                conv.id === currentConversationId &&
                  "bg-sidebar-accent font-medium"
              )}
            >
              <button
                onClick={() => switchConversation(conv.id)}
                className="flex flex-1 items-center gap-2 min-w-0"
              >
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </button>

              {/* 更多操作按钮 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-sidebar-accent group-hover:opacity-100 data-[state=open]:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => deleteConversation(conv.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    删除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
