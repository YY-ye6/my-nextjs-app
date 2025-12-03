import type { ChatMessage, FileUploadResponse } from "./types"

const API_BASE = "/api"

export async function sendChatMessageStream(
  messages: ChatMessage[],
  onChunk: (content: string, id?: string) => void,
  onDone: () => void
): Promise<void> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    throw new Error("发送消息失败")
  }

  const reader = response.body?.getReader()
  if (!reader) {
    throw new Error("无法读取响应流")
  }

  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") {
            onDone()
            return
          }

          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              onChunk(parsed.content, parsed.id)
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  onDone()
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
