import { LucideIcon, Palette, Home, Settings, FileText } from "lucide-react"

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
  // 在这里添加更多路由
  // {
  //   path: "/your-route",
  //   title: "标题",
  //   description: "描述",
  //   icon: Home,
  //   color: "from-blue-500 to-cyan-500",
  // },
]
