"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Shuffle,
  Download,
  Sun,
  Moon,
  Sparkles,
  Quote,
  Palette,
} from "lucide-react"

// 治愈系名言集合
const quotes = [
  {
    text: "生活不是等待暴风雨过去，而是学会在雨中起舞。",
    author: "维维安·格林",
  },
  {
    text: "每一个不曾起舞的日子，都是对生命的辜负。",
    author: "尼采",
  },
  {
    text: "温柔的人是上天的宝贝。",
    author: "宫崎骏",
  },
  {
    text: "愿你一生努力，一生被爱，想要的都拥有，得不到的都释怀。",
    author: "八月长安",
  },
  {
    text: "世界上只有一种真正的英雄主义，那就是认清生活的真相后依然热爱生活。",
    author: "罗曼·罗兰",
  },
  {
    text: "把每一个平凡的日子，过成一首诗。",
    author: "汪曾祺",
  },
  {
    text: "你要悄悄拔尖，然后惊艳所有人。",
    author: "佚名",
  },
  {
    text: "星光不问赶路人，时光不负有心人。",
    author: "大冰",
  },
  {
    text: "慢慢来，一切都来得及。",
    author: "佚名",
  },
  {
    text: "生命中最好的事情就是那些值得等待的事情。",
    author: "佚名",
  },
  {
    text: "Do not wait to strike till the iron is hot; but make it hot by striking.",
    author: "William Butler Yeats",
  },
  {
    text: "As an organizer I start from where the world is, as it is, not as I would like it to be.",
    author: "Saul Alinsky",
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde",
  },
]

// 主题配置
type Theme = "soft" | "dark" | "neon"

interface GradientColors {
  start: string
  middle: string
  end: string
}

interface ThemeConfig {
  name: string
  icon: typeof Sun
  gradients: GradientColors[]
  tailwindGradients: string[]
  cardBg: string
  cardText: string
  cardBorder: string
  buttonStyle: string
  textColor: string
}

const themes: Record<Theme, ThemeConfig> = {
  soft: {
    name: "柔和风",
    icon: Sun,
    gradients: [
      { start: "#fecdd3", middle: "#fbcfe8", end: "#fed7aa" },
      { start: "#bae6fd", middle: "#a5f3fc", end: "#99f6e4" },
      { start: "#ddd6fe", middle: "#e9d5ff", end: "#f5d0fe" },
      { start: "#fde68a", middle: "#fef08a", end: "#d9f99d" },
      { start: "#fbcfe8", middle: "#fda4af", end: "#fecaca" },
      { start: "#a7f3d0", middle: "#99f6e4", end: "#a5f3fc" },
    ],
    tailwindGradients: [
      "from-rose-200 via-pink-200 to-orange-200",
      "from-sky-200 via-cyan-200 to-teal-200",
      "from-violet-200 via-purple-200 to-fuchsia-200",
      "from-amber-200 via-yellow-200 to-lime-200",
      "from-pink-200 via-rose-300 to-red-200",
      "from-emerald-200 via-teal-200 to-cyan-200",
    ],
    cardBg: "bg-white/60",
    cardText: "text-gray-800",
    cardBorder: "border-white/50",
    buttonStyle: "bg-white/70 hover:bg-white/90 text-gray-700",
    textColor: "#1f2937",
  },
  dark: {
    name: "深色",
    icon: Moon,
    gradients: [
      { start: "#0f172a", middle: "#581c87", end: "#0f172a" },
      { start: "#111827", middle: "#1e3a8a", end: "#111827" },
      { start: "#18181b", middle: "#064e3b", end: "#18181b" },
      { start: "#171717", middle: "#881337", end: "#171717" },
      { start: "#1c1917", middle: "#78350f", end: "#1c1917" },
      { start: "#0f172a", middle: "#155e75", end: "#0f172a" },
    ],
    tailwindGradients: [
      "from-slate-900 via-purple-900 to-slate-900",
      "from-gray-900 via-blue-900 to-gray-900",
      "from-zinc-900 via-emerald-900 to-zinc-900",
      "from-neutral-900 via-rose-900 to-neutral-900",
      "from-stone-900 via-amber-900 to-stone-900",
      "from-slate-900 via-cyan-900 to-slate-900",
    ],
    cardBg: "bg-black/40",
    cardText: "text-white",
    cardBorder: "border-white/10",
    buttonStyle: "bg-white/10 hover:bg-white/20 text-white",
    textColor: "#ffffff",
  },
  neon: {
    name: "霓虹",
    icon: Sparkles,
    gradients: [
      { start: "#d946ef", middle: "#a855f7", end: "#06b6d4" },
      { start: "#f97316", middle: "#ec4899", end: "#a855f7" },
      { start: "#4ade80", middle: "#06b6d4", end: "#3b82f6" },
      { start: "#facc15", middle: "#f97316", end: "#ef4444" },
      { start: "#ec4899", middle: "#ef4444", end: "#eab308" },
      { start: "#6366f1", middle: "#a855f7", end: "#ec4899" },
    ],
    tailwindGradients: [
      "from-fuchsia-500 via-purple-500 to-cyan-500",
      "from-orange-500 via-pink-500 to-purple-500",
      "from-green-400 via-cyan-500 to-blue-500",
      "from-yellow-400 via-orange-500 to-red-500",
      "from-pink-500 via-red-500 to-yellow-500",
      "from-indigo-500 via-purple-500 to-pink-500",
    ],
    cardBg: "bg-black/30",
    cardText: "text-white",
    cardBorder: "border-white/20",
    buttonStyle: "bg-white/20 hover:bg-white/30 text-white",
    textColor: "#ffffff",
  },
}

