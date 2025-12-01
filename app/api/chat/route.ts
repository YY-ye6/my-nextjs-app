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

    // 转换为 Dify 格式
    const difyResponse = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
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
      const errorText = await difyResponse.text()
      console.error("Dify API 错误:", errorText)
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
