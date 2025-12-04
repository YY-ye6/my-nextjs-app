# Mini Chat App - MVP 设计文档

> 版本: 1.0.0
> 日期: 2025-12-01
> 状态: 草案
> 分支: `feat/mini-chatapp`

---

## 1. 概述

### 1.1 产品目标

构建一个**最小但完整**的 AI 聊天界面，实现以下功能：

- 支持多轮对话的真实聊天体验
- 区分用户/助手角色
- 实现真实 API 集成（Next.js 代理到 Dify）
- 支持文件上传（图片）
- 本地数据持久化（localStorage）
- 主题切换（深色/浅色模式）
- 干净、可扩展的架构

### 1.2 MVP 原则

| 原则          | 描述                      |
|---------------|--------------------------|
| **功能可用**  | 所有核心功能端到端可用    |
| **简单易用**  | 界面简洁无不必要的复杂度  |
| **结构清晰**  | 关注点分离，便于扩展      |
| **真实环境**  | 不使用 mock，真实 API 集成 |

### 1.3 明确不包含的内容（MVP）

- 流式响应
- Markdown 渲染/代码高亮
- 多模型选择
- 多文件上传
- 拖拽上传
- 文件预览弹窗
- Dify 会话 ID 持久化

---

## 2. 技术栈

### 2.1 已有项目技术栈

| 技术         | 版本      | 作用                         |
|--------------|-----------|------------------------------|
| Next.js      | 16.0.5    | 应用路由、API 路由           |
| React        | 19.2.0    | 使用 React Compiler 的 UI    |
| TypeScript   | 5.x       | 严格类型检查                 |
| Tailwind CSS | v4        | OKLCH 色彩系统               |
| shadcn/ui    | New York  | 组件库                       |
| Lucide React | 0.555.0   | 图标                         |

### 2.2 新增依赖

| 包名         | 用途           | 说明                           |
|--------------|----------------|--------------------------------|
| `zustand`    | 状态管理       | 轻量级、TS 优先、无模板代码    |

### 2.3 选用 Zustand 而非其他方案的原因

| 选项              | 优点                       | 缺点                | 结论         |
|-------------------|----------------------------|---------------------|--------------|
| **Zustand**       | API 简单，中间件支持，TS好 | 生态略小            | **选用**     |
| Redux Toolkit     | 大生态圈，DevTools         | 对 MVP 过于复杂      | 不选         |
| Jotai             | 原子化状态，适合表单       | 学习曲线稍高         | 不选         |
| Context + useReducer | 无额外依赖              | 模板/重渲染问题      | 不选         |

---

## 3. 架构

### 3.1 目录结构

```
app/
├── layout.tsx                    # 根布局（主题提供者）
├── page.tsx                      # 主页（应用启动入口）
├── globals.css                   # Tailwind v4 + 主题变量
├── api/
│   ├── chat/
│   │   └── route.ts              # POST /api/chat → Dify 代理
│   └── files/
│       └── route.ts              # POST /api/files → 文件上传
└── chat/
    ├── page.tsx                  # 聊天页面入口
    ├── layout.tsx                # 聊天专用布局（可选）
    └── components/
        ├── ChatSidebar.tsx       # 会话列表 + 新建对话
        ├── ChatHeader.tsx        # 当前对话头部
        ├── ChatMessages.tsx      # 消息列表容器
        ├── ChatMessage.tsx       # 单条消息气泡
        ├── ChatInput.tsx         # 输入框 + 文件上传
        └── ThemeToggle.tsx       # 主题切换

components/
└── ui/
    ├── button.tsx                # 已有
    ├── input.tsx                 # 通过 shadcn 添加
    ├── textarea.tsx              # 通过 shadcn 添加
    ├── scroll-area.tsx           # 通过 shadcn 添加
    └── avatar.tsx                # 通过 shadcn 添加

lib/
├── utils.ts                      # 已有 cn() 工具
├── routes.ts                     # 已有路由配置
├── types.ts                      # 聊天类型定义
├── api.ts                        # API 客户端函数
└── store.ts                      # Zustand 状态管理

hooks/
└── useAutoScroll.ts              # 自动滚动 hook
```

