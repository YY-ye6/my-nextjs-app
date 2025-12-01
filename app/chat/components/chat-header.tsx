"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/lib/store"
import type { Conversation } from "@/lib/types"

interface ChatHeaderProps {
  conversation: Conversation | null
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const deleteConversation = useChatStore((s) => s.deleteConversation)

  const handleDelete = () => {
    if (!conversation) return
    if (window.confirm("确定要删除这个会话吗？")) {
      deleteConversation(conversation.id)
    }
  }

  if (!conversation) {
    return (
      <header className="flex h-14 items-center border-b border-border px-4">
        <h1 className="text-lg font-medium text-muted-foreground">
          Mini Chat
        </h1>
      </header>
    )
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4">
      <h1 className="truncate text-lg font-medium">{conversation.title}</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </header>
  )
}
