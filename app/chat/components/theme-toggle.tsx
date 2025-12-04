"use client"

import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChatStore } from "@/lib/store"

export function ThemeToggle() {
  const theme = useChatStore((s) => s.theme)
  const setTheme = useChatStore((s) => s.setTheme)

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-full justify-start gap-2"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4" />
          浅色模式
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" />
          深色模式
        </>
      )}
    </Button>
  )
}
