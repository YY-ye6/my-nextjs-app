"use client"

import { useRef, useEffect, useCallback } from "react"

export function useAutoScroll<T>(dependencies: T[]) {
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      const scrollContainer = containerRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [])

  useEffect(() => {
    // 使用 requestAnimationFrame 确保 DOM 更新后滚动
    requestAnimationFrame(() => {
      scrollToBottom()
    })
  }, [dependencies, scrollToBottom])

  return { containerRef, scrollToBottom }
}
