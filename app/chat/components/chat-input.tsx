"use client"

import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react"
import { Send, Paperclip, X, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useChatStore, selectCurrentConversation } from "@/lib/store"
import { sendChatMessageStream, uploadFile } from "@/lib/api"
import type { ChatMessage, UploadedFile } from "@/lib/types"

export function ChatInput() {
  const [input, setInput] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamContentRef = useRef("")
  const abortControllerRef = useRef<AbortController | null>(null)

  const currentConversation = useChatStore(selectCurrentConversation)
  const addMessage = useChatStore((s) => s.addMessage)
  const updateMessageContent = useChatStore((s) => s.updateMessageContent)
  const isLoading = useChatStore((s) => s.isLoading)
  const setLoading = useChatStore((s) => s.setLoading)
  const persist = useChatStore((s) => s.persist)

  const canSend = (input.trim() || file) && !isLoading && !isUploading

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      alert("只支持上传图片")
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      alert("文件大小不能超过 5MB")
      return
    }

    setFile(selectedFile)
    setFilePreview(URL.createObjectURL(selectedFile))
  }

  const handleRemoveFile = () => {
    setFile(null)
    if (filePreview) {
      URL.revokeObjectURL(filePreview)
      setFilePreview(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setLoading(false)
      persist()
    }
  }

  const handleSend = async () => {
    if (!canSend || !currentConversation) return

    const content = input.trim()
    let uploadedFile: UploadedFile | null = null

    // 上传文件
    if (file) {
      try {
        setIsUploading(true)
        uploadedFile = await uploadFile(file)
      } catch {
        alert("文件上传失败")
        setIsUploading(false)
        return
      } finally {
        setIsUploading(false)
      }
    }

    // 创建用户消息
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: content || "(图片)",
      file: uploadedFile,
      createdAt: Date.now(),
    }

    // 乐观更新 UI
    addMessage(userMessage)
    setInput("")
    handleRemoveFile()

    // 创建空的助手消息用于流式更新
    const assistantMessageId = crypto.randomUUID()
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: Date.now(),
    }
    addMessage(assistantMessage)
    streamContentRef.current = ""

    // 创建 AbortController
    abortControllerRef.current = new AbortController()

    // 发送到 API（流式）
    try {
      setLoading(true)
      const allMessages = [...currentConversation.messages, userMessage]

      await sendChatMessageStream(
        allMessages,
        // onChunk: 收到新内容时累加并更新
        (content) => {
          streamContentRef.current += content
          updateMessageContent(assistantMessageId, streamContentRef.current)
        },
        // onDone: 流结束时持久化
        () => {
          persist()
        },
        abortControllerRef.current.signal
      )
    } catch (error) {
      // 如果是用户主动取消，不显示错误
      if (error instanceof Error && error.name === "AbortError") {
        return
      }
      alert("发送消息失败，请重试")
      // 如果失败，更新消息显示错误
      updateMessageContent(assistantMessageId, "消息发送失败，请重试")
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="sticky bottom-0 border-t border-border bg-background p-4">
      <div className="mx-auto max-w-3xl">
        {/* 文件预览 - 使用 blob URL 预览本地文件，无法使用 next/image */}
        {filePreview && (
          <div className="relative mb-2 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filePreview}
              alt="预览"
              className="h-20 rounded-lg object-cover"
            />
            <button
              onClick={handleRemoveFile}
              className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* 输入区域 */}
        <div className="flex items-center gap-2">
          {/* 文件上传按钮 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isUploading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>

          {/* 文本输入框 */}
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            className="min-h-[44px] flex-1 resize-none"
            rows={1}
            disabled={isLoading}
          />

          {/* 发送/暂停按钮 */}
          {isLoading ? (
            <Button
              onClick={handleStop}
              size="icon"
              variant="destructive"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!canSend}
              size="icon"
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