### 3.2 组件结构

```
ChatPage (page.tsx)
├── ChatSidebar
│   ├── NewChatButton
│   ├── ConversationList
│   │   └── ConversationItem (×n)
│   └── ThemeToggle
└── ChatMain
    ├── ChatHeader
    │   ├── ConversationTitle
    │   └── DeleteButton
    ├── ChatMessages
    │   └── ChatMessage (×n)
    │       ├── Avatar
    │       ├── MessageContent
    │       └── FilePreview (可选)
    └── ChatInput
        ├── FileUploadButton
        ├── TextArea
        └── SendButton
```

### 3.3 数据流

```
用户输入 → ChatInput → Store（乐观更新）→ API 调用
                                 ↓
                              UI 更新
                                 ↓
API 响应 → Store（添加助手消息）→ UI 更新 → 自动滚动
```

---

## 4. 类型定义

### 4.1 核心类型 (`lib/types.ts`)

```typescript
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
```

### 4.2 Store 类型

```typescript
export interface ChatStore {
  // 状态
  conversations: Conversation[]
  currentConversationId: string | null
  theme: Theme
  isLoading: boolean

  // 计算值（通过 selector 实现）
  currentConversation: Conversation | null

  // 行为
  createConversation: () => string
  deleteConversation: (id: string) => void
  switchConversation: (id: string) => void
  addMessage: (message: ChatMessage) => void
  setLoading: (loading: boolean) => void
  setTheme: (theme: Theme) => void

  // 持久化
  hydrate: () => void
}
```

---

## 5. 状态管理

### 5.1 Zustand Store 实现

```typescript
// lib/store.ts
import { create } from "zustand"
import type { ChatStore, Conversation, ChatMessage, Theme } from "./types"

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

export const useChatStore = create<ChatStore>((set, get) => ({
  // 初始状态
  conversations: [],
  currentConversationId: null,
  theme: "light",
  isLoading: false,

  // 计算值
  get currentConversation() {
    const { conversations, currentConversationId } = get()
    return conversations.find((c) => c.id === currentConversationId) ?? null
  },

  // 行为
  createConversation: () => {
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
    set({ currentConversationId: id })
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

  setLoading: (isLoading) => set({ isLoading }),

  setTheme: (theme) => {
    set({ theme })
    // 应用到 DOM
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  },

  // 持久化
  persist: () => {
    const { conversations, currentConversationId } = get()
    localStorage.setItem(STORAGE_KEYS.conversations, JSON.stringify(conversations))
    localStorage.setItem(STORAGE_KEYS.currentId, currentConversationId ?? "")
  },

  hydrate: () => {
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
```

### 5.2 为何选手动持久化（不用 Zustand Persist）

| 方案         | 优点                          | 缺点       |
|--------------|-------------------------------|------------|
| **手动**     | 完全控制、逻辑清晰、易迁移 Supabase | 代码略多   |
| Zustand Persist | 代码少                    | 黑盒、不易迁移 |

**结论**: 采用手动持久化以获得明确控制及后续集成 Supabase 的便利。

---

## 6. API 设计

### 6.1 聊天 API (`/api/chat`)

**接口**: `POST /api/chat`

**请求**:
```typescript
{
  messages: ChatMessage[]
}
```

**响应**:
```typescript
{
  id: string
  role: "assistant"
  content: string
}
```

**实现** (`app/api/chat/route.ts`):
```typescript
import { NextRequest, NextResponse } from "next/server"

const DIFY_API_URL = process.env.DIFY_API_URL!
const DIFY_API_KEY = process.env.DIFY_API_KEY!

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // 转换为 Dify 格式
    const difyResponse = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${DIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {},
        query: messages[messages.length - 1].content,
        response_mode: "blocking",
        user: "user-default",
      }),
    })

    if (!difyResponse.ok) {
      throw new Error("Dify API 错误")
    }

    const data = await difyResponse.json()

    return NextResponse.json({
      id: data.message_id || crypto.randomUUID(),
      role: "assistant",
      content: data.answer,
    })
  } catch (error) {
    console.error("Chat API 错误:", error)
    return NextResponse.json(
      { error: "获取响应失败" },
      { status: 500 }
    )
  }
}
```

