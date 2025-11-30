"use client"

import { useState, useRef } from "react"
import html2canvas from "html2canvas"
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

interface ThemeConfig {
  name: string
  icon: typeof Sun
  gradients: string[]
  cardBg: string
  cardText: string
  cardBorder: string
  buttonStyle: string
}

const themes: Record<Theme, ThemeConfig> = {
  soft: {
    name: "柔和风",
    icon: Sun,
    gradients: [
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
  },
  dark: {
    name: "深色",
    icon: Moon,
    gradients: [
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
  },
  neon: {
    name: "霓虹",
    icon: Sparkles,
    gradients: [
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
  },
}

export function WallpaperGenerator() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("soft")
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0)
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const wallpaperRef = useRef<HTMLDivElement>(null)

  const theme = themes[currentTheme]
  const gradient = theme.gradients[currentGradientIndex]
  const quote = quotes[currentQuoteIndex]

  // 随机切换壁纸和名言
  const handleShuffle = () => {
    setIsAnimating(true)

    // 随机选择新的渐变和名言
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

  // 保存为 PNG
  const handleDownload = async () => {
    if (!wallpaperRef.current) return

    try {
      const canvas = await html2canvas(wallpaperRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })

      const link = document.createElement("a")
      link.download = `wallpaper-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 壁纸区域 */}
      <div
        ref={wallpaperRef}
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-700 ease-in-out",
          gradient,
          isAnimating && "scale-105 opacity-90"
        )}
      >
        {/* 装饰性图案 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 浮动圆形装饰 */}
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
            <Quote
              className={cn(
                "mb-4 h-10 w-10 opacity-30",
                theme.cardText
              )}
            />

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
            <Palette
              className={cn("ml-2 h-4 w-4 opacity-50", theme.cardText)}
            />
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

      {/* 右下角刷新计数 */}
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
