"use client"

import { useState } from "react"
import { Streamdown } from "streamdown"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { ChatMessage as ChatMessageType } from "@/lib/types"
import { Bot, User, Loader2, Lightbulb, ChevronDown } from "lucide-react"

// 提取思考内容和主要内容
function parseContent(content: string): {
  thinking: string | null
  thinkingComplete: boolean
  main: string
} {
  // 匹配已闭合的 <think>...</think>
  const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/)

  if (thinkMatch) {
    const thinking = thinkMatch[1].trim()
    const main = content.replace(/<think>[\s\S]*?<\/think>/, "").trim()
    return { thinking, thinkingComplete: true, main }
  }

  // 检查未闭合的 <think>（流式输出中）
  const unclosedMatch = content.match(/<think>([\s\S]*)$/)
  if (unclosedMatch) {
    return { thinking: unclosedMatch[1].trim(), thinkingComplete: false, main: "" }
  }

  return { thinking: null, thinkingComplete: false, main: content }
}

interface ChatMessageProps {
  message: ChatMessageType
}

// 思考过程折叠组件
function ThinkingBlock({
  content,
  isComplete,
}: {
  content: string
  isComplete: boolean
}) {
  const [isOpen, setIsOpen] = useState(!isComplete) // 思考中时默认展开

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-4">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors">
        {isComplete ? (
          <Lightbulb className="h-4 w-4" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        <span className="flex-1 text-left">
          {isComplete ? "思考已完成" : "思考中..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {content}
        </p>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"
  const { thinking, thinkingComplete, main } = isUser
    ? { thinking: null, thinkingComplete: false, main: message.content }
    : parseContent(message.content)
  const isEmptyAssistant = !isUser && !thinking && !main

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
          <>
            {thinking && (
              <ThinkingBlock content={thinking} isComplete={thinkingComplete} />
            )}
            {main && <Streamdown>{main}</Streamdown>}
          </>
        )}
      </div>
    </div>
  )
}
