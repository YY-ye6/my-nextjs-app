"use client"

import { Streamdown } from "streamdown"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { ChatMessage as ChatMessageType } from "@/lib/types"
import { Bot, User, Loader2 } from "lucide-react"

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const isEmptyAssistant = !isUser && !message.content

  // 用户消息 - 气泡样式，靠右
  if (isUser) {
    return (
      <div className="flex items-start gap-3 flex-row-reverse">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2 text-primary-foreground">
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
          {message.file && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.file.url}
                alt={message.file.name}
                className="max-h-48 max-w-full rounded-lg object-contain"
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  // Assistant 消息 - 无气泡，全宽
  return (
    <div className="flex items-start gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-muted">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1 pt-1">
        {isEmptyAssistant ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <Streamdown>{message.content}</Streamdown>
        )}
      </div>
    </div>
  )
}