### 6.2 文件上传 API (`/api/files`)

**接口**: `POST /api/files`

**请求**: 携带文件的 `FormData`

**响应**:
```typescript
{
  url: string
  name: string
  type: string
}
```

**实现** (`app/api/files/route.ts`):
```typescript
import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

const UPLOAD_DIR = join(process.cwd(), "public", "uploads")

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "未提供文件" }, { status: 400 })
    }

    // 检查文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只允许上传图片" }, { status: 400 })
    }

    // 检查文件大小（最大 5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "文件过大（最大 5MB）" }, { status: 400 })
    }

    // 保证上传目录存在
    await mkdir(UPLOAD_DIR, { recursive: true })

    // 生成唯一文件名
    const ext = file.name.split(".").pop()
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const filepath = join(UPLOAD_DIR, filename)

    // 写入文件
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    return NextResponse.json({
      url: `/uploads/${filename}`,
      name: file.name,
      type: file.type,
    })
  } catch (error) {
    console.error("文件上传错误:", error)
    return NextResponse.json({ error: "上传失败" }, { status: 500 })
  }
}
```

### 6.3 API 客户端 (`lib/api.ts`)

```typescript
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
```

---

## 7. 组件规范说明

### 7.1 ChatSidebar

**用途**：展示会话列表和导航

**属性**：无（直接使用 store）

**职责**：
- 新建会话按钮
- 会话列表按 `updatedAt` 排序
- 当前会话高亮
- 底部有主题切换

**UI 结构**：
```
┌─────────────────────┐
│ [+ 新会话]          │
├─────────────────────┤
│ ● 会话1             │ ← 当前高亮
│   会话2             │
│   会话3             │
│   ...               │
├─────────────────────┤
│ [🌙/☀️ 主题]        │
└─────────────────────┘
```

### 7.2 ChatHeader

**用途**：展示当前会话信息与操作

**属性**：`conversation: Conversation | null`

**职责**：
- 显示会话标题
- 删除按钮（带确认）

### 7.3 ChatMessages

**用途**：展示消息列表且自动滚动

**属性**：`messages: ChatMessage[]`

**职责**：
- 渲染消息列表
- 新消息自动滚动
- 无消息时空状态

### 7.4 ChatMessage

**用途**：渲染单条消息气泡

**属性**：`message: ChatMessage`

**职责**：
- 根据角色显示不同样式（用户右侧，助手左侧）
- 显示头像
- 渲染文本内容
- 若有附件显示图片预览

**UI 结构**：
```
用户消息:
                    ┌─────────────────────┐
                    │ 消息内容...         │ [头像]
                    │ [图片缩略图]         │
                    └─────────────────────┘

助手消息:
┌─────────────────────┐
│ [头像] 消息...      │
└─────────────────────┘
```

### 7.5 ChatInput

**用途**：消息编写与发送

**属性**：无（直接用 store）

**状态**：
- `input: string` - 文本内容
- `file: File | null` - 待发送文件
- `isUploading: boolean` - 上传中

**职责**：
- 文本输入（自动高度）
- 文件选择（限制图片）
- 发送前图片预览
- 发送按钮（内容为空或加载时禁用）
- 回车发送（Shift+Enter 换行）

**UI 结构**：
```
┌─────────────────────────────────────────┐
│ [图片预览]                  [× 删除]    │  ← 选中文件才有
├─────────────────────────────────────────┤
│ [📎] │ 输入消息...            │ [➤]    │
└─────────────────────────────────────────┘
```

### 7.6 ThemeToggle

**用途**：明暗主题切换

**属性**：无（直接用 store）

**行为**：
- 暗色模式显示太阳图标
- 亮色模式显示月亮图标
- 点击切换

---

## 8. UI/UX 规范

### 8.1 布局

