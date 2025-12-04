/**
 * 上传文件元数据
 */
export interface UploadedFile {
  url: string
  name: string
  type: string // MIME 类型，例如 image/png, image/jpeg 等
}

/**
 * 单条聊天消息
 */
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  file?: UploadedFile | null
  createdAt: number // Unix 时间戳（毫秒）
}

/**
 * 会话（聊天会话）
 */
export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

/**
 * 主题模式
 */
export type Theme = "light" | "dark"

/**
 * API 请求/响应类型
 */
export interface ChatRequest {
  messages: ChatMessage[]
}

export interface ChatResponse {
  id: string
  role: "assistant"
  content: string
}

export interface FileUploadResponse {
  url: string
  name: string
  type: string
}
