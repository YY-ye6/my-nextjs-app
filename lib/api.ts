import type { ChatMessage, ChatResponse, FileUploadResponse } from "./types"

const API_BASE = "/api"

export async function sendChatMessage(
  messages: ChatMessage[]
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error("发送消息失败")
  }

  return response.json()
}

export async function uploadFile(file: File): Promise<FileUploadResponse> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE}/files`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("文件上传失败")
  }

  return response.json()
}
