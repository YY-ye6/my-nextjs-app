"use client"

import { create } from "zustand"
import type { Conversation, ChatMessage, Theme } from "./types"

// 存储键
const STORAGE_KEYS = {
  conversations: "mini-chat:conversations",
  currentId: "mini-chat:current-id",
  theme: "mini-chat:theme",
} as const

// 生成唯一 ID
const generateId = () => crypto.randomUUID()

// 从第一条用户消息生成标题
const generateTitle = (messages: ChatMessage[]): string => {
  const firstUserMsg = messages.find((m) => m.role === "user")
  if (!firstUserMsg) return "新会话"
  const content = firstUserMsg.content.trim()
  return content.length > 30 ? content.slice(0, 30) + "..." : content
}

export interface ChatStore {
  // 状态
  conversations: Conversation[]
  currentConversationId: string | null
  theme: Theme
  isLoading: boolean

  // 行为
  createConversation: () => string
  deleteConversation: (id: string) => void
  switchConversation: (id: string) => void
  addMessage: (message: ChatMessage) => void
  updateMessageContent: (messageId: string, content: string) => void
  setLoading: (loading: boolean) => void
  setTheme: (theme: Theme) => void

  // 持久化
  persist: () => void
  hydrate: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // 初始状态
  conversations: [],
  currentConversationId: null,
  theme: "light",
  isLoading: false,

  // 行为
  createConversation: () => {
    const { conversations } = get()

    // 检查是否已存在空会话
    const emptyConversation = conversations.find((c) => c.messages.length === 0)
    if (emptyConversation) {
      // 切换到已存在的空会话
      set({ currentConversationId: emptyConversation.id })
      get().persist()
      return emptyConversation.id
    }

    // 创建新会话
    const id = generateId()
    const now = Date.now()
    const newConversation: Conversation = {
      id,
      title: "新会话",
      messages: [],
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversationId: id,
    }))
    get().persist()
    return id
  },

  deleteConversation: (id) => {
    set((state) => {
      const filtered = state.conversations.filter((c) => c.id !== id)
      const newCurrentId =
        state.currentConversationId === id
          ? filtered[0]?.id ?? null
          : state.currentConversationId
      return {
        conversations: filtered,
        currentConversationId: newCurrentId,
      }
    })
    get().persist()
  },

  switchConversation: (id) => {
    set((state) => {
      // 更新被点击会话的 updatedAt，使其排到顶部
      const conversations = state.conversations
        .map((conv) =>
          conv.id === id ? { ...conv, updatedAt: Date.now() } : conv
        )
        .sort((a, b) => b.updatedAt - a.updatedAt)
      return {
        conversations,
        currentConversationId: id,
      }
    })
    get().persist()
  },

  addMessage: (message) => {
    set((state) => {
      const conversations = state.conversations.map((conv) => {
        if (conv.id !== state.currentConversationId) return conv
        const messages = [...conv.messages, message]
        return {
          ...conv,
          messages,
          title: conv.messages.length === 0 ? generateTitle(messages) : conv.title,
          updatedAt: Date.now(),
        }
      })
      // 按更新时间排序（最新在前）
      conversations.sort((a, b) => b.updatedAt - a.updatedAt)
      return { conversations }
    })
    get().persist()
  },

  updateMessageContent: (messageId, content) => {
    set((state) => ({
      conversations: state.conversations.map((conv) => {
        if (conv.id !== state.currentConversationId) return conv
        return {
          ...conv,
          messages: conv.messages.map((msg) =>
            msg.id === messageId ? { ...msg, content } : msg
          ),
        }
      }),
    }))
  },

  setLoading: (isLoading) => set({ isLoading }),

  setTheme: (theme) => {
    set({ theme })
    // 应用到 DOM
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark")
      localStorage.setItem(STORAGE_KEYS.theme, theme)
    }
  },

  // 持久化
  persist: () => {
    if (typeof localStorage === "undefined") return
    const { conversations, currentConversationId } = get()
    localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(conversations))
    localStorage.setItem(STORAGE_KEYS.currentId, currentConversationId ?? "")
  },

  hydrate: () => {
    if (typeof localStorage === "undefined") return
    try {
      const conversations = JSON.parse(
        localStorage.getItem(STORAGE_KEYS.conversations) ?? "[]"
      )
      const currentId = localStorage.getItem(STORAGE_KEYS.currentId) || null
      const theme = (localStorage.getItem(STORAGE_KEYS.theme) as Theme) || "light"

      set({
        conversations,
        currentConversationId: currentId,
        theme,
      })

      // 应用主题到 DOM
      document.documentElement.classList.toggle("dark", theme === "dark")
    } catch {
      console.warn("聊天 store hydrate 失败")
    }
  },
}))

// 获取当前会话的 selector
export const selectCurrentConversation = (state: ChatStore): Conversation | null => {
  return state.conversations.find((c) => c.id === state.currentConversationId) ?? null
}