```
┌────────────────────────────────────────────────────────────┐
│  侧边栏 (280px)  │           主区                         │
│                  │                                        │
│  [+ 新会话]      │  ┌─────────────────────────────────┐  │
│                  │  │ 头部: 标题         [删除]       │  │
│  会话列表:       │  ├─────────────────────────────────┤  │
│  ● 会话1         │  │                                 │  │
│    会话2         │  │         消息区域                 │  │
│    会话3         │  │                                 │  │
│                  │  │                                 │  │
│                  │  │                                 │  │
│                  │  ├─────────────────────────────────┤  │
│  [主题切换]      │  │         输入区域                 │  │
│                  │  └─────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 8.2 响应式行为

| 断点          | 侧边栏    | 行为             |
|---------------|-----------|------------------|
| `>= lg` (1024px) | 固定可见 | 左右结构 |
| `< lg`           | 隐藏/抽屉 | 汉堡菜单切换 |

### 8.3 色彩方案

使用 Tailwind v4 OKLCH 主题变量：

| 元素             | 浅色        | 深色        |
|------------------|------------|------------|
| 背景             | `--background` | `--background` |
| 侧边栏           | `--sidebar`    | `--sidebar`    |
| 用户气泡         | `--primary`    | `--primary`    |
| 助手气泡         | `--muted`      | `--muted`      |
| 文字             | `--foreground` | `--foreground` |
| 边框             | `--border`     | `--border`     |

### 8.4 动效

- 消息出现: `animate-in fade-in slide-in-from-bottom-2`
- 侧边栏切换: `transition-transform duration-200`
- 按钮悬停: `transition-colors`
- 加载: 跳动点

---

## 9. 用户流程

### 9.1 首次访问流程

```
1. 用户访问 /chat
2. Store 从 localStorage hydrate (初始为空)
3. 显示空状态：“开始新会话”
4. 用户点击“新会话”
5. 创建新会话并自动选中
6. 用户输入并发送消息
7. 乐观 UI，用户消息直接出现
8. 发起 API 请求
9. 助手消息追加
10. 自动滚到最底部
11. 从首条消息生成会话标题
```

### 9.2 回访流程

```
1. 用户访问 /chat
2. Store 从 localStorage hydrate
3. 加载之前会话列表
4. 自动选中最后活跃会话
5. 展示消息
6. 继续聊天
```

### 9.3 文件上传流程

```
1. 用户点击文件按钮
2. 打开文件选择框（accept="image/*"）
3. 选择图片
4. 输入区显示预览
5. 点击发送
6. 文件上传到 /api/files
7. 上传响应返回
8. 创建携带文件的用户消息
9. 消息发送到 /api/chat
10. 消息中显示缩略图
```

### 9.4 主题切换流程

```
1. 用户点击主题切换
2. Store 更新主题状态
3. DOM class 增删 "dark"
4. localStorage 持久化
5. Tailwind dark: 样式生效
```

---

## 10. 环境变量

```env
# .env.local
DIFY_API_URL=https://api.dify.ai/v1
DIFY_API_KEY=your-dify-api-key
```

---

## 11. 实施阶段

### 阶段 1：基础（第 1 天）

1. 安装依赖（`zustand`）
2. 添加 shadcn/ui 组件（`input`、`textarea`、`scroll-area`、`avatar`）
3. 创建类型定义（`lib/types.ts`）
4. 实现 Zustand store（`lib/store.ts`）
5. 路由加入 `lib/routes.ts`

### 阶段 2：API 层（第1-2天）

1. 创建 `/api/chat/route.ts`
2. 创建 `/api/files/route.ts`
3. 实现 API 客户端（`lib/api.ts`）
4. API 接口测试

### 阶段 3：核心组件（第2-3天）

1. 创建页面结构（`app/chat/page.tsx`）
2. 实现 `ChatSidebar`
3. 实现 `ChatHeader`
4. 实现 `ChatMessages` + `ChatMessage`
5. 实现 `ChatInput`

### 阶段 4：功能开发（第3天）

1. 文件上传集成
2. 主题切换
3. 自动滚动 hook
4. localStorage 持久化测试

### 阶段 5：完善打磨（第4天）

1. 空状态
2. 加载状态
3. 错误处理
4. 响应式布局
5. 最终测试

---

## 12. 测试清单

### 功能测试

- [ ] 新建会话
- [ ] 切换会话
- [ ] 删除会话
- [ ] 发送文本消息
- [ ] 接收助手回复
- [ ] 上传并发送图片
- [ ] 消息中可查看图片
- [ ] 切换主题
- [ ] 刷新后持久化存在
- [ ] 新消息自动滚动

### 边界测试

- [ ] 会话列表为空
- [ ] 超长消息
- [ ] 大图片
- [ ] 网络异常
- [ ] 非法文件类型
- [ ] 快速连续发消息

### 响应式测试

- [ ] 桌面端 (>1024px)
- [ ] 平板 (768-1024px)
- [ ] 移动端 (<768px)

---

## 13. 后续扩展方向（MVP 后）

| 功能                  | 复杂度  | 优先级   |
|-----------------------|---------|----------|
| 流式响应              | 中      | 高       |
| Markdown 渲染         | 低      | 高       |
| 代码高亮              | 中      | 中       |
| 多模型选择            | 中      | 中       |
| 会话搜索              | 低      | 低       |
| 导出会话              | 低      | 低       |
| Dify 会话 ID 支持     | 中      | 中       |
| Supabase 持久化       | 高      | Future   |
| 多文件上传            | 中      | Future   |

---

## 14. 安装依赖

```bash
# 状态管理
pnpm add zustand