export function WallpaperGenerator() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("soft")
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const theme = themes[currentTheme]
  const gradient = theme.tailwindGradients[currentGradientIndex]
  const gradientColors = theme.gradients[currentGradientIndex]
  const quote = quotes[currentQuoteIndex]

  // 随机切换壁纸和名言
  const handleShuffle = () => {
    setIsAnimating(true)

    const newGradientIndex = Math.floor(Math.random() * theme.gradients.length)
    const newQuoteIndex = Math.floor(Math.random() * quotes.length)

    setCurrentGradientIndex(newGradientIndex)
    setCurrentQuoteIndex(newQuoteIndex)

    setTimeout(() => setIsAnimating(false), 500)
  }

  // 切换主题
  const handleThemeChange = (newTheme: Theme) => {
    setIsAnimating(true)
    setCurrentTheme(newTheme)
    setCurrentGradientIndex(0)
    setTimeout(() => setIsAnimating(false), 500)
  }

  // 使用 Canvas API 绘制并保存壁纸
  const handleDownload = useCallback(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 设置高分辨率
    const width = 1920
    const height = 1080
    canvas.width = width
    canvas.height = height

    // 绘制渐变背景
    const grd = ctx.createLinearGradient(0, 0, width, height)
    grd.addColorStop(0, gradientColors.start)
    grd.addColorStop(0.5, gradientColors.middle)
    grd.addColorStop(1, gradientColors.end)
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)

    // 添加装饰性模糊圆形
    ctx.globalAlpha = 0.15
    ctx.beginPath()
    ctx.arc(width * 0.85, height * 0.15, 300, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    ctx.beginPath()
    ctx.arc(width * 0.15, height * 0.85, 350, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    ctx.globalAlpha = 1

    // 绘制半透明卡片背景
    const cardWidth = 900
    const cardHeight = 400
    const cardX = (width - cardWidth) / 2
    const cardY = (height - cardHeight) / 2
    const cardRadius = 40

    ctx.globalAlpha = currentTheme === "soft" ? 0.6 : 0.4
    ctx.fillStyle = currentTheme === "soft" ? "#ffffff" : "#000000"
    ctx.beginPath()
    ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cardRadius)
    ctx.fill()
    ctx.globalAlpha = 1

    // 绘制引号符号
    ctx.font = "bold 60px serif"
    ctx.fillStyle = theme.textColor
    ctx.globalAlpha = 0.3
    ctx.fillText("\u201C", cardX + 60, cardY + 90)
    ctx.globalAlpha = 1

    // 绘制名言文字
    ctx.font = "32px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    ctx.fillStyle = theme.textColor
    ctx.textAlign = "center"

    // 自动换行
    const maxWidth = cardWidth - 120
    const lineHeight = 50
    const words = quote.text
    let line = ""
    let y = cardY + 180
    const lines: string[] = []

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && line !== "") {
        lines.push(line)
        line = words[i]
      } else {
        line = testLine
      }
    }
    lines.push(line)

    // 居中绘制所有行
    const totalHeight = lines.length * lineHeight
    y = cardY + (cardHeight - totalHeight) / 2 + 40

    lines.forEach((l) => {
      ctx.fillText(l, width / 2, y)
      y += lineHeight
    })

    // 绘制作者
    ctx.font = "24px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    ctx.globalAlpha = 0.7
    ctx.fillText(`— ${quote.author}`, width / 2, cardY + cardHeight - 60)
    ctx.globalAlpha = 1

    // 下载
    const link = document.createElement("a")
    link.download = `wallpaper-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }, [gradientColors, quote, theme.textColor, currentTheme])

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 隐藏的 canvas 用于导出 */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 壁纸区域 */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br transition-all duration-700 ease-in-out",
          gradient,
          isAnimating && "scale-105 opacity-90"
        )}
      >
        {/* 装饰性图案 */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              "absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl transition-all duration-1000",
              currentTheme === "soft" && "bg-white/30",
              currentTheme === "dark" && "bg-white/5",
              currentTheme === "neon" && "bg-white/20"
            )}
          />
          <div
            className={cn(
              "absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl transition-all duration-1000",
              currentTheme === "soft" && "bg-white/40",
              currentTheme === "dark" && "bg-white/5",
              currentTheme === "neon" && "bg-white/10"
            )}
          />
          <div
            className={cn(
              "absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-1000",
              currentTheme === "soft" && "bg-white/20",
              currentTheme === "dark" && "bg-purple-500/10",
              currentTheme === "neon" && "bg-cyan-400/20"
            )}
          />
        </div>

        {/* 名言卡片 */}
        <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
          <div
            className={cn(
              "max-w-2xl transform rounded-3xl border p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 md:p-12",
              theme.cardBg,
              theme.cardBorder,
              isAnimating && "scale-95 opacity-0"
            )}
          >
            {/* 引号装饰 */}
            <Quote className={cn("mb-4 h-10 w-10 opacity-30", theme.cardText)} />

            {/* 名言内容 */}
            <blockquote className="space-y-6">
              <p
                className={cn(
                  "text-xl font-medium leading-relaxed md:text-2xl lg:text-3xl",
                  theme.cardText
                )}
              >
                {quote.text}
              </p>
              <footer
                className={cn(
                  "text-right text-base opacity-70 md:text-lg",
                  theme.cardText
                )}
              >
                — {quote.author}
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* 控制栏 */}
      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border p-2 shadow-2xl backdrop-blur-xl md:gap-4 md:p-3",
            theme.cardBg,
            theme.cardBorder
          )}
        >
          {/* 主题切换按钮 */}
          <div className="flex items-center gap-1">
            <Palette className={cn("ml-2 h-4 w-4 opacity-50", theme.cardText)} />
            {(Object.keys(themes) as Theme[]).map((themeKey) => {
              const ThemeIcon = themes[themeKey].icon
              return (
                <Button
                  key={themeKey}
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleThemeChange(themeKey)}
                  className={cn(
                    "rounded-full transition-all",
                    currentTheme === themeKey
                      ? "bg-primary text-primary-foreground"
                      : theme.buttonStyle
                  )}
                  title={themes[themeKey].name}
                >
                  <ThemeIcon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>

          {/* 分隔线 */}
          <div
            className={cn(
              "h-6 w-px",
              currentTheme === "soft" ? "bg-gray-300" : "bg-white/20"
            )}
          />

          {/* 刷新按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShuffle}
            className={cn("rounded-full transition-all", theme.buttonStyle)}
            title="换一张"
          >
            <Shuffle className="h-5 w-5" />
          </Button>

          {/* 下载按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className={cn("rounded-full transition-all", theme.buttonStyle)}
            title="保存壁纸"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 右下角刷新按钮 */}
      <button
        onClick={handleShuffle}
        className={cn(
          "fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full border shadow-2xl backdrop-blur-xl transition-all hover:scale-110 active:scale-95",
          theme.cardBg,
          theme.cardBorder
        )}
        title="换一张"
      >
        <Shuffle className={cn("h-6 w-6", theme.cardText)} />
      </button>
    </div>
  )
}
