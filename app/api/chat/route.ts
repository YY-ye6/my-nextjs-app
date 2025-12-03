import { NextRequest, NextResponse } from "next/server"

const DIFY_API_URL = process.env.DIFY_API_URL
const DIFY_API_KEY = process.env.DIFY_API_KEY

export async function POST(request: NextRequest) {
  try {
    if (!DIFY_API_URL || !DIFY_API_KEY) {
      return NextResponse.json(
        { error: "Dify API 配置缺失" },
        { status: 500 }
      )
    }

    const { messages } = await request.json()

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "消息不能为空" },
        { status: 400 }
      )
    }

    // 使用 streaming 模式调用 Dify API
    const difyResponse = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {},
        query: messages[messages.length - 1].content,
        response_mode: "streaming",
        user: "user-default",
      }),
    })

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text()
      console.error("Dify API 错误:", errorText)
      throw new Error("Dify API 错误")
    }

    // 转发流式响应
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const reader = difyResponse.body?.getReader()
        if (!reader) {
          controller.close()
          return
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
                if (data === "[DONE]") continue

                try {
                  const parsed = JSON.parse(data)
                  // 提取 answer 字段中的文本
                  if (parsed.event === "message" && parsed.answer) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: parsed.answer, id: parsed.message_id })}\n\n`)
                    )
                  } else if (parsed.event === "message_end") {
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"))
                  }
                } catch {
                  // 忽略解析错误
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API 错误:", error)
    return NextResponse.json(
      { error: "获取响应失败" },
      { status: 500 }
    )
  }
}