# shadcn/ui 基础组件
pnpm dlx shadcn@latest add input textarea scroll-area avatar
```

---

## 15. 文件清单

### 新建文件

```
lib/
├── types.ts          # 类型定义
├── store.ts          # Zustand 状态
└── api.ts            # API 客户端

app/
├── api/
│   ├── chat/
│   │   └── route.ts  # 聊天 API
│   └── files/
│       └── route.ts  # 文件上传 API
└── chat/
    ├── page.tsx      # 聊天页面
    └── components/
        ├── ChatSidebar.tsx
        ├── ChatHeader.tsx
        ├── ChatMessages.tsx
        ├── ChatMessage.tsx
        ├── ChatInput.tsx
        └── ThemeToggle.tsx

hooks/
└── useAutoScroll.ts  # 自动滚动 hook
```

### 需修改文件

```
lib/routes.ts         # 增加聊天路由
```

---

## 附录A：组件 API 参考

### ChatMessage Props

```typescript
interface ChatMessageProps {
  message: ChatMessage
}
```

### ChatInput 事件

| 事件           | 触发             | 动作         |
|----------------|------------------|--------------|
| `onSubmit`     | 回车（非Shift）  | 发送消息     |
| `onFileSelect` | 文件选择框       | 设置待上传文件 |
| `onFileRemove` | 点击 ×           | 清除待上传文件 |

### Store 选择器

```typescript
// 获取当前会话
const conversation = useChatStore((s) =>
  s.conversations.find((c) => c.id === s.currentConversationId)
)

// 全部会话（已排序）
const conversations = useChatStore((s) => s.conversations)

// 获取加载状态
const isLoading = useChatStore((s) => s.isLoading)
```

---

## 附录B：CSS 类参考

### 消息气泡

```css
/* 用户消息 */
.message-user {
  @apply bg-primary text-primary-foreground ml-auto max-w-[80%] rounded-2xl rounded-br-md px-4 py-2;
}

/* 助手消息 */
.message-assistant {
  @apply bg-muted text-muted-foreground mr-auto max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2;
}
```

### 侧边栏

```css
.sidebar {
  @apply w-[280px] border-r border-border bg-sidebar flex flex-col h-full;
}

.conversation-item {
  @apply px-3 py-2 rounded-lg cursor-pointer hover:bg-sidebar-accent truncate;
}

.conversation-item-active {
  @apply bg-sidebar-accent font-medium;
}
```

---

*文档结束*
