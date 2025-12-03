import type { Conversation } from "@/lib/types"

interface ChatHeaderProps {
  conversation: Conversation | null
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
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
    <header className="flex h-14 items-center border-b border-border px-4">
      <h1 className="truncate text-lg font-medium">{conversation.title}</h1>
    </header>
  )
}
