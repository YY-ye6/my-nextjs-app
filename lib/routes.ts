import { LucideIcon, Palette, MessageSquare } from "lucide-react"

export interface Route {
  path: string
  title: string
  description: string
  icon: LucideIcon
  color: string
}

export const routes: Route[] = [
  {
    path: "/wallpaper",
    title: "壁纸生成器",
    description: "创建精美的 AI 壁纸",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
  },
  {
    path: "/chat",
    title: "Mini Chat",
    description: "AI 聊天助手",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
  },
]
